import { useState } from 'react';
import { ChevronDown, ExternalLink, History, ShieldCheck, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WcmKnowledgeHealth, WcmStewardActivity } from '@/hooks/useWcmKnowledgeHealth';
import { formatDateTime, relativeTime } from './wcmFormat';
import {
  stewardClassificationClasses,
  stewardClassificationLabel,
  stewardCount,
  stewardList,
  stewardSignature,
} from './wcmKnowledge';


const Field = ({ label, value }: { label: string; value: string | number | null }) => (
  <div className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">{label}</p>
    <p className="mt-1 break-words font-mono text-sm text-wcm-strong">
      {value === null || value === '' ? 'UNKNOWN' : value}
    </p>
  </div>
);

const List = ({ label, items }: { label: string; items: string[] }) => {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">
          {label} ({items.length})
        </span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 shrink-0 text-wcm-dim transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <ul className="mt-2 space-y-1">
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className="break-words font-mono text-[11px] text-wcm-text">
              · {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const RunLink = ({ url }: { url: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer noopener"
    className="inline-flex items-center gap-1.5 rounded-md border border-wcm-line-strong bg-wcm-panel/60 px-2.5 py-1 text-[11px] font-medium text-wcm-text hover:border-wcm-accent hover:text-wcm-strong"
  >
    <ExternalLink className="h-3 w-3" />
    Apri run GitHub
  </a>
);

const isRecord = (v: unknown): v is WcmStewardActivity =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v);

const WcmStewardActivitySection = ({ health }: { health: WcmKnowledgeHealth }) => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const latest = isRecord(health.steward_activity) ? health.steward_activity : null;
  const historyRaw = Array.isArray(health.steward_activity_history)
    ? health.steward_activity_history.filter(isRecord)
    : [];
  // Evita di duplicare l'ultimo ciclo già mostrato come "latest".
  const history = historyRaw
    .filter(
      (event) =>
        !latest ||
        !latest.activity_id ||
        String(event.activity_id ?? '') !== String(latest.activity_id),
    )
    .slice(0, 10);
  // Run precedenti con la stessa signature sostanziale del latest: nessuna variazione.
  const latestSignature = latest ? stewardSignature(latest) : null;
  const unchangedCount = latestSignature
    ? history.filter((event) => stewardSignature(event) === latestSignature).length
    : 0;


  if (!latest && history.length === 0) {
    return (
      <section className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-wcm-muted">
          <ShieldCheck className="h-3.5 w-3.5" />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">
            Attività Knowledge Steward
          </h3>
        </div>
        <p className="mt-2 text-sm text-wcm-text">
          Nessuna attività dello Steward proiettata per questo progetto:{' '}
          <span className="font-mono">UNKNOWN</span>. Il dato compare quando il workflow di Knowledge
          Assurance lo pubblica su GitHub.
        </p>
      </section>
    );
  }

  const applied = latest ? stewardCount(latest.repairs_applied) : null;
  const attempted = latest ? stewardCount(latest.repairs_attempted) : null;
  const escalationsList = latest ? stewardList(latest.escalations) : [];
  const escalationsCount = latest ? stewardCount(latest.escalations) : null;
  const filesList = latest ? stewardList(latest.files_changed) : [];
  const filesCount = latest ? stewardCount(latest.files_changed) : null;
  const classification = latest?.classification ?? null;

  return (
    <section className="overflow-hidden rounded-xl border border-wcm-line bg-wcm-surface/60">
      <div className="border-b border-wcm-line px-4 py-3">
        <div className="flex items-center gap-2 text-wcm-muted">
          <ShieldCheck className="h-3.5 w-3.5" />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">
            Attività Knowledge Steward
          </h3>
        </div>
        <p className="mt-1 text-[11px] text-wcm-dim">
          Vista di sola osservazione: mostra cosa ha fatto lo Steward, senza aprire GitHub.
        </p>
      </div>

      {latest && (
        <div className="space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-wcm-strong">
                {formatDateTime(latest.occurred_at ?? null)}
                {relativeTime(latest.occurred_at ?? null) && (
                  <span className="text-wcm-dim"> · {relativeTime(latest.occurred_at ?? null)}</span>
                )}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-wcm-dim">
                {latest.activity_id ?? 'activity_id UNKNOWN'}
                {latest.trigger ? ` · trigger: ${latest.trigger}` : ''}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium',
                  stewardClassificationClasses(classification),
                )}
              >
                {stewardClassificationLabel(classification)}
              </span>
              <span className="font-mono text-[10px] text-wcm-dim">
                {classification ?? 'UNKNOWN'}
              </span>
            </div>
          </div>

          {String(classification ?? '').toUpperCase() === 'ESCALATE_NO_WRITE' && (
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm leading-relaxed text-amber-100">
              Lo Steward ha rilevato un problema che richiede significato/decisione e non ha
              modificato la knowledge.
            </p>
          )}

          {applied !== null && applied > 0 && (
            <p className="flex items-start gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 p-3 text-sm leading-relaxed text-sky-100">
              <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Intervento meccanico applicato ({applied}) e verificato dal post-check. Nessuna
                decisione di significato è stata presa dallo Steward.
              </span>
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Stato PRE → POST"
              value={`${latest.pre_health_status ?? 'UNKNOWN'} → ${latest.post_health_status ?? 'UNKNOWN'}`}
            />
            <Field
              label="Score PRE → POST"
              value={`${latest.pre_score ?? 'UNKNOWN'} → ${latest.post_score ?? 'UNKNOWN'}`}
            />
            <Field label="Repair tentate" value={attempted} />
            <Field label="Repair applicate" value={applied} />
            <Field label="File modificati" value={filesCount} />
            <Field label="Escalation" value={escalationsCount} />
            <Field label="Alert disposition" value={latest.alert_disposition ?? null} />
            <Field label="Engine" value={latest.engine ?? null} />
            <Field label="Authority" value={latest.authority ?? null} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <List label="File modificati" items={filesList} />
            <List label="Escalation" items={escalationsList} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {latest.run_url && <RunLink url={String(latest.run_url)} />}
            {latest.source_sha && (
              <span className="font-mono text-[11px] text-wcm-dim">
                sha: {String(latest.source_sha)}
              </span>
            )}
            {latest.run_id && (
              <span className="font-mono text-[11px] text-wcm-dim">run: {String(latest.run_id)}</span>
            )}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="border-t border-wcm-line">
          <button
            type="button"
            onClick={() => setHistoryOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
          >
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
              <History className="h-3.5 w-3.5" />
              Storico Steward ({history.length})
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-wcm-dim transition-transform',
                historyOpen && 'rotate-180',
              )}
            />
          </button>
          {historyOpen && (
            <div className="space-y-2 px-4 pb-4">
              {history.map((event, index) => {
                const evApplied = stewardCount(event.repairs_applied);
                const evEsc = stewardCount(event.escalations);
                return (
                  <article
                    key={String(event.activity_id ?? index)}
                    className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-wcm-strong">
                        {formatDateTime(event.occurred_at ?? null)}
                      </p>
                      <span
                        className={cn(
                          'rounded-md border px-2 py-0.5 text-[11px] font-medium',
                          stewardClassificationClasses(event.classification),
                        )}
                      >
                        {stewardClassificationLabel(event.classification)}
                      </span>
                    </div>
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-wcm-dim">
                      <span>repair applicate: {evApplied ?? 'UNKNOWN'}</span>
                      <span>escalation: {evEsc ?? 'UNKNOWN'}</span>
                      <span>
                        post: {event.post_health_status ?? 'UNKNOWN'} / {event.post_score ?? 'UNKNOWN'}
                      </span>
                    </p>
                    {event.run_url && (
                      <div className="mt-2">
                        <RunLink url={String(event.run_url)} />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default WcmStewardActivitySection;
