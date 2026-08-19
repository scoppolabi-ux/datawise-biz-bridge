import type { WcmHealthStatus, WcmKnowledgeHealth } from '@/hooks/useWcmKnowledgeHealth';

/**
 * Knowledge Health presentation helpers.
 * Internal enums stay English; every human-facing label is Italian.
 */

export const HEALTH_LABELS: Record<WcmHealthStatus, string> = {
  HEALTHY: 'In salute',
  DEGRADED: 'Degradata',
  STALE: 'Verifica richiesta',
  CRITICAL: 'Critica',
  UNKNOWN: 'Non disponibile',
};

export const healthClasses = (status: WcmHealthStatus) => {
  switch (status) {
    case 'HEALTHY':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'DEGRADED':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'STALE':
      return 'bg-amber-500/15 text-amber-200 border-amber-500/40';
    case 'CRITICAL':
      return 'bg-wcm-alert/15 text-wcm-alert-fg border-wcm-alert/30';
    default:
      return 'bg-wcm-dim/15 text-wcm-muted border-wcm-line-strong';
  }
};

export const normalizeHealthStatus = (value: string | null | undefined): WcmHealthStatus => {
  const s = (value ?? '').trim().toUpperCase();
  if (s === 'HEALTHY' || s === 'DEGRADED' || s === 'STALE' || s === 'CRITICAL') return s;
  return 'UNKNOWN';
};

/**
 * HEALTH INVARIANT: an integrity check older than the last material delta cannot
 * certify the knowledge as healthy. The stored status is never falsified, but the
 * UI must degrade HEALTHY to STALE and explain why.
 */
export const isCheckOutdated = (health: WcmKnowledgeHealth | null | undefined): boolean => {
  if (!health?.checked_at || !health?.last_material_delta_at) return false;
  const checked = Date.parse(health.checked_at);
  const delta = Date.parse(health.last_material_delta_at);
  if (Number.isNaN(checked) || Number.isNaN(delta)) return false;
  return checked < delta;
};

export const effectiveHealthStatus = (
  health: WcmKnowledgeHealth | null | undefined,
): WcmHealthStatus => {
  if (!health) return 'UNKNOWN';
  const stored = normalizeHealthStatus(health.health_status);
  if (stored === 'HEALTHY' && isCheckOutdated(health)) return 'STALE';
  return stored;
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

/** Reads a metric under any of the accepted key aliases. */
export const metricOf = (
  source: unknown,
  ...keys: string[]
): number | string | null => {
  const record = asRecord(source);
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) {
      return value;
    }
  }
  return null;
};

export const SYNAPSE_METRICS: { keys: string[]; label: string; hint?: string }[] = [
  { keys: ['active_synapses', 'synapses_active'], label: 'Sinapsi attive' },
  {
    keys: ['new_synapses_since_checkpoint', 'new_synapses'],
    label: 'Nuove dal checkpoint',
  },
  {
    keys: ['changed_synapses_since_checkpoint', 'changed_synapses'],
    label: 'Modificate dal checkpoint',
  },
  { keys: ['at_risk_synapses', 'synapses_at_risk'], label: 'Sinapsi a rischio' },
  { keys: ['broken_synapses', 'synapses_broken'], label: 'Sinapsi rotte' },
  { keys: ['orphan_nodes', 'orphans'], label: 'Nodi orfani' },
  { keys: ['open_drifts', 'drifts_open'], label: 'Drift aperti' },
  { keys: ['continuity_debt'], label: 'Continuity debt' },
  { keys: ['payoff_debt'], label: 'Payoff debt' },
];

export const COMPONENT_LABELS: { keys: string[]; label: string }[] = [
  { keys: ['state_consistency'], label: 'Coerenza di stato' },
  { keys: ['decision_propagation'], label: 'Propagazione decisioni' },
  { keys: ['relationship_validity'], label: 'Validità relazioni' },
  { keys: ['ledger_freshness'], label: 'Freschezza ledger' },
  { keys: ['orphan_control'], label: 'Controllo orfani' },
];

export type KnowledgeIssue = {
  id?: string;
  title?: string;
  label?: string;
  severity?: string;
  status?: string;
  detail?: string;
  description?: string;
  node?: string;
  since?: string;
  [key: string]: unknown;
};

export const issuesOf = (health: WcmKnowledgeHealth | null | undefined): KnowledgeIssue[] => {
  const raw = health?.issues;
  if (Array.isArray(raw)) return raw.filter((i) => i && typeof i === 'object') as KnowledgeIssue[];
  return [];
};

export const severityClasses = (severity: string | undefined) => {
  switch ((severity ?? '').toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
      return 'bg-wcm-alert/15 text-wcm-alert-fg border-wcm-alert/30';
    case 'MEDIUM':
    case 'WARNING':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    default:
      return 'bg-wcm-dim/15 text-wcm-muted border-wcm-line-strong';
  }
};

export const GLOSSARY = {
  synapse: 'Sinapsi = relazione tipizzata tra nodi della knowledge.',
  checkpoint: 'Checkpoint = fotografia della knowledge a una milestone.',
  score: 'Health score = sintesi trasparente, non una certificazione assoluta.',
  notAQualityScore:
    'Il numero di sinapsi non è un indicatore di qualità: più sinapsi non significa knowledge migliore.',
};
