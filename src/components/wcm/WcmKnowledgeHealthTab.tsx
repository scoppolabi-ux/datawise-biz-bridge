import { useState } from 'react';
import {
  AlertTriangle,
  Brain,
  ChevronDown,
  Clock,
  History,
  Info,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  WcmKnowledgeCheckpoint,
  WcmKnowledgeHealth,
} from '@/hooks/useWcmKnowledgeHealth';
import { formatDateTime, relativeTime } from './wcmFormat';
import { knowledgeGrowth } from './wcmHealthPlanes';
import WcmStewardActivitySection from './WcmStewardActivity';
import {
  COMPONENT_LABELS,
  GLOSSARY,
  HEALTH_LABELS,
  KNOWLEDGE_ISSUE_NOTE,
  SYNAPSE_METRICS,
  componentScoreOf,
  effectiveHealthStatus,
  healthClasses,
  isCheckOutdated,
  issueHumanSummaryOf,
  issueRawDetailOf,
  issueTitleOf,
  issuesOf,
  knowledgeSummaryParts,
  metricOf,
  normalizeHealthStatus,
  severityClasses,
  splitIssues,
  type KnowledgeIssue,
} from './wcmKnowledge';



const Metric = ({ label, value }: { label: string; value: string | number | null }) => (
  <div className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">{label}</p>
    <p className="mt-1 font-mono text-lg text-wcm-strong">{value ?? '—'}</p>
  </div>
);

const TimeField = ({ label, value }: { label: string; value: string | null }) => (
  <div className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-3">
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">
      <Clock className="h-3.5 w-3.5" />
      {label}
    </div>
    <p className="mt-1.5 text-sm text-wcm-text">
      {formatDateTime(value)}
      {relativeTime(value) && <span className="text-wcm-dim"> · {relativeTime(value)}</span>}
    </p>
  </div>
);

const ComponentCard = ({
  label,
  score,
  status,
  reason,
}: {
  label: string;
  score: number | null;
  status: string | null;
  reason: string | null;
}) => (
  <div className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">{label}</p>
    <p className="mt-1 font-mono text-lg text-wcm-strong">
      {score ?? '—'}
      {score !== null && <span className="text-xs text-wcm-dim">/100</span>}
    </p>
    {status && (
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-wcm-dim">{status}</p>
    )}
    {reason && <p className="mt-1 text-[11px] leading-relaxed text-wcm-muted">{reason}</p>}
  </div>
);

const IssueCard = ({ issue }: { issue: KnowledgeIssue }) => {
  const [rawOpen, setRawOpen] = useState(false);
  const human = issueHumanSummaryOf(issue);
  const raw = issueRawDetailOf(issue);
  return (
    <article className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-wcm-strong">{issueTitleOf(issue)}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          {issue.severity && (
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 text-[11px] font-medium',
                severityClasses(issue.severity),
              )}
            >
              {String(issue.severity).toUpperCase()}
            </span>
          )}
          {issue.status && (
            <span className="rounded-md border border-wcm-line-strong bg-wcm-panel/60 px-2 py-0.5 font-mono text-[11px] text-wcm-text">
              {String(issue.status).toUpperCase()}
            </span>
          )}
        </div>
      </div>
      {issue.id && (
        <p className="mt-0.5 font-mono text-[10px] text-wcm-dim">{String(issue.id)}</p>
      )}
      {human ? (
        <>
          <p className="mt-1.5 text-sm leading-relaxed text-wcm-text">{human}</p>
          {raw && (
            <>
              <button
                type="button"
                onClick={() => setRawOpen((v) => !v)}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-wcm-dim hover:text-wcm-text"
              >
                <ChevronDown
                  className={cn('h-3 w-3 transition-transform', rawOpen && 'rotate-180')}
                />
                Dettaglio tecnico
              </button>
              {rawOpen && (
                <p className="mt-1 break-words font-mono text-[11px] leading-relaxed text-wcm-muted">
                  {raw}
                </p>
              )}
            </>
          )}
        </>
      ) : (
        raw && <p className="mt-1.5 text-sm leading-relaxed text-wcm-text">{raw}</p>
      )}
      {(issue.node || issue.since) && (
        <p className="mt-1.5 font-mono text-[11px] text-wcm-dim">
          {issue.node ? `nodo: ${issue.node}` : ''}
          {issue.node && issue.since ? ' · ' : ''}
          {issue.since ? `dal ${formatDateTime(String(issue.since))}` : ''}
        </p>
      )}
    </article>
  );
};


