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
  | 'MANUSCRIPT_APPROVED'
  | 'APPROVED_BASELINE'
  | 'TO_READ'
  | 'WORKING_EDITORIAL'
  | 'OTHER';

/**
 * Category (when provided by the Projector) is authoritative; title is never used
 * to infer manuscript identity. Status strings are only a fallback.
 * Invariante: un documento con requires_stefano=true finisce SEMPRE in "Da leggere / Board",
 * qualunque sia la category.
 */
export const bucketOf = (doc: {
  requires_stefano: boolean;
  status: string | null;
  category: string | null;
}): DocBucket => {
  if (doc.requires_stefano) return 'TO_READ';
  const category = (doc.category ?? '').trim().toUpperCase();
  if (category === 'MANUSCRIPT_APPROVED') return 'MANUSCRIPT_APPROVED';
  if (category === 'APPROVED_BASELINE' || category === 'APPROVED_FROZEN')
    return 'APPROVED_BASELINE';
  if (category === 'WORKING' || category === 'EDITORIAL' || category === 'WORKING_EDITORIAL')
    return 'WORKING_EDITORIAL';


  const s = (doc.status ?? doc.category ?? '').toLowerCase();
  if (s.includes('approved') || s.includes('frozen')) return 'APPROVED_BASELINE';
  if (s.includes('working') || s.includes('editorial') || s.includes('draft'))
    return 'WORKING_EDITORIAL';
  return 'OTHER';
};

export const BUCKET_LABELS: Record<DocBucket, string> = {
  MANUSCRIPT_APPROVED: 'Manoscritto approvato',
  APPROVED_BASELINE: 'Baseline approvate',
  TO_READ: 'Da leggere / Board',
  WORKING_EDITORIAL: 'Working / Editorial',
  OTHER: 'Altri documenti',
};

/**
 * Approval/governance state of a document, independent from distribution.
 * A document is "approved" only when category/status explicitly says so.
 */
export const isApprovedDocument = (doc: {
  status: string | null;
  category: string | null;
}): boolean => {
  const c = (doc.category ?? '').trim().toUpperCase();
  if (
    c === 'MANUSCRIPT_APPROVED' ||
    c === 'APPROVED_BASELINE' ||
    c === 'APPROVED_FROZEN' ||
    c === 'LOCKED' ||
    c === 'PRESERVE'
  )
    return true;
  const s = `${doc.status ?? ''} ${doc.category ?? ''}`.toLowerCase();
  if (/\b(un ?approved|not[_ -]?approved|candidate|draft|proposal)\b/.test(s)) return false;
  return /approved|frozen|locked|preserve/.test(s);
};

/** True when the doc is shareable but its governance state is not approved. */
export const isUnapprovedDistribution = (doc: {
  distribution_ready: boolean;
  status: string | null;
  category: string | null;
}): boolean => doc.distribution_ready && !isApprovedDocument(doc);

export const UNAPPROVED_LABEL = 'IN VALUTAZIONE · NON APPROVATO';
