import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import WcmPageShell from '@/components/wcm/WcmPageShell';
import { STATUS_LABELS, statusClasses } from '@/components/wcm/wcmFormat';
import { isOpenNeed, useWcmNeeds, useWcmProjects } from '@/hooks/useWcmProjects';

const WcmProjectsPage = () => {
  const { data: projects, isLoading, error } = useWcmProjects(true);
  const { data: needs } = useWcmNeeds();

  const all = projects ?? [];
  const openNeeds = (needs ?? []).filter(isOpenNeed);
  const needsByProject = openNeeds.reduce<Record<string, number>>((acc, need) => {
    acc[need.project_id] = (acc[need.project_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <WcmPageShell title="Progetti" count={all.length}>
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
          Impossibile caricare i progetti.
        </p>
      )}

      {!isLoading && all.length === 0 && (
        <p className="rounded-lg border border-wcm-line bg-wcm-surface/50 p-6 text-sm text-wcm-muted">
          Nessun progetto WCM registrato.
        </p>
      )}

      <ul className="space-y-3">
        {all.map((project) => {
          const needCount = needsByProject[project.project_id] ?? 0;
          return (
            <li key={project.id}>
              <Link
                to={`/wcm/${project.project_id}`}
                className="block rounded-xl border border-wcm-line bg-wcm-surface/60 p-4 transition-colors hover:border-wcm-accent/50 hover:bg-wcm-panel/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-wcm-accent"
              >
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-wcm-strong sm:text-base">
                      {project.project_name}
                    </h2>
                    <p className="mt-0.5 font-mono text-[11px] text-wcm-dim">
                      {project.project_id}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
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
                    {(needCount > 0 || project.needs_stefano) && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-wcm-alert/30 bg-wcm-alert/10 px-2 py-0.5 text-[11px] text-wcm-alert-fg">
                        <AlertTriangle className="h-3 w-3" />
                        {needCount > 0 ? `${needCount} need` : 'Needs Stefano'}
                      </span>
                    )}
                    {(project.documents_to_read_count ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-wcm-line-strong bg-wcm-bg/50 px-2 py-0.5 text-[11px] text-wcm-text">
                        <FileText className="h-3 w-3" />
                        {project.documents_to_read_count}
                      </span>
                    )}
                  </div>
                </div>

                {project.short_description && (
                  <p className="mt-2 text-sm leading-relaxed text-wcm-text">
                    {project.short_description}
                  </p>
                )}

                <div className="mt-2 space-y-1">
                  {project.current_focus && (
                    <p className="text-xs leading-relaxed text-wcm-muted">
                      <span className="font-semibold uppercase tracking-wider text-wcm-dim">
                        Focus:{' '}
                      </span>
                      {project.current_focus}
                    </p>
                  )}
                  {project.next_action && (
                    <p className="text-xs leading-relaxed text-wcm-muted">
                      <span className="font-semibold uppercase tracking-wider text-wcm-dim">
                        Next:{' '}
                      </span>
                      {project.next_action}
                    </p>
                  )}
                </div>

                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-wcm-accent">
                  Apri progetto
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </WcmPageShell>
  );
};

export default WcmProjectsPage;
