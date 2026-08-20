import type { WcmHealthStatus, WcmKnowledgeHealth } from '@/hooks/useWcmKnowledgeHealth';
import type { WcmProjectNeed, WcmProjectStatus } from '@/hooks/useWcmProjects';
import { isOpenNeed } from '@/hooks/useWcmProjects';
import {
  ACTIVE_COMMAND_STATUSES,
  type WcmCommandRequest,
} from '@/hooks/useWcmCommands';
import { effectiveHealthStatus, metricOf } from './wcmKnowledge';

/**
 * Four distinct health planes of Mission Control (V0.6).
 *
 * TRUST RULE: Mission Control is a projection, GitHub main is the source of truth.
 * A plane is NEVER green because data is missing: absence of evidence produces
 * UNKNOWN ("non proiettato"), never HEALTHY.
 */
export type HealthPlaneKey = 'project' | 'knowledge' | 'execution' | 'governance';

export type HealthPlane = {
  key: HealthPlaneKey;
  title: string;
  status: WcmHealthStatus;
  headline: string;
  /** Short evidence lines; every value comes from the read-model. */
  lines: { label: string; value: string }[];
  /** Deep link into the existing detailed view. */
  href: string;
  linkLabel: string;
};

const UNKNOWN_HINT = 'Non proiettato dal backend';

const txt = (value: string | null | undefined) =>
  value && value.trim() !== '' ? value.trim() : null;

const num = (value: number | string | null): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

/** PROJECT HEALTH — current project state, no invented scoring. */
const projectPlane = (project: WcmProjectStatus, needs: WcmProjectNeed[] | undefined): HealthPlane => {
  const status = (project.status ?? '').toLowerCase();
  const openNeeds = needs ? needs.filter(isOpenNeed).length : null;

  let plane: WcmHealthStatus = 'UNKNOWN';
  let headline = UNKNOWN_HINT;
  if (status === 'working') {
    plane = 'HEALTHY';
    headline = 'Progetto in esecuzione';
  } else if (status === 'blocked') {
    plane = 'CRITICAL';
    headline = 'Progetto bloccato';
  } else if (status === 'waiting' || status === 'waiting_board') {
    plane = 'DEGRADED';
    headline = 'In attesa di sblocco';
  } else if (status === 'paused') {
    plane = 'DEGRADED';
    headline = 'Progetto in pausa';
  } else if (status) {
    headline = `Stato non riconosciuto: ${project.status}`;
  }

  if (txt(project.blocker)) plane = plane === 'CRITICAL' ? plane : 'DEGRADED';

  return {
    key: 'project',
    title: 'Project Health',
    status: plane,
    headline,
    lines: [
      { label: 'Fase', value: txt(project.phase) ?? UNKNOWN_HINT },
      { label: 'Focus', value: txt(project.current_focus) ?? UNKNOWN_HINT },
      { label: 'Next action', value: txt(project.next_action) ?? UNKNOWN_HINT },
      { label: 'Blocker', value: txt(project.blocker) ?? 'Nessuno dichiarato' },
      {
        label: 'Needs aperti',
        value: openNeeds === null ? UNKNOWN_HINT : String(openNeeds),
      },
    ],
    href: `/wcm/${project.project_id}?tab=roadmap`,
    linkLabel: 'Vedi roadmap',
  };
};

/** KNOWLEDGE HEALTH — delegates to the existing invariant-aware derivation. */
const knowledgePlane = (
  project: WcmProjectStatus,
  health: WcmKnowledgeHealth | null | undefined,
): HealthPlane => {
  const status = effectiveHealthStatus(health);
  const score = health?.knowledge_integrity_score;
  const active = health ? metricOf(health.metrics, 'active_synapses', 'synapses_active') : null;
  const broken = health ? metricOf(health.metrics, 'broken_synapses', 'synapses_broken') : null;
  const drifts = health ? metricOf(health.metrics, 'open_drifts', 'drifts_open') : null;

  return {
    key: 'knowledge',
    title: 'Knowledge Health',
    status,
    headline: health
      ? score !== null && score !== undefined
        ? `Integrity score ${score}/100`
        : 'Telemetria attiva, score non fornito'
      : 'Layer di assurance non adottato',
    lines: [
      { label: 'Ultimo check', value: health?.checked_at ?? UNKNOWN_HINT },
      { label: 'Ultimo delta materiale', value: health?.last_material_delta_at ?? UNKNOWN_HINT },
      { label: 'Sinapsi attive', value: active === null ? UNKNOWN_HINT : String(active) },
      { label: 'Sinapsi rotte', value: broken === null ? UNKNOWN_HINT : String(broken) },
      { label: 'Drift aperti', value: drifts === null ? UNKNOWN_HINT : String(drifts) },
    ],
    href: `/wcm/${project.project_id}?tab=knowledge`,
    linkLabel: 'Apri Knowledge Health',
  };
};

