/**
 * WCM canonical document states.
 *
 * INVARIANTE: la classificazione operativa è SEMPRE un match ESATTO su
 * category + status (mapping seminato in `wcm_document_state_mappings`).
 * Nessuna regex/substring può decidere approvazione, chiusura o autorità.
 * Le euristiche vivono solo in `suggestCanonicalState`, che produce una
 * PROPOSTA da mostrare a Stefano e non viene mai applicata da sola.
 */

export const CANONICAL_STATES = [
  'APPROVED_FROZEN',
  'WAITING_AUTHORITY',
  'WORKING',
  'CLOSED',
  'SUPERSEDED',
] as const;

export type CanonicalState = (typeof CANONICAL_STATES)[number];

/** UNKNOWN è uno stato di sicurezza derivato, non una categoria selezionabile. */
export type ResolvedState = CanonicalState | 'UNKNOWN';

export type WcmStateMapping = {
  id: string;
  category: string;
  status: string;
  canonical_state: string | null;
  proposed_state: string | null;
  mapping_status: string;
  reason: string | null;
  confidence: string | null;
  created_at: string;
};

export const CANONICAL_LABELS: Record<CanonicalState, string> = {
  APPROVED_FROZEN: 'Approvato e congelato',
  WAITING_AUTHORITY: 'In attesa di autorità',
  WORKING: 'In lavorazione',
  CLOSED: 'Chiuso / materiale di supporto',
  SUPERSEDED: 'Superato',
};

export const CANONICAL_EFFECTS: Record<CanonicalState, string> = {
  APPROVED_FROZEN:
    'Documento approvato e congelato: nessun badge di non approvazione, nessuna autorità richiesta.',
  WAITING_AUTHORITY:
    'Documento in attesa di decisione umana: le azioni di autorità restano disponibili sul Board Gate.',
  WORKING:
    'Documento in lavorazione: se distribuibile viene marcato come non approvato.',
  CLOSED:
    'Documento chiuso o materiale di supporto: nessun badge di non approvazione e nessuna autorità richiesta.',
  SUPERSEDED: 'Documento superato: sola lettura, nessuna autorità richiesta.',
};

const norm = (value: unknown) => String(value ?? '').trim().toUpperCase();

export const mappingKey = (category: unknown, status: unknown) =>
  `${norm(category)}|${norm(status)}`;

export const isCanonicalState = (value: unknown): value is CanonicalState =>
  (CANONICAL_STATES as readonly string[]).includes(norm(value));

/** Index of ACTIVE mappings only: le proposte PENDING non influenzano la UI. */
export const buildMappingIndex = (
  rows: Pick<WcmStateMapping, 'category' | 'status' | 'canonical_state' | 'mapping_status'>[],
): Map<string, CanonicalState> => {
  const index = new Map<string, CanonicalState>();
  for (const row of rows ?? []) {
    if (norm(row.mapping_status) !== 'ACTIVE') continue;
    const state = norm(row.canonical_state);
    if (!isCanonicalState(state)) continue;
    index.set(mappingKey(row.category, row.status), state as CanonicalState);
  }
  return index;
};

export type StateInput = { category: string | null; status: string | null };

/** Match esatto o UNKNOWN. Nessun wildcard, nessun fallback euristico. */
export const resolveCanonicalState = (
  doc: StateInput,
  index: Map<string, CanonicalState>,
): ResolvedState => index.get(mappingKey(doc.category, doc.status)) ?? 'UNKNOWN';

export type GovernanceBadge = 'NONE' | 'UNAPPROVED' | 'UNCLASSIFIED';

export const UNAPPROVED_BADGE_LABEL = 'IN VALUTAZIONE · NON APPROVATO';
export const UNCLASSIFIED_BADGE_LABEL = 'STATO DA CLASSIFICARE';

/**
 * Governance badge:
 * - UNKNOWN  → sempre "STATO DA CLASSIFICARE"
 * - WORKING / WAITING_AUTHORITY distribuibili → "IN VALUTAZIONE · NON APPROVATO"
 * - APPROVED_FROZEN / CLOSED / SUPERSEDED → nessun badge
 */
export const governanceBadgeOf = (
  doc: { distribution_ready: boolean },
  state: ResolvedState,
): GovernanceBadge => {
  if (state === 'UNKNOWN') return 'UNCLASSIFIED';
  if (state === 'WORKING' || state === 'WAITING_AUTHORITY') {
    return doc.distribution_ready ? 'UNAPPROVED' : 'NONE';
  }
  return 'NONE';
};

/** Solo APPROVED_FROZEN è "approvato". CLOSED non lo è, ma non è "non approvato". */
export const isApprovedState = (state: ResolvedState) => state === 'APPROVED_FROZEN';

/** Le azioni di autorità sono bloccate su un oggetto non classificato. */
export const authorityAllowed = (state: ResolvedState) => state !== 'UNKNOWN';

export type CanonicalSuggestion = {
  state: CanonicalState;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
};

/**
 * SOLO PROPOSTA. Euristica usata per suggerire a Stefano uno stato canonico
 * esistente: non viene mai applicata automaticamente e non crea mapping.
 */
export const suggestCanonicalState = (doc: StateInput): CanonicalSuggestion | null => {
  const c = norm(doc.category);
  const s = norm(doc.status);
  const both = `${c} ${s}`;

  if (/SUPERSEDED|OBSOLETE|REPLACED/.test(both)) {
    return {
      state: 'SUPERSEDED',
      confidence: 'MEDIUM',
      reason: 'Lo status suggerisce un documento sostituito da una versione successiva.',
    };
  }
  if (/APPROVED|FROZEN/.test(both) && !/CANDIDATE|PENDING|PROPOSAL/.test(both)) {
    return {
      state: 'APPROVED_FROZEN',
      confidence: 'MEDIUM',
      reason: 'Category/status contengono termini di approvazione e freeze.',
    };
  }
  if (/CLOSED|SUPPORTING|REPORT|ARCHIVE/.test(both)) {
    return {
      state: 'CLOSED',
      confidence: 'MEDIUM',
      reason: 'Sembra materiale di supporto o un elemento già chiuso.',
    };
  }
  if (/CANDIDATE|BOARD_GATE|REVIEW_PENDING|AWAITING|PENDING_DECISION/.test(both)) {
    return {
      state: 'WAITING_AUTHORITY',
      confidence: 'MEDIUM',
      reason: 'Sembra un oggetto in attesa di una decisione umana.',
    };
  }
  if (/DRAFT|WORKING|ACTIVE|BRIEF|EDITORIAL/.test(both)) {
    return {
      state: 'WORKING',
      confidence: 'MEDIUM',
      reason: 'Sembra un documento ancora in lavorazione.',
    };
  }
  return null;
};
