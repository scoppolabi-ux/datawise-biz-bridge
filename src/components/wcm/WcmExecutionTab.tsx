import { Activity, AlertTriangle, Gavel, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WcmExecutionWorkflow } from '@/hooks/useWcmExecutionWorkflows';
import {
  EXECUTION_STATUS_LABELS,
  asStringList,
  executionSignalOf,
  executionToneClasses,
  isOpenExecutionWorkflow,
  normalizeExecutionStatus,
  sortExecutionWorkflows,
} from './wcmExecution';
import { formatDateTime, relativeTime } from './wcmFormat';

const Row = ({ label, value }: { label: string; value: string | null }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
    <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-wcm-dim sm:w-56">
      {label}
    </span>
    <span className="min-w-0 text-sm leading-relaxed text-wcm-text">{value || '—'}</span>
  </div>
);

const WorkflowCard = ({ workflow }: { workflow: WcmExecutionWorkflow }) => {
  const signal = executionSignalOf(workflow);
  const status = normalizeExecutionStatus(workflow.status);
  const authorities = asStringList(workflow.authority_refs);
  const evidence = asStringList(workflow.interruption_evidence);
  const steps = asStringList(workflow.completed_step_ids);
  const open = isOpenExecutionWorkflow(workflow);

  return (
    <article
      className={cn(
        'overflow-hidden rounded-xl border bg-wcm-surface/60',
        open ? 'border-wcm-line-strong' : 'border-wcm-line opacity-90',
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-2 border-b border-wcm-line p-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-wcm-strong">{workflow.workflow}</h3>
          <p className="mt-0.5 truncate font-mono text-[11px] text-wcm-dim">
            {workflow.workflow_instance_id}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          <span className="rounded-md border border-wcm-line-strong bg-wcm-panel/60 px-2 py-0.5 text-[11px] text-wcm-text">
            {EXECUTION_STATUS_LABELS[status] ?? workflow.status}{' '}
            <span className="font-mono text-wcm-dim">{status}</span>
          </span>
          <span
            className={cn(
              'rounded-md border px-2 py-0.5 text-[11px] font-bold tracking-[0.12em]',
              executionToneClasses(signal.tone),
            )}
          >
            {signal.label}
          </span>
        </div>

      </header>

      {open && (
        <p
          className={cn(
            'flex items-start gap-2 border-b px-4 py-2.5 text-xs leading-relaxed',
            signal.tone === 'alert'
              ? 'border-wcm-alert/30 bg-wcm-alert/10 text-wcm-alert-fg'
              : 'border-wcm-line bg-wcm-bg/40 text-wcm-text',
          )}
        >
          {signal.key === 'WAITING_AUTHORITY' ? (
            <Gavel className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          )}
          {signal.explanation}
        </p>
      )}

      <div className="space-y-2 p-4">
        <Row label="Ultimo passaggio completato" value={workflow.last_completed_transition} />
        <Row label="Prossimo passaggio" value={workflow.next_transition} />
        <Row label="Condizione reale di arresto" value={workflow.true_stop_condition} />
        <Row
          label="Ultimo checkpoint"
          value={
            workflow.last_checkpoint_at
              ? `${formatDateTime(workflow.last_checkpoint_at)}${
                  relativeTime(workflow.last_checkpoint_at)
                    ? ` · ${relativeTime(workflow.last_checkpoint_at)}`
                    : ''
                }`
              : null
          }
        />
        <Row
          label="Avviato il"
          value={workflow.started_at ? formatDateTime(workflow.started_at) : null}
        />
        {workflow.scope && <Row label="Ambito" value={workflow.scope} />}
        {authorities.length > 0 && <Row label="Riferimenti di autorità" value={authorities.join(' · ')} />}
        {(workflow.interruption_type || workflow.interruption_reason) && (
          <Row
            label="Interruzione"
            value={[workflow.interruption_type, workflow.interruption_reason]
              .filter(Boolean)
              .join(' — ')}
          />
        )}
        {evidence.length > 0 && <Row label="Evidenze interruzione" value={evidence.join(' · ')} />}
        {steps.length > 0 && (
          <Row label="Passaggi completati" value={`${steps.length} · ${steps.join(', ')}`} />
        )}
        {workflow.source_path && (
          <p className="pt-1 font-mono text-[11px] text-wcm-dim">{workflow.source_path}</p>
        )}
      </div>
    </article>
  );
};

/**
 * Tab Esecuzione (DEC-012): osservazione dei workflow persistenti proiettati.
 * Nessun comando di resume/cancel/complete: la ripresa avviene lato WCM.
 */
const WcmExecutionTab = ({
  workflows,
  isLoading,
  hasError,
}: {
  workflows: WcmExecutionWorkflow[];
  isLoading?: boolean;
  hasError?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-wcm-dim" />
      </div>
    );
  }

  if (hasError) {
    return (
      <p className="rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
        Impossibile caricare i workflow di esecuzione.
      </p>
    );
  }

  const sorted = sortExecutionWorkflows(workflows);
  const open = sorted.filter(isOpenExecutionWorkflow);
  const closed = sorted.filter((w) => !isOpenExecutionWorkflow(w));


  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-4">
        <div className="flex items-center gap-2 text-wcm-strong">
          <Activity className="h-3.5 w-3.5 text-wcm-accent" />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em]">
            Execution Health · workflow persistenti
          </h2>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-wcm-muted">
          Osservazione read-only. GitHub main resta la fonte di verità: Mission Control non riprende,
          annulla né completa un workflow. Execution Health è un piano distinto da Knowledge Health.
        </p>
      </section>

      {sorted.length === 0 ? (
        <p className="rounded-lg border border-wcm-line bg-wcm-surface/50 p-6 text-sm text-wcm-dim">
          Nessun workflow persistente proiettato.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {open.map((workflow) => (
              <WorkflowCard key={workflow.id ?? workflow.workflow_instance_id} workflow={workflow} />
            ))}
            {open.length === 0 && (
              <p className="rounded-lg border border-wcm-line bg-wcm-surface/50 p-4 text-sm text-wcm-dim">
                Nessun workflow attivo: tutti i workflow proiettati sono storici.
              </p>
            )}
          </div>

          {closed.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
                Storico chiuso
              </h2>
              {closed.map((workflow) => (
                <WorkflowCard
                  key={workflow.id ?? workflow.workflow_instance_id}
                  workflow={workflow}
                />
              ))}
            </section>
          )}
        </>
      )}

    </div>
  );
};

export default WcmExecutionTab;
