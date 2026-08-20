import { Activity, AlertTriangle, ArrowRight, Ban, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WcmProjectNeed, WcmProjectRoadmapItem, WcmProjectStatus } from '@/hooks/useWcmProjects';
import type { WcmKnowledgeHealth } from '@/hooks/useWcmKnowledgeHealth';
import type { WcmCommandRequest } from '@/hooks/useWcmCommands';
import WcmKnowledgeHealthBadge from './WcmKnowledgeHealthBadge';
import WcmHealthSummary from './WcmHealthSummary';


import {
  ROADMAP_STATUS_LABELS,
  formatDateTime,
  relativeTime,
  roadmapStatusClasses,
} from './wcmFormat';

const Field = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null;
}) => (
  <div className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-4">
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
    <p className="mt-2 text-sm leading-relaxed text-wcm-text">{value || '—'}</p>
  </div>
);

const WcmOverviewTab = ({
  project,
  roadmap,
  knowledgeHealth,
  needs,
  commands,
}: {
  project: WcmProjectStatus;
  roadmap: WcmProjectRoadmapItem[];
  knowledgeHealth?: WcmKnowledgeHealth | null;
  needs?: WcmProjectNeed[];
  commands?: WcmCommandRequest[];
}) => (
  <div className="space-y-4">
    <div className="flex flex-wrap items-center gap-2">
      <WcmKnowledgeHealthBadge health={knowledgeHealth} showSynapses />
    </div>

    <WcmHealthSummary
      project={project}
      needs={needs}
      commands={commands}
      knowledgeHealth={knowledgeHealth}
    />

    {knowledgeHealth?.steward_activity && (
      <p className="rounded-lg border border-wcm-line bg-wcm-surface/60 px-4 py-2.5 text-xs text-wcm-muted">
        <span className="font-semibold uppercase tracking-wider text-wcm-dim">
          Ultimo ciclo Steward
        </span>{' '}
        · {stewardClassificationLabel(knowledgeHealth.steward_activity.classification)} ·{' '}
        <span className="text-wcm-text">
          {formatDateTime(knowledgeHealth.steward_activity.occurred_at ?? null)}
        </span>
      </p>
    )}





    {project.short_description && (
      <section className="rounded-xl border border-wcm-line bg-wcm-panel/40 p-4 sm:p-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">
          Identità progetto
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-wcm-strong">
          {project.short_description}
        </p>
      </section>
    )}

    {project.needs_stefano && (
      <section className="rounded-xl border border-wcm-alert/30 bg-wcm-alert/10 p-4 sm:p-6">
        <div className="flex items-center gap-2 text-wcm-alert-fg">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">
            Needs Stefano — Board Gate
          </h2>
        </div>
        {project.board_gate_action_requested && (
          <p className="mt-3 text-base font-medium leading-relaxed text-wcm-strong">
            {project.board_gate_action_requested}
          </p>
        )}
      </section>
    )}

    {project.summary && (
      <p className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-4 text-sm leading-relaxed text-wcm-text sm:p-6">
        {project.summary}
      </p>
    )}

    <div className="grid gap-3 sm:grid-cols-2">
      <Field icon={Target} label="Current focus" value={project.current_focus} />
      <Field icon={ArrowRight} label="Next action" value={project.next_action} />
      <Field icon={Ban} label="Blocker" value={project.blocker} />
      <Field
        icon={Activity}
        label="Last material activity"
        value={project.last_material_activity}
      />
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">
          <Clock className="h-3.5 w-3.5" />
          Heartbeat
        </div>
        <p className="mt-2 text-sm text-wcm-text">
          {formatDateTime(project.heartbeat_last_run_at)}
          {relativeTime(project.heartbeat_last_run_at) && (
            <span className="text-wcm-dim"> · {relativeTime(project.heartbeat_last_run_at)}</span>
          )}
        </p>
        <p className="mt-1 text-xs text-wcm-muted">
          Cadenza: <span className="font-mono">{project.heartbeat_cadence ?? '—'}</span> · Esito:{' '}
          <span className="font-mono text-wcm-text">{project.heartbeat_last_outcome ?? '—'}</span>
        </p>
      </div>
      <div className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">
          <Activity className="h-3.5 w-3.5" />
          Ultima attività materiale
        </div>
        <p className="mt-2 text-sm text-wcm-text">
          {formatDateTime(project.last_material_activity_at)}
          {relativeTime(project.last_material_activity_at) && (
            <span className="text-wcm-dim">
              {' '}
              · {relativeTime(project.last_material_activity_at)}
            </span>
          )}
        </p>
      </div>
    </div>

    <section className="overflow-hidden rounded-xl border border-wcm-line bg-wcm-surface/60">
      <h3 className="border-b border-wcm-line px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
        Progressione
      </h3>
      <div className="space-y-3 p-4">
        {project.progress_summary && (
          <p className="text-sm leading-relaxed text-wcm-text">{project.progress_summary}</p>
        )}
        {roadmap.length === 0 ? (
          <p className="text-sm text-wcm-dim">Nessuna milestone nel read-model.</p>
        ) : (
          <ul className="space-y-2">
            {roadmap.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-wcm-line bg-wcm-bg/50 px-3 py-2"
              >
                <span className="min-w-0 truncate text-sm text-wcm-text">{item.label}</span>
                <span
                  className={cn(
                    'shrink-0 rounded-md border px-2 py-0.5 text-[11px]',
                    roadmapStatusClasses(item.status),
                  )}
                >
                  {ROADMAP_STATUS_LABELS[(item.status ?? '').toUpperCase()] ?? item.status ?? '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  </div>
);

export default WcmOverviewTab;
