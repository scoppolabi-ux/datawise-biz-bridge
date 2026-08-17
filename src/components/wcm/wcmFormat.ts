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
export type DocBucket = 'TO_READ' | 'APPROVED_FROZEN' | 'WORKING_EDITORIAL' | 'OTHER';

export const bucketOf = (doc: {
  requires_stefano: boolean;
  status: string | null;
  category: string | null;
}): DocBucket => {
  if (doc.requires_stefano) return 'TO_READ';
  const s = (doc.status ?? doc.category ?? '').toLowerCase();
  if (s.includes('approved') || s.includes('frozen')) return 'APPROVED_FROZEN';
  if (s.includes('working') || s.includes('editorial') || s.includes('draft'))
    return 'WORKING_EDITORIAL';
  return 'OTHER';
};

export const BUCKET_LABELS: Record<DocBucket, string> = {
  TO_READ: 'To read',
  APPROVED_FROZEN: 'Approved / Frozen',
  WORKING_EDITORIAL: 'Working / Editorial',
  OTHER: 'Altri documenti',
};
