import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, FileText, Loader2 } from 'lucide-react';
import WcmPageShell from '@/components/wcm/WcmPageShell';
import {
  isOpenNeed,
  needTargetPath,
  useWcmNeeds,
  useWcmProjects,
} from '@/hooks/useWcmProjects';

const WcmNeedsPage = () => {
  const { data: needs, isLoading, error } = useWcmNeeds();
  const { data: projects } = useWcmProjects(true);

  const byId = new Map((projects ?? []).map((p) => [p.project_id, p]));
  const openNeeds = (needs ?? []).filter(isOpenNeed);

  return (
    <WcmPageShell title="Needs Stefano" count={openNeeds.length}>
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
          Impossibile caricare i need.
        </p>
      )}

      {!isLoading && !error && openNeeds.length === 0 && (
        <p className="rounded-lg border border-wcm-line bg-wcm-surface/50 p-6 text-sm text-wcm-muted">
          Nessun need aperto: al momento nessun progetto richiede una decisione di Stefano.
        </p>
      )}

      <ul className="space-y-3">
        {openNeeds.map((need) => {
          const project = byId.get(need.project_id);
          const relatedCount = need.related_document_ids?.length ?? 0;
          return (
            <li key={need.id}>
              <Link
                to={needTargetPath(need)}
                className="block rounded-xl border border-wcm-alert/30 bg-wcm-alert/10 p-4 transition-colors hover:border-wcm-alert/60 hover:bg-wcm-alert/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-wcm-accent"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-wcm-dim">
                    {project?.project_name ?? need.project_id}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {need.need_type && (
                      <span className="rounded-md border border-wcm-line-strong bg-wcm-bg/50 px-2 py-0.5 font-mono text-[11px] text-wcm-text">
                        {need.need_type}
                      </span>
                    )}
                    {need.status && (
                      <span className="rounded-md border border-wcm-line-strong bg-wcm-bg/50 px-2 py-0.5 font-mono text-[11px] text-wcm-text">
                        {need.status}
                      </span>
                    )}
                    {project?.phase && (
                      <span className="rounded-md border border-wcm-line-strong bg-wcm-bg/50 px-2 py-0.5 font-mono text-[11px] text-wcm-dim">
                        {project.phase}
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="mt-1.5 flex items-start gap-2 text-sm font-semibold text-wcm-strong sm:text-base">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-wcm-alert-fg" />
                  {need.title}
                </h2>

                {need.action_requested && (
                  <p className="mt-2 text-sm leading-relaxed text-wcm-alert-fg">
                    {need.action_requested}
                  </p>
                )}
                {need.reason && (
                  <p className="mt-1.5 text-xs leading-relaxed text-wcm-muted">{need.reason}</p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  {relatedCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-wcm-dim">
                      <FileText className="h-3 w-3" />
                      {relatedCount} documenti collegati
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-wcm-accent">
                    Apri need
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </WcmPageShell>
  );
};

export default WcmNeedsPage;
