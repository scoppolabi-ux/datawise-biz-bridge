/**
 * WCM Learning V0.8 — boundary normalization for the GLOBAL method learning
 * read-model. GitHub main stays the source of truth; this module maps the
 * canonical `wcm/kb/learning/*.json` shapes deterministically onto DB columns.
 *
 * Strictness invariant: genuinely unknown keys are rejected (400). Canonical
 * metadata keys are accepted explicitly and either validated or dropped, never
 * silently folded into another column, and never invented.
 */

export type ParseError = { error: string; fields?: string[]; index?: number }

export const normalize = (value: unknown): unknown => {
  if (value === undefined) return null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
  }
  return value
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v)

const asJsonArray = (v: unknown): unknown[] | null => (Array.isArray(v) ? v : null)

// ---------------------------------------------------------------- health

export const METHOD_HEALTH_FIELDS = [
  'checked_at',
  'health_status',
  'method_integrity_score',
  'score_method',
  'last_material_method_delta_sha',
  'last_material_method_delta_at',
  'components',
  'metrics',
  'issues',
  'source_path',
  'source_sha',
] as readonly string[]

/** Accepted but not persisted verbatim. */
export const METHOD_HEALTH_META_KEYS = ['schema_version', 'system_id'] as readonly string[]

export function parseMethodHealth(
  input: unknown,
): { row: Record<string, unknown>; metadata: Record<string, unknown> } | ParseError {
  if (!isObject(input)) return { error: 'method_health must be an object' }

  const unknown = Object.keys(input).filter(
    (k) => !METHOD_HEALTH_FIELDS.includes(k) && !METHOD_HEALTH_META_KEYS.includes(k),
  )
  if (unknown.length > 0) return { error: 'Unsupported method_health fields', fields: unknown }

  if (input.system_id !== undefined && input.system_id !== null && input.system_id !== 'wcm') {
    return { error: 'method_health.system_id must be "wcm"' }
  }

  const row: Record<string, unknown> = { system_id: 'wcm' }
  for (const field of METHOD_HEALTH_FIELDS) {
    if (!(field in input)) continue
    const value = normalize(input[field])
    if (field === 'components' || field === 'metrics') {
      if (value !== null && !isObject(value)) return { error: `method_health.${field} must be an object` }
      row[field] = value ?? {}
    } else if (field === 'issues') {
      const arr = value === null ? [] : asJsonArray(value)
      if (arr === null) return { error: 'method_health.issues must be an array' }
      row[field] = arr
    } else if (field === 'method_integrity_score') {
      if (value !== null && typeof value !== 'number') {
        return { error: 'method_health.method_integrity_score must be a number' }
      }
      row[field] = value
    } else {
      row[field] = value
    }
  }
  if (row.health_status === undefined || row.health_status === null) row.health_status = 'UNKNOWN'

  const metadata: Record<string, unknown> = {}
  if ('schema_version' in input) metadata.schema_version = input.schema_version

  return { row, metadata }
}

// --------------------------------------------------------------- records

const RECORD_KEYS = [
  'learning_id',
  'title',
  'status',
  'record_path',
  'created_at',
  'last_reviewed_at',
  'promoted_at',
  'confidence',
  'generalizability',
  'origin_refs',
  'promoted_to',
  'revisit_trigger',
  'sort_order',
] as readonly string[]

/** learning_ledger accepts either the canonical file object or a bare array. */
export function parseLearningLedger(
  input: unknown,
): { rows: Record<string, unknown>[]; metadata: Record<string, unknown> } | ParseError {
  let records: unknown
  const metadata: Record<string, unknown> = {}

  if (Array.isArray(input)) {
    records = input
  } else if (isObject(input)) {
    const unknown = Object.keys(input).filter(
      (k) => !['schema_version', 'updated_at', 'authority', 'records'].includes(k),
    )
    if (unknown.length > 0) return { error: 'Unsupported learning_ledger fields', fields: unknown }
    metadata.schema_version = input.schema_version ?? null
    metadata.updated_at = input.updated_at ?? null
    metadata.authority = input.authority ?? null
    records = input.records ?? []
  } else {
    return { error: 'learning_ledger must be an object or an array' }
  }

  if (!Array.isArray(records)) return { error: 'learning_ledger.records must be an array' }

  const rows: Record<string, unknown>[] = []
  for (const [index, item] of records.entries()) {
    if (!isObject(item)) return { error: 'learning_ledger.records item must be an object', index }
    const unknown = Object.keys(item).filter((k) => !RECORD_KEYS.includes(k))
    if (unknown.length > 0) {
      return { error: 'Unsupported learning record fields', index, fields: unknown }
    }
    if (normalize(item.learning_id) === null) {
      return { error: 'learning_ledger.records item requires learning_id', index }
    }
    if (normalize(item.title) === null) {
      return { error: 'learning_ledger.records item requires title', index }
    }
    const originRefs = item.origin_refs === undefined ? [] : asJsonArray(item.origin_refs)
    if (originRefs === null) return { error: 'origin_refs must be an array', index }
    const promotedTo = item.promoted_to === undefined ? [] : asJsonArray(item.promoted_to)
    if (promotedTo === null) return { error: 'promoted_to must be an array', index }

    rows.push({
      learning_id: normalize(item.learning_id),
      title: normalize(item.title),
      status: normalize(item.status),
      record_path: normalize(item.record_path),
      // Canonical `created_at` is the learning's own creation instant; it is kept
      // in a dedicated column so it never collides with the row bookkeeping one.
      origin_created_at: normalize(item.created_at),
      last_reviewed_at: normalize(item.last_reviewed_at),
      // Semantic promotion instant: supplied by the GitHub source, never
      // inferred from row bookkeeping (updated_at) on this side.
      promoted_at: normalize(item.promoted_at),
      confidence: normalize(item.confidence),
      generalizability: normalize(item.generalizability),
      origin_refs: originRefs,
      promoted_to: promotedTo,
      revisit_trigger: normalize(item.revisit_trigger),
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : index,
    })
  }
  return { rows, metadata }
}

