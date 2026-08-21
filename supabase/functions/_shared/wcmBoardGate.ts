/**
 * BOARD_GATE authority invariant (regression fix).
 *
 * For an OPEN BOARD_GATE need, `target_document_id` is the document the human
 * authority acts on. For APPROVE_FREEZE it MUST be the freezable Candidate
 * (`category = BOARD_CANDIDATE`), never a BOARD_REPORT. The Board Report stays
 * a related, readable document but is never the operational target.
 */

export const BOARD_CANDIDATE_CATEGORY = 'BOARD_CANDIDATE'

export const isBoardCandidateCategory = (category: unknown) =>
  String(category ?? '').trim().toUpperCase() === BOARD_CANDIDATE_CATEGORY

export const isBoardGateNeed = (need: { need_type?: unknown }) =>
  String(need.need_type ?? '').trim().toUpperCase() === 'BOARD_GATE'

const CLOSED_STATUSES = ['closed', 'resolved', 'done', 'cancelled', 'canceled']

export const isOpenNeedStatus = (status: unknown) =>
  !status || !CLOSED_STATUSES.includes(String(status).trim().toLowerCase())

/** True when the need's requested action is an approve+freeze authority. */
export const requestsApproveFreeze = (need: { action_requested?: unknown }) => {
  const action = String(need.action_requested ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
  return action.includes('APPROVE_FREEZE') || action.includes('APPROVE + FREEZE')
}

export const relatedDocumentIds = (need: {
  related_document_ids?: unknown
  target_document_id?: unknown
}): string[] => {
  const raw = Array.isArray(need.related_document_ids) ? need.related_document_ids : []
  const ids = raw.map((v) => String(v))
  const target = need.target_document_id ? String(need.target_document_id) : null
  if (target && !ids.includes(target)) ids.push(target)
  return ids
}

export type BoardGateDoc = { document_id?: unknown; category?: unknown }

/**
 * Cross-collection semantic validation used by the projector.
 * Returns an error descriptor, or null when the payload is coherent.
 */
export function validateBoardGateTargets(
  needs: Record<string, unknown>[],
  documents: BoardGateDoc[],
): { error: string; code: string; need_id?: string; target_document_id?: string } | null {
  const byId = new Map<string, BoardGateDoc>()
  for (const doc of documents) {
    if (doc?.document_id) byId.set(String(doc.document_id), doc)
  }

  for (const need of needs) {
    if (!isBoardGateNeed(need)) continue
    if (!isOpenNeedStatus(need.status)) continue
    if (!requestsApproveFreeze(need)) continue

    const needId = need.need_id ? String(need.need_id) : ''
    const target = need.target_document_id ? String(need.target_document_id) : null

    if (!target) {
      return {
        code: 'INVALID_APPROVE_TARGET',
        need_id: needId,
        error:
          `Need BOARD_GATE "${needId}": APPROVE_FREEZE richiede un target_document_id che punti alla Candidate (category=BOARD_CANDIDATE).`,
      }
    }
    if (!relatedDocumentIds(need).includes(target)) {
      return {
        code: 'INVALID_APPROVE_TARGET',
        need_id: needId,
        target_document_id: target,
        error:
          `Need BOARD_GATE "${needId}": il target_document_id "${target}" non è tra i documenti correlati al Need.`,
      }
    }
    const doc = byId.get(target)
    if (!doc) {
      return {
        code: 'INVALID_APPROVE_TARGET',
        need_id: needId,
        target_document_id: target,
        error:
          `Need BOARD_GATE "${needId}": il target_document_id "${target}" non esiste nella collezione documents del payload.`,
      }
    }
    if (!isBoardCandidateCategory(doc.category)) {
      return {
        code: 'INVALID_APPROVE_TARGET',
        need_id: needId,
        target_document_id: target,
        error:
          `Need BOARD_GATE "${needId}": il target di APPROVE_FREEZE deve essere una Candidate (category=BOARD_CANDIDATE), non "${String(doc.category ?? 'sconosciuta')}".`,
      }
    }
  }

  return null
}
