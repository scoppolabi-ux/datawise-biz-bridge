import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Clock, FileText, Loader2 } from 'lucide-react';
import WcmPageShell from '@/components/wcm/WcmPageShell';
import { needTargetPath, useWcmProjects } from '@/hooks/useWcmProjects';
import {
  derivedBadge,
  useWcmNeedStates,
  type ClassifiedNeed,
} from '@/hooks/useWcmNeedStates';

const VIEWS = {
  action: 'Needs Stefano · azione richiesta',
  pending: 'Decisioni in elaborazione',
} as const;

const WcmNeedsPage = () => {
  const [params] = useSearchParams();
  const rawView = params.get('view');
  const view = rawView === 'action' || rawView === 'pending' ? rawView : null;

  const { classified, needsStefano, pendingNeeds, isLoading, error, ready } = useWcmNeedStates();
  const { data: projects } = useWcmProjects(true);
  const byId = new Map((projects ?? []).map((p) => [p.project_id, p]));

  const visible: ClassifiedNeed[] =
    view === 'action' ? needsStefano : view === 'pending' ? pendingNeeds : classified;

  const title = view ? VIEWS[view] : 'Needs Stefano';

  const renderItem = (item: ClassifiedNeed) => {
    const { need, latestCommand, derived } = item;
    const project = byId.get(need.project_id);
    const relatedCount = need.related_document_ids?.length ?? 0;
    const isAction = derived === 'NEEDS_STEFANO';
    return (
      <li key={need.id}>
        <Link
          to={needTargetPath(need)}
          className={`block rounded-xl border p-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-wcm-accent ${
            isAction
              ? 'border-wcm-alert/30 bg-wcm-alert/10 hover:border-wcm-alert/60 hover:bg-wcm-alert/15'
              : 'border-wcm-line-strong bg-wcm-surface/60 hover:border-wcm-accent/60'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-wcm-dim">
              {project?.project_name ?? need.project_id}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
                  isAction
                    ? 'border-wcm-alert/40 bg-wcm-alert/15 text-wcm-alert-fg'
                    : 'border-wcm-line-strong bg-wcm-bg/50 text-wcm-text'
                }`}
              >
                {derivedBadge(item)}
              </span>
              {need.need_type && (
                <span className="rounded-md border border-wcm-line-strong bg-wcm-bg/50 px-2 py-0.5 font-mono text-[11px] text-wcm-text">
                  {need.need_type}
                </span>
              )}
              {need.status && (
                <span className="rounded-md border border-wcm-line-strong bg-wcm-bg/50 px-2 py-0.5 font-mono text-[11px] text-wcm-dim">
                  {need.status}
                </span>
              )}
            </div>
          </div>

          <h2 className="mt-1.5 flex items-start gap-2 text-sm font-semibold text-wcm-strong sm:text-base">
            {isAction ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-wcm-alert-fg" />
            ) : (
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-wcm-dim" />
            )}
            {need.title}
          </h2>

          {isAction && need.action_requested && (
            <p className="mt-2 text-sm leading-relaxed text-wcm-alert-fg">
              {need.action_requested}
            </p>
          )}
          {!isAction && (
            <p className="mt-2 text-sm leading-relaxed text-wcm-muted">
              {latestCommand?.status === 'RECORDED'
                ? 'Autorità registrata su GitHub: l’esecuzione WCM può essere ancora in corso.'
                : 'Decisione già inviata da Stefano: il sistema la sta elaborando.'}
            </p>
          )}
          {need.reason && (
            <p className="mt-1.5 text-xs leading-relaxed text-wcm-muted">{need.reason}</p>
          )}
          {latestCommand && (
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-wcm-dim">
              {latestCommand.command_type} · {latestCommand.status}
              {latestCommand.failure_reason ? ` · ${latestCommand.failure_reason}` : ''}
            </p>
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
  };

  return (
    <WcmPageShell title={title} count={ready ? visible.length : undefined}>
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { key: null, label: 'Tutti', to: '/wcm/needs' },
          { key: 'action', label: 'Azione richiesta', to: '/wcm/needs?view=action' },
          { key: 'pending', label: 'In elaborazione', to: '/wcm/needs?view=pending' },
        ].map((tab) => (
          <Link
            key={tab.label}
            to={tab.to}
            className={`rounded-md border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
              view === tab.key
                ? 'border-wcm-accent bg-wcm-accent/15 text-wcm-strong'
                : 'border-wcm-line-strong bg-wcm-surface/50 text-wcm-dim hover:text-wcm-text'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {(isLoading || !ready) && !error && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
          Impossibile caricare i need.
        </p>
      )}

      {ready && !error && visible.length === 0 && (
        <p className="rounded-lg border border-wcm-line bg-wcm-surface/50 p-6 text-sm text-wcm-muted">
          {view === 'pending'
            ? 'Nessuna decisione in elaborazione.'
            : 'Nessun need aperto: al momento nessun progetto richiede una decisione di Stefano.'}
        </p>
      )}

      {ready && !error && visible.length > 0 && (
        <>
          {view === null ? (
            <div className="space-y-6">
              {needsStefano.length > 0 && (
                <section>
                  <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-wcm-alert-fg">
                    Azione richiesta · {needsStefano.length}
                  </h2>
                  <ul className="space-y-3">{needsStefano.map(renderItem)}</ul>
                </section>
              )}
              {pendingNeeds.length > 0 && (
                <section>
                  <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-wcm-dim">
                    In elaborazione · {pendingNeeds.length}
                  </h2>
                  <ul className="space-y-3">{pendingNeeds.map(renderItem)}</ul>
                </section>
              )}
            </div>
          ) : (
            <ul className="space-y-3">{visible.map(renderItem)}</ul>
          )}
        </>
      )}
    </WcmPageShell>
  );
};

export default WcmNeedsPage;
