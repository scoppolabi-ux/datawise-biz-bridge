import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Brain, Gavel, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WcmKnowledgeHealth } from '@/hooks/useWcmKnowledgeHealth';
import type { WcmProjectNeed, WcmProjectStatus } from '@/hooks/useWcmProjects';
import type { WcmCommandRequest } from '@/hooks/useWcmCommands';
import { HEALTH_LABELS, healthClasses } from './wcmKnowledge';
import { buildHealthPlanes, type HealthPlaneKey } from './wcmHealthPlanes';
import { formatDateTime } from './wcmFormat';

const ICONS: Record<HealthPlaneKey, React.ElementType> = {
  project: LayoutGrid,
  knowledge: Brain,
  execution: Activity,
  governance: Gavel,
};

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}T/.test(value);

/**
 * Compact four-plane health summary. Observation only: no command, no write-back.
 * UNKNOWN is shown whenever the backend does not project the evidence.
 */
const WcmHealthSummary = ({
  project,
  needs,
  commands,
  knowledgeHealth,
}: {
  project: WcmProjectStatus;
  needs?: WcmProjectNeed[];
  commands?: WcmCommandRequest[];
  knowledgeHealth?: WcmKnowledgeHealth | null;
}) => {
  const planes = buildHealthPlanes({ project, needs, commands, knowledgeHealth });

  return (
    <section className="space-y-2">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
        Health planes
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {planes.map((plane) => {
          const Icon = ICONS[plane.key];
          return (
            <article
              key={plane.key}
              className="flex flex-col rounded-xl border border-wcm-line bg-wcm-surface/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-wcm-strong">
                  <Icon className="h-3.5 w-3.5 text-wcm-accent" />
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em]">
                    {plane.title}
                  </h3>
                </div>
                <span
                  className={cn(
                    'rounded-md border px-2 py-0.5 text-[11px] font-medium',
                    healthClasses(plane.status),
                  )}
                >
                  {HEALTH_LABELS[plane.status]}
                </span>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-wcm-text">{plane.headline}</p>

              <dl className="mt-3 space-y-1">
                {plane.lines.map((line) => (
                  <div key={line.label} className="flex gap-2 text-[11px] leading-relaxed">
                    <dt className="shrink-0 font-semibold uppercase tracking-wider text-wcm-dim">
                      {line.label}
                    </dt>
                    <dd className="min-w-0 flex-1 truncate text-wcm-text">
                      {isIsoDate(line.value) ? formatDateTime(line.value) : line.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                to={plane.href}
                className="mt-3 inline-flex items-center gap-1.5 self-start text-[11px] font-semibold uppercase tracking-[0.14em] text-wcm-accent transition-colors hover:text-wcm-strong"
              >
                {plane.linkLabel}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </article>
          );
        })}
      </div>
      <p className="text-[11px] leading-relaxed text-wcm-dim">
        Mission Control è una proiezione: GitHub main resta la fonte di verità. Uno stato verde non
        viene mai dedotto dall'assenza di dati — se un segnale non è proiettato viene mostrato come{' '}
        <span className="font-mono">UNKNOWN</span>.
      </p>
    </section>
  );
};

export default WcmHealthSummary;
