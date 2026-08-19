import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronRight, Clock, FileText, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  needTargetPath,
  useWcmDocumentsToRead,
  useWcmNeeds,
  useWcmProjects,
} from '@/hooks/useWcmProjects';
import { derivedBadge, useWcmNeedStates } from '@/hooks/useWcmNeedStates';
import { COMMAND_STATUS_LABELS } from '@/hooks/useWcmCommands';
import { useWcmKnowledgeHealthAll } from '@/hooks/useWcmKnowledgeHealth';
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

/** KPI card = drill-down entry point into an aggregated view. */
const Metric = ({
  label,
  value,
  to,
}: {
  label: string;
  value: number | string;
  to: string;
}) => (
  <Link
    to={to}
    className="group flex items-center justify-between gap-2 rounded-lg border border-wcm-line bg-wcm-surface/60 px-4 py-3 transition-colors hover:border-wcm-accent/60 hover:bg-wcm-panel/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-wcm-accent"
  >
    <span className="min-w-0">
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
        {label}
      </span>
      <span className="mt-0.5 block text-xl font-semibold text-wcm-strong">{value}</span>
    </span>
    <ChevronRight className="h-4 w-4 shrink-0 text-wcm-dim transition-colors group-hover:text-wcm-accent" />
  </Link>
);

const WcmMissionControl = () => {
  const { data: projects, isLoading, isFetching, error, refetch } = useWcmProjects(true);
  const { data: needs } = useWcmNeeds();
  const { data: docsToReadList } = useWcmDocumentsToRead();
  const { needsStefano, pendingNeeds, ready } = useWcmNeedStates();
  const { data: knowledgeHealth } = useWcmKnowledgeHealthAll();

  const all = projects ?? [];
  const projectById = new Map(all.map((p) => [p.project_id, p]));
  const healthByProject = new Map((knowledgeHealth ?? []).map((h) => [h.project_id, h]));

  // Legacy fallback: only while no first-class Need snapshot exists at all.
  const hasNeedSnapshot = (needs?.length ?? 0) > 0;
  const legacyAttention = hasNeedSnapshot ? [] : all.filter((p) => p.needs_stefano);
  const attentionCount = ready
    ? hasNeedSnapshot
      ? needsStefano.length
      : legacyAttention.length
    : null;
  const pendingCount = ready ? pendingNeeds.length : null;
  const docsToRead =
    docsToReadList?.length ??
    all.reduce((sum, p) => sum + (p.documents_to_read_count ?? 0), 0);

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
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Metric label="Progetti" value={all.length} to="/wcm/projects" />
              <Metric
                label="Needs Stefano"
                value={attentionCount ?? '—'}
                to="/wcm/needs?view=action"
              />
              <Metric label="Pending" value={pendingCount ?? '—'} to="/wcm/needs?view=pending" />
              <Metric label="Documenti da leggere" value={docsToRead} to="/wcm/documents" />
            </section>

            {ready && (attentionCount ?? 0) > 0 && (
              <section className="mt-6 rounded-xl border border-wcm-alert/30 bg-wcm-alert/10 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 text-wcm-alert-fg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <h2 className="text-sm font-bold uppercase tracking-[0.18em]">
                      Attenzione — Needs Stefano
                    </h2>
                  </div>
                  <Link
                    to="/wcm/needs?view=action"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] hover:text-wcm-strong"
                  >
                    Tutti
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <ul className="mt-3 space-y-2">
                  {hasNeedSnapshot
                    ? needsStefano.map(({ need, latestCommand }) => {
                        const project = projectById.get(need.project_id);
                        const related = need.related_document_ids?.length ?? 0;
                        return (
                          <li key={need.id}>
                            <Link
                              to={needTargetPath(need)}
                              className="block rounded-lg border border-wcm-alert/25 bg-wcm-bg/40 p-3 transition-colors hover:border-wcm-alert/60"
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                <span className="text-sm font-semibold text-wcm-strong">
                                  {project?.project_name ?? need.project_id}
                                </span>
                                <span className="flex flex-wrap items-center gap-2 text-[11px] text-wcm-dim">
                                  {need.need_type && <span>{need.need_type}</span>}
                                  {need.status && <span>{need.status}</span>}
                                  {related > 0 && (
                                    <span className="inline-flex items-center gap-1 text-wcm-alert-fg">
                                      <FileText className="h-3 w-3" />
                                      {related}
                                    </span>
                                  )}
                                </span>
                              </div>
                              <p className="mt-0.5 text-sm font-medium text-wcm-text">
                                {need.title}
                              </p>
                              {need.action_requested && (
                                <p className="mt-1.5 text-sm leading-relaxed text-wcm-alert-fg">
                                  {need.action_requested}
                                </p>
                              )}
                              {latestCommand && (
                                <p className="mt-1.5 text-[11px] text-wcm-dim">
                                  Ultimo comando: {latestCommand.command_type} ·{' '}
                                  {COMMAND_STATUS_LABELS[latestCommand.status]}
                                </p>
                              )}
                            </Link>
                          </li>
                        );
                      })
                    : legacyAttention.map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/wcm/${p.project_id}?tab=board`}
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

            {ready && pendingNeeds.length > 0 && (
              <section className="mt-6 rounded-xl border border-wcm-line-strong bg-wcm-surface/60 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 text-wcm-text">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-wcm-dim" />
                    <h2 className="text-sm font-bold uppercase tracking-[0.18em]">
                      Decisioni in elaborazione
                    </h2>
                  </div>
                  <Link
                    to="/wcm/needs?view=pending"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-wcm-accent hover:text-wcm-strong"
                  >
                    Tutte
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <ul className="mt-3 space-y-2">
                  {pendingNeeds.map((item) => {
                    const { need, latestCommand } = item;
                    const project = projectById.get(need.project_id);
                    const recorded = latestCommand?.status === 'RECORDED';
                    return (
                      <li key={need.id}>
                        <Link
                          to={needTargetPath(need)}
                          className="block rounded-lg border border-wcm-line bg-wcm-bg/40 p-3 transition-colors hover:border-wcm-accent/60"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <span className="text-sm font-semibold text-wcm-strong">
                              {project?.project_name ?? need.project_id}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-wcm-dim">
                              {derivedBadge(item)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm font-medium text-wcm-text">{need.title}</p>
                          {latestCommand && (
                            <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.12em] text-wcm-dim">
                              {latestCommand.command_type} · {latestCommand.status}
                            </p>
                          )}
                          <p className="mt-1.5 text-sm leading-relaxed text-wcm-muted">
                            {recorded
                              ? 'Autorità registrata su GitHub: l’esecuzione WCM può essere ancora in corso.'
                              : 'Stefano ha già deciso: il sistema sta elaborando la decisione. Nessuna azione umana richiesta ora.'}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <section className="mt-6 grid gap-4 lg:grid-cols-2">
              {all.map((project) => (
                <WcmProjectCard
                  key={project.id}
                  project={project}
                  knowledgeHealth={healthByProject.get(project.project_id) ?? null}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </Shell>
  );
};

export default WcmMissionControl;
