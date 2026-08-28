import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import WcmPageShell from '@/components/wcm/WcmPageShell';
import {
  closedIssues,
  issueDateLabel,
  issueStatusLabel,
  openIssues,
} from '@/components/wcm/wcmTechnicalIssues';
import { useWcmTechnicalIssues, type WcmTechnicalIssue } from '@/hooks/useWcmTechnicalIssues';
import { useWcmProjects } from '@/hooks/useWcmProjects';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="min-w-0">
    <span className="block text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
      {label}
    </span>
    <span className="mt-0.5 block break-words text-xs text-wcm-text">{children}</span>
  </div>
);

const IssueCard = ({
  issue,
  projectName,
}: {
  issue: WcmTechnicalIssue;
  projectName: string;
}) => {
  const open = issue.status === 'OPEN';
  return (
    <li
      className={`rounded-lg border p-3 sm:p-4 ${
        open
          ? 'border-wcm-alert/30 bg-wcm-alert/5'
          : 'border-wcm-line bg-wcm-surface/50'
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-sm font-semibold text-wcm-strong">{projectName}</span>
        <span className="flex flex-wrap items-center gap-2">
          {issue.blocking && (
            <span className="rounded border border-wcm-alert/40 bg-wcm-alert/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-wcm-alert-fg">
              Bloccante
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-wcm-dim">
            {issueStatusLabel(issue.status)}
          </span>
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-wcm-text">{issue.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-wcm-muted">{issue.detail}</p>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="ID problema">
          <span className="font-mono text-[11px]">{issue.issue_id}</span>
        </Field>
        <Field label="Codice errore">
          <span className="font-mono text-[11px]">{issue.error_code}</span>
        </Field>
        <Field label="Rilevato il">{issueDateLabel(issue.detected_at)}</Field>
        <Field label="Rilevato da">
          <span className="font-mono text-[11px]">{issue.detected_by}</span>
        </Field>
        {!open && <Field label="Chiuso il">{issueDateLabel(issue.closed_at)}</Field>}
        {!open && (
          <Field label="Chiuso da">
            <span className="font-mono text-[11px]">{issue.closed_by ?? '—'}</span>
          </Field>
        )}
      </div>

      {!open && issue.resolution_note && (
        <p className="mt-3 rounded border border-wcm-line bg-wcm-bg/40 p-2 text-xs leading-relaxed text-wcm-muted">
          <span className="font-semibold text-wcm-text">Nota di risoluzione: </span>
          {issue.resolution_note}
        </p>
      )}
    </li>
  );
};

/** Read-only technical issue ledger. No close/edit actions by design. */
const WcmIssuesPage = () => {
  const { data, isLoading, error } = useWcmTechnicalIssues();
  const { data: projects } = useWcmProjects(true);
  const issues = data ?? [];
  const nameById = new Map((projects ?? []).map((p) => [p.project_id, p.project_name]));
  const projectName = (id: string) => nameById.get(id) ?? id;

  const open = openIssues(issues);
  const closed = closedIssues(issues);

  return (
    <WcmPageShell title="Problemi tecnici" count={open.length}>
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
          Impossibile caricare i problemi tecnici.
        </p>
      )}

      {!isLoading && !error && (
        <div className="space-y-8">
          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-wcm-strong">
              <AlertTriangle className="h-4 w-4 text-wcm-alert-fg" />
              Aperti
              <span className="font-mono text-xs text-wcm-dim">{open.length}</span>
            </h2>
            {open.length === 0 ? (
              <p className="mt-3 rounded-lg border border-wcm-line bg-wcm-surface/50 p-4 text-sm text-wcm-muted">
                Nessun problema tecnico aperto.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {open.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    projectName={projectName(issue.project_id)}
                  />
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-wcm-strong">
              <CheckCircle2 className="h-4 w-4 text-wcm-accent" />
              Storico
              <span className="font-mono text-xs text-wcm-dim">{closed.length}</span>
            </h2>
            {closed.length === 0 ? (
              <p className="mt-3 rounded-lg border border-wcm-line bg-wcm-surface/50 p-4 text-sm text-wcm-muted">
                Nessun problema tecnico chiuso.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {closed.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    projectName={projectName(issue.project_id)}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </WcmPageShell>
  );
};

export default WcmIssuesPage;