/**
 * EXECUTION HEALTH — only real evidence: heartbeat and knowledge-assurance check.
 * A missing heartbeat is UNKNOWN, never green.
 */
const executionPlane = (
  project: WcmProjectStatus,
  health: WcmKnowledgeHealth | null | undefined,
): HealthPlane => {
  const lastRun = project.heartbeat_last_run_at;
  const outcome = txt(project.heartbeat_last_outcome);
  const outcomeUpper = (outcome ?? '').toUpperCase();

  let status: WcmHealthStatus = 'UNKNOWN';
  let headline = 'Heartbeat non proiettato';

  if (lastRun) {
    const ageHours = (Date.now() - Date.parse(lastRun)) / 3_600_000;
    const failed = /FAIL|ERROR|KO|BLOCK/.test(outcomeUpper);
    const ok = /OK|SUCCESS|PASS|DONE|GREEN/.test(outcomeUpper);

    if (failed) {
      status = 'CRITICAL';
      headline = 'Ultimo heartbeat fallito';
    } else if (Number.isFinite(ageHours) && ageHours > 48) {
      status = 'STALE';
      headline = 'Heartbeat non aggiornato da oltre 48 ore';
    } else if (ok) {
      status = 'HEALTHY';
      headline = 'Heartbeat regolare';
    } else {
      status = 'DEGRADED';
      headline = outcome ? `Esito heartbeat: ${outcome}` : 'Esito heartbeat non dichiarato';
    }
  }

  if (txt(project.blocker) && status !== 'CRITICAL') {
    status = 'DEGRADED';
    headline = 'Blocker operativo dichiarato';
  }

  return {
    key: 'execution',
    title: 'Execution Health',
    status,
    headline,
    lines: [
      { label: 'Ultimo heartbeat', value: lastRun ?? UNKNOWN_HINT },
      { label: 'Cadenza', value: txt(project.heartbeat_cadence) ?? UNKNOWN_HINT },
      { label: 'Esito', value: outcome ?? UNKNOWN_HINT },
      {
        label: 'Ultima attività materiale',
        value: project.last_material_activity_at ?? UNKNOWN_HINT,
      },
      {
        label: 'Knowledge assurance check',
        value: health?.checked_at ?? UNKNOWN_HINT,
      },
    ],
    href: `/wcm/${project.project_id}?tab=activity`,
    linkLabel: 'Vedi activity',
  };
};