const WcmKnowledgeHealthTab = ({
  health,
  checkpoints,
  isLoading,
  hasError,
}: {
  health: WcmKnowledgeHealth | null | undefined;
  checkpoints: WcmKnowledgeCheckpoint[];
  isLoading: boolean;
  hasError: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
      </div>
    );
  }

  if (hasError) {
    return (
      <p className="rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
        Impossibile caricare la Knowledge Health di questo progetto.
      </p>
    );
  }

  if (!health) {
    return (
      <section className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-6">
        <div className="flex items-center gap-2 text-wcm-muted">
          <Brain className="h-4 w-4" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
            Knowledge Health non attiva
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-wcm-text">
          Questo progetto non espone ancora telemetria di Knowledge Health. Lo stato è{' '}
          <span className="font-mono">UNKNOWN</span>: non significa knowledge degradata, significa
          che il layer di assurance non è stato adottato dal progetto.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-wcm-dim">
          I dati arrivano da GitHub tramite il Projector (
          <span className="font-mono">kb/knowledge-health/KNOWLEDGE_HEALTH.json</span>).
        </p>
      </section>
    );
  }

  const status = effectiveHealthStatus(health);
  const stored = normalizeHealthStatus(health.health_status);
  const outdated = isCheckOutdated(health);
  const issues = issuesOf(health);
  const componentsSource = health.components;

  return (
    <div className="space-y-4">
      {/* Sintesi */}
      <section className="rounded-xl border border-wcm-line bg-wcm-panel/40 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-wcm-strong">
            <Brain className="h-4 w-4 text-wcm-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Integrità della knowledge
            </h2>
          </div>
          <span
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs font-medium',
              healthClasses(status),
            )}
          >
            {HEALTH_LABELS[status]}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">
              Knowledge Integrity Score
            </p>
            <p className="font-mono text-3xl text-wcm-strong">
              {health.knowledge_integrity_score ?? '—'}
              {health.knowledge_integrity_score !== null && (
                <span className="text-base text-wcm-dim">/100</span>
              )}
            </p>
          </div>
          {health.score_method && (
            <p className="text-xs text-wcm-muted">
              Metodo: <span className="font-mono text-wcm-text">{health.score_method}</span>
            </p>
          )}
        </div>

        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-wcm-dim">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {GLOSSARY.score} {GLOSSARY.notAQualityScore}
          </span>
        </p>
      </section>

      {/* Attività Knowledge Steward (V0.7, observation-only) */}
      <WcmStewardActivitySection health={health} />

      {/* Invariante di salute */}
      {outdated && (
        <section className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <h2 className="text-sm font-bold uppercase tracking-[0.16em]">
              Stale · verifica richiesta
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-amber-100">
            L'ultimo delta materiale ({formatDateTime(health.last_material_delta_at)}) è più recente
            dell'ultimo Knowledge Integrity Check ({formatDateTime(health.checked_at)}). La knowledge
            non può essere presentata come in salute finché non viene rieseguito il controllo di
            integrità.
          </p>
          {stored !== status && (
            <p className="mt-2 text-xs text-amber-200/80">
              Stato dichiarato dalla sorgente: <span className="font-mono">{stored}</span> —
              presentato come <span className="font-mono">STALE</span> per invariante di salute. Il
              dato di origine su GitHub non viene alterato.
            </p>
          )}
        </section>
      )}

      {/* Componenti dello score */}
      <section className="overflow-hidden rounded-xl border border-wcm-line bg-wcm-surface/60">
        <h3 className="border-b border-wcm-line px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
          Composizione dello score
        </h3>
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPONENT_LABELS.map(({ keys, label }) => {
            const value = metricOf(componentsSource, ...keys);
            if (value === null) return null;
            return <Metric key={label} label={label} value={value} />;
          })}
          {COMPONENT_LABELS.every(({ keys }) => metricOf(componentsSource, ...keys) === null) && (
            <p className="text-sm text-wcm-dim">
              Nessun dettaglio di composizione fornito dalla telemetria.
            </p>
          )}
        </div>
      </section>

      {/* Sinapsi e drift */}
      <section className="overflow-hidden rounded-xl border border-wcm-line bg-wcm-surface/60">
        <div className="border-b border-wcm-line px-4 py-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
            Sinapsi e drift
          </h3>
          <p className="mt-1 text-[11px] text-wcm-dim">{GLOSSARY.synapse}</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {SYNAPSE_METRICS.map(({ keys, label }) => (
            <Metric key={label} label={label} value={metricOf(health.metrics, ...keys)} />
          ))}
        </div>
      </section>

      {/* Crescita dal checkpoint */}
      {(() => {
        const latest = checkpoints[0];
        if (!latest) return null;
        const rows = knowledgeGrowth(health, latest.metrics).filter((r) => r.delta !== null);
        if (rows.length === 0) return null;
        return (
          <section className="overflow-hidden rounded-xl border border-wcm-line bg-wcm-surface/60">
            <div className="border-b border-wcm-line px-4 py-3">
              <div className="flex items-center gap-2 text-wcm-muted">
                <TrendingUp className="h-3.5 w-3.5" />
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Crescita dal checkpoint
                </h3>
              </div>
              <p className="mt-1 text-[11px] text-wcm-dim">
                Confronto con «{latest.label}» ({formatDateTime(latest.occurred_at)}).{' '}
                {GLOSSARY.notAQualityScore}
              </p>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((row) => {
                const worse = row.lowerIsBetter ? row.delta! > 0 : row.delta! < 0;
                const better = row.delta !== 0 && !worse;
                return (
                  <div
                    key={row.label}
                    className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-wcm-dim">
                      {row.label}
                    </p>
                    <p className="mt-1 font-mono text-lg text-wcm-strong">
                      {row.current ?? '—'}
                      <span
                        className={cn(
                          'ml-2 text-xs',
                          row.delta === 0
                            ? 'text-wcm-dim'
                            : worse
                              ? 'text-wcm-alert-fg'
                              : better
                                ? 'text-emerald-300'
                                : 'text-wcm-dim',
                        )}
                      >
                        {row.delta! > 0 ? `+${row.delta}` : row.delta}
                      </span>
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-wcm-dim">
                      checkpoint: {row.checkpoint}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}


      {/* Freschezza */}
      <div className="grid gap-3 sm:grid-cols-3">
        <TimeField label="Ultimo integrity check" value={health.checked_at} />
        <TimeField label="Ultima riconciliazione" value={health.last_reconciliation_at} />
        <TimeField label="Ultimo delta materiale" value={health.last_material_delta_at} />
      </div>

      {/* Issues / drift aperti */}
      <section className="overflow-hidden rounded-xl border border-wcm-line bg-wcm-surface/60">
        <h3 className="border-b border-wcm-line px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
          Problemi e drift aperti
        </h3>
        <div className="space-y-3 p-4">
          {issues.length === 0 ? (
            <p className="text-sm text-wcm-dim">
              Nessun problema segnalato dalla telemetria di knowledge.
            </p>
          ) : (
            issues.map((issue, index) => (
              <article
                key={String(issue.id ?? index)}
                className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-wcm-strong">
                    {issue.title ?? issue.label ?? issue.id ?? 'Problema senza titolo'}
                  </p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {issue.severity && (
                      <span
                        className={cn(
                          'rounded-md border px-2 py-0.5 text-[11px] font-medium',
                          severityClasses(issue.severity),
                        )}
                      >
                        {String(issue.severity).toUpperCase()}
                      </span>
                    )}
                    {issue.status && (
                      <span className="rounded-md border border-wcm-line-strong bg-wcm-panel/60 px-2 py-0.5 font-mono text-[11px] text-wcm-text">
                        {String(issue.status).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                {(issue.detail ?? issue.description) && (
                  <p className="mt-1.5 text-sm leading-relaxed text-wcm-text">
                    {issue.detail ?? issue.description}
                  </p>
                )}
                {(issue.node || issue.since) && (
                  <p className="mt-1.5 font-mono text-[11px] text-wcm-dim">
                    {issue.node ? `nodo: ${issue.node}` : ''}
                    {issue.node && issue.since ? ' · ' : ''}
                    {issue.since ? `dal ${formatDateTime(String(issue.since))}` : ''}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </section>

      {/* Storico checkpoint */}
      <section className="overflow-hidden rounded-xl border border-wcm-line bg-wcm-surface/60">
        <div className="border-b border-wcm-line px-4 py-3">
          <div className="flex items-center gap-2 text-wcm-muted">
            <History className="h-3.5 w-3.5" />
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              Storico checkpoint
            </h3>
          </div>
          <p className="mt-1 text-[11px] text-wcm-dim">{GLOSSARY.checkpoint}</p>
        </div>
        <div className="space-y-3 p-4">
          {checkpoints.length === 0 ? (
            <p className="text-sm text-wcm-dim">Nessun checkpoint registrato.</p>
          ) : (
            checkpoints.map((cp) => {
              const cpStatus = normalizeHealthStatus(cp.health_status);
              return (
                <article
                  key={cp.id}
                  className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-wcm-strong">{cp.label}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-wcm-dim">
                        {cp.checkpoint_id} · {formatDateTime(cp.occurred_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {cp.knowledge_integrity_score !== null && (
                        <span className="rounded-md border border-wcm-line-strong bg-wcm-panel/60 px-2 py-0.5 font-mono text-[11px] text-wcm-text">
                          score {cp.knowledge_integrity_score}
                        </span>
                      )}
                      {cp.health_status && (
                        <span
                          className={cn(
                            'rounded-md border px-2 py-0.5 text-[11px] font-medium',
                            healthClasses(cpStatus),
                          )}
                        >
                          {HEALTH_LABELS[cpStatus]}
                        </span>
                      )}
                    </div>
                  </div>
                  {cp.note && (
                    <p className="mt-1.5 text-sm leading-relaxed text-wcm-text">{cp.note}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {SYNAPSE_METRICS.map(({ keys, label }) => {
                      const value = metricOf(cp.metrics, ...keys);
                      if (value === null) return null;
                      return (
                        <span key={label} className="text-[11px] text-wcm-muted">
                          {label}: <span className="font-mono text-wcm-text">{value}</span>
                        </span>
                      );
                    })}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <p className="text-[11px] leading-relaxed text-wcm-dim">
        Knowledge Health è una vista di sola osservazione: nessuna azione qui modifica la knowledge,
        i drift o GitHub, che resta la fonte di verità.
      </p>
    </div>
  );
};

export default WcmKnowledgeHealthTab;