// -------------------------------------------------------------- evidence

const EVIDENCE_KEYS = [
  'event_id',
  'detected_at',
  'source_sha',
  'source_committed_at',
  'source_type',
  'summary',
  'changed_paths',
  'review_status',
  'reviewed_at',
  'review_note',
  'linked_learning_ids',
  'repair_evidence_sha',
  'sort_order',
] as readonly string[]

export function parseLearningInbox(
  input: unknown,
): { rows: Record<string, unknown>[]; metadata: Record<string, unknown> } | ParseError {
  let events: unknown
  const metadata: Record<string, unknown> = {}

  if (Array.isArray(input)) {
    events = input
  } else if (isObject(input)) {
    const unknown = Object.keys(input).filter(
      (k) => !['schema_version', 'updated_at', 'cursor_sha', 'events'].includes(k),
    )
    if (unknown.length > 0) return { error: 'Unsupported learning_inbox fields', fields: unknown }
    metadata.schema_version = input.schema_version ?? null
    metadata.updated_at = input.updated_at ?? null
    metadata.cursor_sha = input.cursor_sha ?? null
    events = input.events ?? []
  } else {
    return { error: 'learning_inbox must be an object or an array' }
  }

  if (!Array.isArray(events)) return { error: 'learning_inbox.events must be an array' }

  const rows: Record<string, unknown>[] = []
  for (const [index, item] of events.entries()) {
    if (!isObject(item)) return { error: 'learning_inbox.events item must be an object', index }
    const unknown = Object.keys(item).filter((k) => !EVIDENCE_KEYS.includes(k))
    if (unknown.length > 0) {
      return { error: 'Unsupported evidence fields', index, fields: unknown }
    }
    if (normalize(item.event_id) === null) {
      return { error: 'learning_inbox.events item requires event_id', index }
    }
    const changedPaths = item.changed_paths === undefined ? [] : asJsonArray(item.changed_paths)
    if (changedPaths === null) return { error: 'changed_paths must be an array', index }
    const linked =
      item.linked_learning_ids === undefined ? [] : asJsonArray(item.linked_learning_ids)
    if (linked === null) return { error: 'linked_learning_ids must be an array', index }

    rows.push({
      event_id: normalize(item.event_id),
      detected_at: normalize(item.detected_at),
      source_sha: normalize(item.source_sha),
      source_committed_at: normalize(item.source_committed_at),
      source_type: normalize(item.source_type),
      summary: normalize(item.summary),
      changed_paths: changedPaths,
      review_status: normalize(item.review_status),
      reviewed_at: normalize(item.reviewed_at),
      review_note: normalize(item.review_note),
      linked_learning_ids: linked,
      repair_evidence_sha: normalize(item.repair_evidence_sha),
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : index,
    })
  }
  return { rows, metadata }
}

// ------------------------------------------------------------- relations

const RELATION_KEYS = [
  'relation_id',
  'source',
  'relation',
  'target',
  'status',
  'rationale',
  'evidence_refs',
  'last_verified_at',
  'sort_order',
] as readonly string[]

