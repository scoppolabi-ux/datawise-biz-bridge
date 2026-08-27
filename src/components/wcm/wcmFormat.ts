import {
  governanceBadgeOf,
  isApprovedState,
  UNAPPROVED_BADGE_LABEL,
  UNCLASSIFIED_BADGE_LABEL,
  type ResolvedState,
} from './wcmCanonicalState';

export const STATUS_LABELS: Record<string, string> = {
  working: 'Working',
  waiting: 'Waiting',
  waiting_board: 'Waiting Board',
  blocked: 'Blocked',
  paused: 'Paused',
  active_resume_required: 'Ripresa necessaria',
};

/** Chiave normalizzata solo su case/trim: nessuna euristica semantica. */
const statusKey = (status: string | null | undefined) => (status ?? '').trim().toLowerCase();

/** Label esatta se mappata, altrimenti l'enum grezzo (fallback esplicito). */
export const projectStatusLabel = (status: string | null | undefined): string =>
  STATUS_LABELS[statusKey(status)] ?? (status ?? '—');

export const statusClasses = (status: string) => {
  switch (statusKey(status)) {
    case 'working':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'blocked':
      return 'bg-wcm-alert/15 text-wcm-alert-fg border-wcm-alert/30';
    // Tono allineato al segnale RESUME_REQUIRED di Execution Health.
    case 'active_resume_required':
      return 'bg-wcm-alert/15 text-wcm-alert-fg border-wcm-alert/30';
    case 'paused':
      return 'bg-wcm-dim/15 text-wcm-text border-slate-500/30';
    default:
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  }
};

/** Outcome heartbeat canonici brevi → label umane. Match ESATTO, nessuna substring. */
export const HEARTBEAT_OUTCOME_LABELS: Record<string, string> = {
  ok: 'Esito conforme',
  resume_required: 'Ripresa necessaria',
  waiting_authority: 'In attesa di autorità',
  blocked_board: 'Stop governato · Board',
  blocked: 'Bloccato',
  failed: 'Fallito',
  no_work: 'Nessun lavoro da svolgere',
};

export const HEARTBEAT_OUTCOME_UNKNOWN_LABEL = 'Esito non riconosciuto';

export type HeartbeatOutcomeDisplay = {
  /** Testo mostrato in UI. */
  label: string;
  /** Valore tecnico grezzo, da esporre solo via title/dettagli. */
  raw: string | null;
  known: boolean;
};

/**
 * Resa dell'esito heartbeat: solo mapping esatto sul vocabolario canonico.
 * Per valori fuori vocabolario non si deduce alcun significato.
 */
export const heartbeatOutcomeDisplay = (
  value: string | null | undefined,
): HeartbeatOutcomeDisplay | null => {
  const raw = (value ?? '').trim();
  if (raw === '') return null;
  const label = HEARTBEAT_OUTCOME_LABELS[raw.toLowerCase()];
  return label
    ? { label, raw, known: true }
    : { label: HEARTBEAT_OUTCOME_UNKNOWN_LABEL, raw, known: false };
};

/**
 * Le phase sono enum tecnici liberi: nella card primaria si mostra solo una
 * phase compatta. Criterio puramente presentazionale (lunghezza), nessuna
 * interpretazione del contenuto: le phase lunghe restano nei dettagli tecnici.
 */
export const COMPACT_PHASE_MAX_LENGTH = 24;

export const isCompactPhase = (phase: string | null | undefined): boolean => {
  const value = (phase ?? '').trim();
  return value !== '' && value.length <= COMPACT_PHASE_MAX_LENGTH;
};


export const ROADMAP_STATUS_LABELS: Record<string, string> = {
  DONE: 'Done',
  ACTIVE: 'Active',
  BOARD_GATE: 'Board Gate',
  NOT_ELIGIBLE: 'Not eligible',
  PLANNED: 'Planned',
};

export const roadmapStatusClasses = (status: string | null) => {
  switch ((status ?? '').toUpperCase()) {
    case 'DONE':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'ACTIVE':
      return 'bg-wcm-accent/15 text-wcm-accent border-wcm-accent/30';
    case 'BOARD_GATE':
      return 'bg-wcm-alert/15 text-wcm-alert-fg border-wcm-alert/30';
    case 'NOT_ELIGIBLE':
      return 'bg-wcm-line-strong/40 text-wcm-muted border-wcm-line-strong';
    default:
      return 'bg-wcm-dim/15 text-wcm-text border-wcm-line-strong/40';
  }
};

