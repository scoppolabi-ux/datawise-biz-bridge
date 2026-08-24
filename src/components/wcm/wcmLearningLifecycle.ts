/**
 * WCM Learning hardening — deterministic lifecycle → UI label mapping.
 *
 * Exact canonical statuses only. Unknown values pass through unchanged
 * (fail closed: no fuzzy state interpretation, no invented labels).
 * Raw canonical values stay available to the UI for tooltips/details.
 */

/* ------------------------------------------------ evidence review lifecycle
 * The evidence lifecycle (review pipeline) is DISTINCT from the learning
 * lifecycle: an evidence event is reviewed/classified, a learning record is
 * observed/validated/promoted. Never mix the two vocabularies.
 */
const EVIDENCE_STATUS_LABELS: Record<string, string> = {
  PENDING: 'DA REVISIONARE',
  PENDING_REVIEW: 'DA REVISIONARE',
  LINKED: 'COLLEGATA',
  DUPLICATE: 'DUPLICATA',
  NO_LEARNING: 'NESSUN LEARNING',
  NEEDS_MORE_EVIDENCE: 'SERVE PIÙ EVIDENZA',
};

export const evidenceStatusLabel = (raw: string | null | undefined): string => {
  if (!raw || !raw.trim()) return 'SCONOSCIUTO';
  const key = raw.trim().toUpperCase();
  return EVIDENCE_STATUS_LABELS[key] ?? raw;
};

/* ------------------------------------------------------------ learning lifecycle */
const LEARNING_STATUS_LABELS: Record<string, string> = {
  PROMOTED: 'PROMOSSO',
  VALIDATED: 'VALIDATO',
  CANDIDATE: 'CANDIDATO',
  OBSERVING: 'IN OSSERVAZIONE',
  REJECTED: 'RESPINTO',
  SUPERSEDED: 'SOSTITUITO',
  // Explicit source state only — never derived locally from VALIDATED.
  WAITING_AUTHORITY: 'IN ATTESA DI AUTORITÀ',
};

export const learningStatusLabel = (raw: string | null | undefined): string => {
  if (!raw || !raw.trim()) return 'SCONOSCIUTO';
  const key = raw.trim().toUpperCase();
  return LEARNING_STATUS_LABELS[key] ?? raw;
};

/* ------------------------------------------------------- change gate lifecycle */
const GATE_STATUS_LABELS: Record<string, string> = {
  OPEN: 'APERTO',
  APPROVED: 'APPROVATO',
  CHANGES_REQUESTED: 'MODIFICHE RICHIESTE',
  REJECTED: 'RESPINTO',
  EXECUTED: 'ESEGUITO',
  CLOSED: 'CHIUSO',
};

export const gateStatusLabel = (raw: string | null | undefined): string => {
  if (!raw || !raw.trim()) return 'SCONOSCIUTO';
  const key = raw.trim().toUpperCase();
  return GATE_STATUS_LABELS[key] ?? raw;
};

/**
 * True only for an explicit OPEN gate. Never infer authority requirement from
 * a learning status: a gate exists only when the GitHub source projects one.
 */
export const isOpenGate = (gate: { status: string | null }): boolean =>
  (gate.status ?? '').trim().toUpperCase() === 'OPEN';
