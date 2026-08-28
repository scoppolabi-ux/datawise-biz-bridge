import type { WcmTechnicalIssue } from '@/hooks/useWcmTechnicalIssues';

/** Human-facing Italian labels for technical issue statuses. */
export const issueStatusLabel = (status: string): string => {
  switch (status) {
    case 'OPEN':
      return 'Aperto';
    case 'CLOSED':
      return 'Chiuso';
    default:
      return `Stato: ${status}`;
  }
};

export const isOpenIssue = (issue: WcmTechnicalIssue) => issue.status === 'OPEN';

export const openIssues = (issues: WcmTechnicalIssue[]) => issues.filter(isOpenIssue);

export const closedIssues = (issues: WcmTechnicalIssue[]) =>
  issues.filter((i) => i.status === 'CLOSED');

/** Deterministic short timestamp in Italian locale; raw value on failure. */
export const issueDateLabel = (value: string | null): string => {
  if (!value) return '—';
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return value;
  return new Date(ms).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
