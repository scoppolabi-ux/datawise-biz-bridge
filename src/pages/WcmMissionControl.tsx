import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWcmProjects } from '@/hooks/useWcmProjects';
import WcmProjectCard from '@/components/wcm/WcmProjectCard';
import WcmBrandHeader from '@/components/wcm/WcmBrandHeader';

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="wcm-grid min-h-screen">
    <Helmet>
      <title>WCM Mission Control · DataWisePartners</title>
      <meta name="robots" content="noindex, nofollow, noarchive" />
    </Helmet>
    {children}
  </div>
);

const Metric = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-lg border border-wcm-line bg-wcm-surface/60 px-4 py-3">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">{label}</p>
    <p className="mt-0.5 text-xl font-semibold text-wcm-strong">{value}</p>
  </div>
);

const WcmMissionControl = () => {
  const { data: projects, isLoading, isFetching, error, refetch } = useWcmProjects(true);

  const all = projects ?? [];
  const attention = all.filter((p) => p.needs_stefano);
  const docsToRead = all.reduce((sum, p) => sum + (p.documents_to_read_count ?? 0), 0);

  return (
    <Shell>
      <WcmBrandHeader
        eyebrow="DataWisePartners"
        title={<h1 className="text-base font-semibold tracking-tight sm:text-lg">WCM Mission Control</h1>}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-wcm-line-strong bg-transparent text-wcm-text hover:border-wcm-accent hover:bg-wcm-surface hover:text-wcm-strong"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Aggiorna
          </Button>
        }
      >
        <p className="mt-0.5 text-xs text-wcm-dim">Console direzionale · portfolio progetti WCM</p>
      </WcmBrandHeader>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
            Impossibile caricare lo stato dei progetti.
          </p>
        )}

        {projects && projects.length === 0 && (
          <p className="rounded-lg border border-wcm-line bg-wcm-surface/50 p-6 text-sm text-wcm-muted">
            Nessun progetto WCM registrato.
          </p>
        )}

        {all.length > 0 && (
          <>
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Metric label="Progetti" value={all.length} />
              <Metric label="Needs Stefano" value={attention.length} />
              <Metric label="Documenti da leggere" value={docsToRead} />
            </section>

            {attention.length > 0 && (
              <section className="mt-6 rounded-xl border border-wcm-alert/30 bg-wcm-alert/10 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-wcm-alert-fg">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.18em]">
                    Attenzione — Needs Stefano
                  </h2>
                </div>
                <ul className="mt-3 space-y-2">
                  {attention.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/wcm/${p.project_id}`}
                        className="block rounded-lg border border-wcm-alert/25 bg-wcm-bg/40 p-3 transition-colors hover:border-wcm-alert/60"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                          <span className="text-sm font-semibold text-wcm-strong">
                            {p.project_name}
                          </span>
                          {(p.documents_to_read_count ?? 0) > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-wcm-alert-fg">
                              <FileText className="h-3 w-3" />
                              {p.documents_to_read_count} da leggere
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-wcm-dim">
                          {p.short_description || p.phase || p.project_id}
                        </p>
                        {p.board_gate_action_requested && (
                          <p className="mt-1.5 text-sm leading-relaxed text-wcm-alert-fg">
                            {p.board_gate_action_requested}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-6 grid gap-4 lg:grid-cols-2">
              {all.map((project) => (
                <WcmProjectCard key={project.id} project={project} />
              ))}
            </section>
          </>
        )}
      </main>
    </Shell>
  );
};

export default WcmMissionControl;
