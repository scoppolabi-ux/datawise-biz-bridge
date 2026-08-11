import type { WcmProjectStatus } from '@/hooks/useWcmProjects';
import { cn } from '@/lib/utils';
import { AlertTriangle, Activity, Clock, Target, ArrowRight, Ban } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  working: 'Working',
  waiting: 'Waiting',
  waiting_board: 'Waiting Board',
  blocked: 'Blocked',
  paused: 'Paused',
};

const statusClasses = (status: string) => {
  switch (status) {
    case 'working':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'blocked':
      return 'bg-red-500/15 text-red-300 border-red-500/30';
    case 'paused':
      return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    default:
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  }
};

const formatDateTime = (value: string | null) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const relativeTime = (value: string | null) => {
  if (!value) return null;
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diffMs / 60000);
  const rtf = new Intl.RelativeTimeFormat('it', { numeric: 'auto' });
  if (Math.abs(minutes) < 60) return rtf.format(-minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 48) return rtf.format(-hours, 'hour');
  return rtf.format(-Math.round(hours / 24), 'day');
};

const Field = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null;
}) => (
  <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
    <p className="mt-2 text-sm leading-relaxed text-slate-200">{value || '—'}</p>
  </div>
);

const WcmProjectCard = ({ project }: { project: WcmProjectStatus }) => {
  const heartbeatRelative = relativeTime(project.heartbeat_last_run_at);
  const activityRelative = relativeTime(project.last_material_activity_at);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      <header className="flex flex-col gap-3 border-b border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">{project.project_name}</h2>
          <p className="mt-1 font-mono text-xs text-slate-500">{project.project_id}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('rounded-md border px-2.5 py-1 text-xs font-medium', statusClasses(project.status))}>
            {STATUS_LABELS[project.status] ?? project.status}
          </span>
          {project.phase && (
            <span className="rounded-md border border-slate-700 bg-slate-800/60 px-2.5 py-1 font-mono text-xs text-slate-300">
              {project.phase}
            </span>
          )}
        </div>
      </header>

      {project.needs_stefano && (
        <section className="border-b border-red-500/30 bg-red-500/10 p-4 sm:p-6">
          <div className="flex items-center gap-2 text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-[0.18em]">Needs Stefano — Board Gate</h3>
          </div>
          {project.board_gate_action_requested && (
            <p className="mt-3 text-base font-medium leading-relaxed text-red-50">
              {project.board_gate_action_requested}
            </p>
          )}
          {project.board_gate_reason && (
            <p className="mt-3 text-sm leading-relaxed text-red-200/80">{project.board_gate_reason}</p>
          )}
        </section>
      )}

      <div className="space-y-4 p-4 sm:p-6">
        {project.summary && (
          <p className="text-sm leading-relaxed text-slate-300">{project.summary}</p>
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
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              Heartbeat
            </div>
            <p className="mt-2 text-sm text-slate-200">
              {formatDateTime(project.heartbeat_last_run_at)}
              {heartbeatRelative && <span className="text-slate-500"> · {heartbeatRelative}</span>}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Cadenza: <span className="font-mono">{project.heartbeat_cadence ?? '—'}</span> · Esito:{' '}
              <span className="font-mono text-slate-300">{project.heartbeat_last_outcome ?? '—'}</span>
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <Activity className="h-3.5 w-3.5" />
              Ultima attività materiale
            </div>
            <p className="mt-2 text-sm text-slate-200">
              {formatDateTime(project.last_material_activity_at)}
              {activityRelative && <span className="text-slate-500"> · {activityRelative}</span>}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default WcmProjectCard;
