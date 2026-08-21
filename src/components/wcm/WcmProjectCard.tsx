import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Activity,
  Clock,
  Target,
  ArrowRight,
  Ban,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WcmProjectStatus } from '@/hooks/useWcmProjects';
import type { WcmKnowledgeHealth } from '@/hooks/useWcmKnowledgeHealth';
import type { WcmExecutionWorkflow } from '@/hooks/useWcmExecutionWorkflows';
import WcmKnowledgeHealthBadge from './WcmKnowledgeHealthBadge';
import WcmExecutionSignal from './WcmExecutionSignal';
import { STATUS_LABELS, statusClasses, relativeTime } from './wcmFormat';



const Line = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null;
}) => {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wcm-dim" />
      <p className="text-xs leading-relaxed text-wcm-text">
        <span className="font-semibold uppercase tracking-wider text-wcm-dim">{label}: </span>
        {value}
      </p>
    </div>
  );
};

/**
 * Compact portfolio card. Renders only from wcm_project_status — no per-card
 * queries, so the home stays a single request regardless of project count.
 */
const WcmProjectCard = ({
  project,
  knowledgeHealth,
}: {
  project: WcmProjectStatus;
  knowledgeHealth?: WcmKnowledgeHealth | null;
}) => {

  const heartbeat = relativeTime(project.heartbeat_last_run_at);
  const toRead = project.documents_to_read_count ?? 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-wcm-line bg-wcm-surface/60 transition-colors hover:border-wcm-line-strong">
      <header className="border-b border-wcm-line p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/wcm/${project.project_id}`} className="group">
              <h2 className="truncate text-base font-semibold text-wcm-strong group-hover:text-wcm-accent">
                {project.project_name}
              </h2>
            </Link>
            <p className="mt-0.5 truncate font-mono text-[11px] text-wcm-dim">
              {project.project_id}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 text-[11px] font-medium',
                statusClasses(project.status),
              )}
            >
              {STATUS_LABELS[project.status] ?? project.status}
            </span>
            {project.phase && (
              <span className="rounded-md border border-wcm-line-strong bg-wcm-panel/60 px-2 py-0.5 font-mono text-[11px] text-wcm-text">
                {project.phase}
              </span>
            )}
          </div>
        </div>

        {project.short_description && (
          <p className="mt-2 text-sm leading-relaxed text-wcm-text">{project.short_description}</p>
        )}
      </header>

      {project.needs_stefano && (
        <div className="flex items-start gap-2 border-b border-wcm-alert/30 bg-wcm-alert/10 px-4 py-2.5">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wcm-alert-fg" />
          <p className="text-xs leading-relaxed text-wcm-alert-fg">
            <span className="font-bold uppercase tracking-[0.16em]">Needs Stefano</span>
            {project.board_gate_action_requested && ` — ${project.board_gate_action_requested}`}
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-wcm-line bg-wcm-bg/50 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
              <FileText className="h-3 w-3" />
              Da leggere
            </div>
            <p className="mt-0.5 text-lg font-semibold text-wcm-strong">{toRead}</p>
          </div>
          <div className="rounded-lg border border-wcm-line bg-wcm-bg/50 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
              <Clock className="h-3 w-3" />
              Heartbeat
            </div>
            <p className="mt-0.5 truncate text-xs text-wcm-text">
              {heartbeat ?? '—'}
              {project.heartbeat_last_outcome && (
                <span className="text-wcm-dim"> · {project.heartbeat_last_outcome}</span>
              )}
            </p>
          </div>
        </div>

        <div>
          <WcmKnowledgeHealthBadge health={knowledgeHealth} showSynapses />
        </div>

        <div className="space-y-1.5">
          <Line icon={Activity} label="Progressione" value={project.progress_summary} />

          <Line icon={Target} label="Focus" value={project.current_focus} />
          <Line icon={ArrowRight} label="Next" value={project.next_action} />
          <Line icon={Ban} label="Blocker" value={project.blocker} />
        </div>

        <Link
          to={`/wcm/${project.project_id}`}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-wcm-line-strong bg-wcm-panel/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-wcm-strong transition-colors hover:bg-wcm-panel"
        >
          Apri progetto
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
};

export default WcmProjectCard;
