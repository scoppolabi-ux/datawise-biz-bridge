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
};

export const statusClasses = (status: string) => {
  switch (status) {
    case 'working':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'blocked':
      return 'bg-wcm-alert/15 text-wcm-alert-fg border-wcm-alert/30';
    case 'paused':
      return 'bg-wcm-dim/15 text-wcm-text border-slate-500/30';
    default:
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  }
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

/**
 * Bucket = funzione del canonical state (match esatto category+status) e del
 * flag esplicito `requires_stefano`. Nessuna euristica su stringhe.
 */
export const bucketOf = (
  doc: { requires_stefano: boolean; category: string | null },
  state: ResolvedState,
): DocBucket => {
  if (doc.requires_stefano) return 'TO_READ';
  if (state === 'UNKNOWN') return 'UNCLASSIFIED';
  if (state === 'APPROVED_FROZEN') {
    return (doc.category ?? '').trim().toUpperCase() === 'MANUSCRIPT_APPROVED'
      ? 'MANUSCRIPT_APPROVED'
      : 'APPROVED_BASELINE';
  }
  if (state === 'WAITING_AUTHORITY') return 'WAITING_AUTHORITY';
  if (state === 'WORKING') return 'WORKING_EDITORIAL';
  if (state === 'CLOSED' || state === 'SUPERSEDED') return 'CLOSED_SUPPORTING';
  return 'OTHER';
};

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