/** GOVERNANCE HEALTH — board gate, open needs, command queue evidence. */
const governancePlane = (
  project: WcmProjectStatus,
  needs: WcmProjectNeed[] | undefined,
  commands: WcmCommandRequest[] | undefined,
): HealthPlane => {
  const openNeeds = needs ? needs.filter(isOpenNeed) : null;
  const pending = commands
    ? commands.filter((c) => ACTIVE_COMMAND_STATUSES.includes(c.status))
    : null;
  const broken = commands
    ? commands.filter((c) => c.status === 'STALE' || c.status === 'FAILED' || c.status === 'REJECTED')
    : null;
  // Only the latest command per need matters for "currently broken authority".
  const latestBroken =
    commands && commands.length > 0
      ? (() => {
          const seen = new Set<string>();
          return commands.filter((c) => {
            const key = `${c.project_id}::${c.need_id}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return c.status === 'STALE' || c.status === 'FAILED' || c.status === 'REJECTED';
          }).length;
        })()
      : null;

  let status: WcmHealthStatus = 'UNKNOWN';
  let headline = UNKNOWN_HINT;

  if (needs !== undefined || commands !== undefined) {
    if (latestBroken && latestBroken > 0) {
      status = 'CRITICAL';
      headline = 'Comando di autorità non registrato — richiede sincronizzazione';
    } else if (project.needs_stefano) {
      status = 'DEGRADED';
      headline = 'Board Gate aperto — decisione umana richiesta';
    } else if (pending && pending.length > 0) {
      status = 'DEGRADED';
      headline = 'Decisione inviata, in attesa di esecuzione WCM';
    } else if (openNeeds && openNeeds.length > 0) {
      status = 'DEGRADED';
      headline = 'Needs aperti in governance';
    } else if (needs !== undefined && commands !== undefined) {
      status = 'HEALTHY';
      headline = 'Nessun gate aperto';
    }
  }

  return {
    key: 'governance',
    title: 'Governance Health',
    status,
    headline,
    lines: [
      {
        label: 'Board Gate',
        value: project.needs_stefano
          ? txt(project.board_gate_action_requested) ?? 'Aperto'
          : 'Chiuso',
      },
      { label: 'Needs aperti', value: openNeeds === null ? UNKNOWN_HINT : String(openNeeds.length) },
      {
        label: 'Comandi pending',
        value: pending === null ? UNKNOWN_HINT : String(pending.length),
      },
      {
        label: 'Comandi stale/falliti',
        value: broken === null ? UNKNOWN_HINT : String(broken.length),
      },
      { label: 'Verdetto board', value: txt(project.board_verdict) ?? UNKNOWN_HINT },
    ],
    href: `/wcm/${project.project_id}?tab=board`,
    linkLabel: 'Apri Board',
  };
};

export const buildHealthPlanes = (input: {
  project: WcmProjectStatus;
  needs?: WcmProjectNeed[];
  commands?: WcmCommandRequest[];
  knowledgeHealth?: WcmKnowledgeHealth | null;
}): HealthPlane[] => [
  projectPlane(input.project, input.needs),
  knowledgePlane(input.project, input.knowledgeHealth),
  executionPlane(input.project, input.knowledgeHealth),
  governancePlane(input.project, input.needs, input.commands),
];

/** Growth deltas between the latest checkpoint and the current knowledge metrics. */
export type KnowledgeGrowthRow = {
  label: string;
  current: number | null;
  checkpoint: number | null;
  delta: number | null;
  /** true when an increase is a worsening signal (debt, broken, orphan…). */
  lowerIsBetter: boolean;
};

const GROWTH_METRICS: { keys: string[]; label: string; lowerIsBetter: boolean }[] = [
  { keys: ['nodes', 'knowledge_nodes', 'active_nodes'], label: 'Nodi', lowerIsBetter: false },
  {
    keys: ['active_synapses', 'synapses_active'],
    label: 'Sinapsi attive',
    lowerIsBetter: false,
  },
  { keys: ['broken_synapses', 'synapses_broken'], label: 'Sinapsi rotte', lowerIsBetter: true },
  { keys: ['at_risk_synapses', 'synapses_at_risk'], label: 'Sinapsi a rischio', lowerIsBetter: true },
  { keys: ['orphan_nodes', 'orphans'], label: 'Nodi orfani', lowerIsBetter: true },
  { keys: ['open_drifts', 'drifts_open'], label: 'Drift aperti', lowerIsBetter: true },
  { keys: ['continuity_debt'], label: 'Continuity debt', lowerIsBetter: true },
  { keys: ['payoff_debt'], label: 'Payoff debt', lowerIsBetter: true },
];

export const knowledgeGrowth = (
  health: WcmKnowledgeHealth | null | undefined,
  checkpointMetrics: unknown,
): KnowledgeGrowthRow[] =>
  GROWTH_METRICS.map(({ keys, label, lowerIsBetter }) => {
    const current = num(metricOf(health?.metrics, ...keys));
    const checkpoint = num(metricOf(checkpointMetrics, ...keys));
    return {
      label,
      current,
      checkpoint,
      delta: current !== null && checkpoint !== null ? current - checkpoint : null,
      lowerIsBetter,
    };
  }).filter((row) => row.current !== null || row.checkpoint !== null);