export const formatDateTime = (value: string | null) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const relativeTime = (value: string | null) => {
  if (!value) return null;
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diffMs / 60000);
  const rtf = new Intl.RelativeTimeFormat('it', { numeric: 'auto' });
  if (Math.abs(minutes) < 60) return rtf.format(-minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 48) return rtf.format(-hours, 'hour');
  return rtf.format(-Math.round(hours / 24), 'day');
};

/** Document buckets shown in the Documents tab. */
export type DocBucket =
  | 'TO_READ'
  | 'UNCLASSIFIED'
  | 'MANUSCRIPT_APPROVED'
  | 'APPROVED_BASELINE'
  | 'WAITING_AUTHORITY'
  | 'WORKING_EDITORIAL'
  | 'CLOSED_SUPPORTING'
  | 'OTHER';

const exact = (value: string | null | undefined) => (value ?? '').trim().toUpperCase();

/** Board Package: category+status ESATTI del report di supporto di un gate OPEN. */
export const BOARD_REPORT_CATEGORY = 'BOARD_REPORT';
export const BOARD_OPEN_SUPPORTING_STATUS = 'BOARD_GATE_OPEN_SUPPORTING_MATERIAL';

export type BoardPackageInput = {
  category: string | null;
  status?: string | null;
};

/**
 * Solo il Board Report del gate APERTO (match esatto category+status) viene
 * promosso visivamente nel blocco Board. Nessuna euristica, nessun impatto su
 * authority, requires_stefano o conteggio "Da leggere".
 */
export const isOpenBoardSupportingDocument = (doc: BoardPackageInput): boolean =>
  exact(doc.category) === BOARD_REPORT_CATEGORY &&
  exact(doc.status) === BOARD_OPEN_SUPPORTING_STATUS;

/**
 * Bucket = funzione del canonical state (match esatto category+status) e del
 * flag esplicito `requires_stefano`. Nessuna euristica su stringhe.
 */
export const bucketOf = (
  doc: { requires_stefano: boolean; category: string | null; status?: string | null },
  state: ResolvedState,
): DocBucket => {
  if (doc.requires_stefano) return 'TO_READ';
  if (isOpenBoardSupportingDocument(doc)) return 'TO_READ';
  if (state === 'UNKNOWN') return 'UNCLASSIFIED';
  if (state === 'APPROVED_FROZEN') {
    return exact(doc.category) === 'MANUSCRIPT_APPROVED'
      ? 'MANUSCRIPT_APPROVED'
      : 'APPROVED_BASELINE';
  }
  if (state === 'WAITING_AUTHORITY') return 'WAITING_AUTHORITY';
  if (state === 'WORKING') return 'WORKING_EDITORIAL';
  if (state === 'CLOSED' || state === 'SUPERSEDED') return 'CLOSED_SUPPORTING';
  return 'OTHER';
};

/**
 * Ordinamento deterministico dentro "Da leggere / Board":
 * 0 = Candidate / documenti richiesti a Stefano, 1 = Board Report di supporto.
 */
export const toReadSortRank = (doc: {
  requires_stefano: boolean;
  category: string | null;
  status?: string | null;
}): number => (doc.requires_stefano ? 0 : isOpenBoardSupportingDocument(doc) ? 1 : 2);

export const BUCKET_LABELS: Record<DocBucket, string> = {
  TO_READ: 'Da leggere / Board',
  UNCLASSIFIED: 'Da classificare',
  MANUSCRIPT_APPROVED: 'Manoscritto approvato',
  APPROVED_BASELINE: 'Baseline approvate',
  WAITING_AUTHORITY: 'In attesa di autorità',
  WORKING_EDITORIAL: 'Working / Editorial',
  CLOSED_SUPPORTING: 'Chiusi / Materiale di supporto',
  OTHER: 'Altri documenti',
};

/** Approvazione = solo canonical APPROVED_FROZEN. */
export const isApprovedDocument = (state: ResolvedState): boolean => isApprovedState(state);

/** True solo per governance working/waiting distribuibile: CLOSED non lo è. */
export const isUnapprovedDistribution = (
  doc: { distribution_ready: boolean },
  state: ResolvedState,
): boolean => governanceBadgeOf(doc, state) === 'UNAPPROVED';

export const UNAPPROVED_LABEL = UNAPPROVED_BADGE_LABEL;
export const UNCLASSIFIED_LABEL = UNCLASSIFIED_BADGE_LABEL;
