/**
 * GLOBAL WCM System Maintenance Log — presentation helpers.
 *
 * Deterministic only: no semantic inference. A READY_FOR_CLOSURE entry is
 * never rendered as CLOSED. Unknown statuses are surfaced verbatim.
 */

export const MAINTENANCE_REPO_OWNER = 'scoppolabi-ux';
export const MAINTENANCE_REPO_NAME = 'WCM-LAB';
export const MAINTENANCE_REPO_REF = 'main';

/** Exact italian labels for the known statuses. */
const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Aperto',
  READY_FOR_CLOSURE: 'Pronto per la chiusura',
  CLOSED: 'Chiuso',
  FAILED: 'Fallito',
};

/** Human-facing italian label; unknown values are echoed, never interpreted. */
export const maintenanceStatusLabel = (status: string | null | undefined): string => {
  const raw = (status ?? '').trim();
  if (!raw) return 'Stato non dichiarato';
  return STATUS_LABELS[raw] ?? `Stato: ${raw}`;
};

/** Tone token for the badge; unknown statuses stay neutral. */
export const maintenanceStatusTone = (
  status: string | null | undefined,
): 'open' | 'ready' | 'closed' | 'failed' | 'unknown' => {
  switch ((status ?? '').trim()) {
    case 'OPEN':
      return 'open';
    case 'READY_FOR_CLOSURE':
      return 'ready';
    case 'CLOSED':
      return 'closed';
    case 'FAILED':
      return 'failed';
    default:
      return 'unknown';
  }
};

/**
 * Allowlisted change-manifest path: EXACTLY
 * `wcm/change-manifests/WCM-CHANGE-<token>.json`. Fail closed otherwise.
 */
const MANIFEST_PATH_RE = /^wcm\/change-manifests\/WCM-CHANGE-[A-Za-z0-9._-]+\.json$/;

export const isSafeManifestPath = (path: string | null | undefined): boolean => {
  const value = (path ?? '').trim();
  if (!value) return false;
  if (value.includes('..') || value.includes('//') || value.includes('\\')) return false;
  return MANIFEST_PATH_RE.test(value);
};

/** GitHub blob URL for a validated manifest path, or null. */
export const manifestLink = (path: string | null | undefined): string | null => {
  if (!isSafeManifestPath(path)) return null;
  const encoded = (path as string)
    .trim()
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `https://github.com/${MAINTENANCE_REPO_OWNER}/${MAINTENANCE_REPO_NAME}/blob/${MAINTENANCE_REPO_REF}/${encoded}`;
};

/** Italian short date; falls back to the raw value when unparsable. */
export const maintenanceDateLabel = (occurredOn: string | null | undefined): string => {
  const raw = (occurredOn ?? '').trim();
  if (!raw) return '—';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