export function parseMethodRelationships(
  input: unknown,
): { rows: Record<string, unknown>[]; metadata: Record<string, unknown> } | ParseError {
  let relations: unknown
  const metadata: Record<string, unknown> = {}

  if (Array.isArray(input)) {
    relations = input
  } else if (isObject(input)) {
    const unknown = Object.keys(input).filter(
      (k) => !['schema_version', 'updated_at', 'relation_vocabulary', 'relations'].includes(k),
    )
    if (unknown.length > 0) {
      return { error: 'Unsupported method_relationships fields', fields: unknown }
    }
    metadata.schema_version = input.schema_version ?? null
    metadata.updated_at = input.updated_at ?? null
    metadata.relation_vocabulary = input.relation_vocabulary ?? null
    relations = input.relations ?? []
  } else {
    return { error: 'method_relationships must be an object or an array' }
  }

  if (!Array.isArray(relations)) return { error: 'method_relationships.relations must be an array' }

  const rows: Record<string, unknown>[] = []
  for (const [index, item] of relations.entries()) {
    if (!isObject(item)) return { error: 'method_relationships.relations item must be an object', index }
    const unknown = Object.keys(item).filter((k) => !RELATION_KEYS.includes(k))
    if (unknown.length > 0) return { error: 'Unsupported relation fields', index, fields: unknown }
    if (normalize(item.relation_id) === null) {
      return { error: 'method_relationships.relations item requires relation_id', index }
    }
    const evidenceRefs = item.evidence_refs === undefined ? [] : asJsonArray(item.evidence_refs)
    if (evidenceRefs === null) return { error: 'evidence_refs must be an array', index }

    rows.push({
      relation_id: normalize(item.relation_id),
      source_node: normalize(item.source),
      relation_type: normalize(item.relation),
      target_node: normalize(item.target),
      status: normalize(item.status),
      rationale: normalize(item.rationale),
      evidence_refs: evidenceRefs,
      last_verified_at: normalize(item.last_verified_at),
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : index,
    })
  }
  return { rows, metadata }
}

// ------------------------------------------------------------------ gates

/**
 * Global Method Change Gates (e.g. promotion of a VALIDATED learning that
 * canonically requires PROC-004 + explicit Stefano authority).
 *
 * Gates are EXPLICIT structured objects supplied by the GitHub source. This
 * layer never infers a gate from a learning status such as VALIDATED.
 */
const GATE_KEYS = [
  'gate_id',
  'gate_type',
  'learning_id',
  'title',
  'status',
  'authority_required',
  'procedure_refs',
  'impact_preview_refs',
  'opened_at',
  'decided_at',
  'decided_by',
  'source_path',
  'sort_order',
] as readonly string[]

export function parseMethodChangeGates(
  input: unknown,
): { rows: Record<string, unknown>[]; metadata: Record<string, unknown> } | ParseError {
  let gates: unknown
  const metadata: Record<string, unknown> = {}

  if (Array.isArray(input)) {
    gates = input
  } else if (isObject(input)) {
    const unknown = Object.keys(input).filter(
      (k) => !['schema_version', 'updated_at', 'gates'].includes(k),
    )
    if (unknown.length > 0) {
      return { error: 'Unsupported method_change_gates fields', fields: unknown }
    }
    metadata.schema_version = input.schema_version ?? null
    metadata.updated_at = input.updated_at ?? null
    gates = input.gates ?? []
  } else {
    return { error: 'method_change_gates must be an object or an array' }
  }

  if (!Array.isArray(gates)) return { error: 'method_change_gates.gates must be an array' }

  const rows: Record<string, unknown>[] = []
  for (const [index, item] of gates.entries()) {
    if (!isObject(item)) {
      return { error: 'method_change_gates.gates item must be an object', index }
    }
    const unknown = Object.keys(item).filter((k) => !GATE_KEYS.includes(k))
    if (unknown.length > 0) return { error: 'Unsupported gate fields', index, fields: unknown }
    if (normalize(item.gate_id) === null) {
      return { error: 'method_change_gates.gates item requires gate_id', index }
    }
    if (normalize(item.title) === null) {
      return { error: 'method_change_gates.gates item requires title', index }
    }
    const gateType = normalize(item.gate_type) ?? 'WCM_CHANGE_GATE'
    if (gateType !== 'WCM_CHANGE_GATE') {
      return { error: 'gate_type must be WCM_CHANGE_GATE', index }
    }
    const procedureRefs = item.procedure_refs === undefined ? [] : asJsonArray(item.procedure_refs)
    if (procedureRefs === null) return { error: 'procedure_refs must be an array', index }
    const impactRefs =
      item.impact_preview_refs === undefined ? [] : asJsonArray(item.impact_preview_refs)
    if (impactRefs === null) return { error: 'impact_preview_refs must be an array', index }

    rows.push({
      gate_id: normalize(item.gate_id),
      gate_type: gateType,
      learning_id: normalize(item.learning_id),
      title: normalize(item.title),
      status: normalize(item.status) ?? 'OPEN',
      authority_required: normalize(item.authority_required),
      procedure_refs: procedureRefs,
      impact_preview_refs: impactRefs,
      opened_at: normalize(item.opened_at),
      decided_at: normalize(item.decided_at),
      decided_by: normalize(item.decided_by),
      source_path: normalize(item.source_path),
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : index,
    })
  }
  return { rows, metadata }
}

// -------------------------------------------------------------- snapshots

/** Ids present in the read-model but absent from the authoritative snapshot. */
export const computeStaleKeys = (existing: string[], keep: string[]): string[] =>
  existing.filter((k) => !keep.includes(k))
