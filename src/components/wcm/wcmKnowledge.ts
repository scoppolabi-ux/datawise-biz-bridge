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

/* ---------------------------------------------------------------------------
 * V0.7 — Steward Activity (observation-only)
 * ------------------------------------------------------------------------- */

export const STEWARD_CLASSIFICATION_LABELS: Record<string, string> = {
  GREEN_NO_ACTION: 'Nessun intervento necessario',
  MECHANICAL_REPAIRED: 'Anomalia meccanica riparata',
  ESCALATE_NO_WRITE: 'Escalation senza scrittura',
  NON_GREEN_NO_ALLOWLISTED_REPAIR: 'Nessuna repair autorizzata disponibile',
};

/** Fallback leggibile per enum non mappati: GREEN_NO_ACTION -> "Green no action". */
export const stewardClassificationLabel = (value: unknown): string => {
  const raw = typeof value === 'string' ? value.trim().toUpperCase() : '';
  if (!raw) return 'Classificazione non disponibile';
  if (STEWARD_CLASSIFICATION_LABELS[raw]) return STEWARD_CLASSIFICATION_LABELS[raw];
  const words = raw.toLowerCase().replace(/_/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export const stewardClassificationClasses = (value: unknown) => {
  switch (typeof value === 'string' ? value.trim().toUpperCase() : '') {
    case 'GREEN_NO_ACTION':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'MECHANICAL_REPAIRED':
      return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    case 'ESCALATE_NO_WRITE':
      return 'bg-amber-500/15 text-amber-200 border-amber-500/40';
    case 'NON_GREEN_NO_ALLOWLISTED_REPAIR':
      return 'bg-wcm-alert/15 text-wcm-alert-fg border-wcm-alert/30';
    default:
      return 'bg-wcm-dim/15 text-wcm-muted border-wcm-line-strong';
  }
};

/** Normalizza un valore in lista leggibile; mai inventa dati. */
export const stewardList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item === null || item === undefined) return '';
        if (typeof item === 'string' || typeof item === 'number') return String(item);
        const rec = item as Record<string, unknown>;
        const label = rec.title ?? rec.label ?? rec.name ?? rec.path ?? rec.id ?? rec.reason;
        const detail = rec.detail ?? rec.description ?? rec.message;
        const head = label !== undefined && label !== null ? String(label) : JSON.stringify(item);
        return detail ? `${head} — ${String(detail)}` : head;
      })
      .filter((s) => s.trim() !== '');
  }
  if (typeof value === 'string' && value.trim() !== '') return [value.trim()];
  return [];
};

/** Conteggio: array -> length, numero -> valore, altrimenti null (UNKNOWN). */
export const stewardCount = (value: unknown): number | null => {
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return null;
};
