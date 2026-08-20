import { useState } from 'react';
import { ChevronDown, GraduationCap, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import WcmPageShell from '@/components/wcm/WcmPageShell';
import { HEALTH_LABELS, healthClasses, normalizeHealthStatus } from '@/components/wcm/wcmKnowledge';
import { formatDateTime } from '@/components/wcm/wcmFormat';
import {
  asStringList,
  learningMetric,
  useWcmLearningEvidence,
  useWcmLearningRecords,
  useWcmMethodLearningHealth,
  useWcmMethodRelations,
  type WcmLearningRecord,
} from '@/hooks/useWcmMethodLearning';
import {
  localizeComponentKey,
  localizeEvidenceSummary,
  localizeLearningTitle,
  localizeRelationRationale,
  localizeReviewNote,
  localizeRevisitTrigger,
  localizeScoreMethod,
} from '@/components/wcm/wcmLearningI18n';

const NO_DATA = 'Non disponibile';

const show = (value: number | null) => (value === null ? '—' : String(value));
const text = (value: string | null | undefined) => (value && value.trim() ? value : NO_DATA);

const Section = ({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <section className="mt-6 rounded-xl border border-wcm-line bg-wcm-surface/50 p-4 sm:p-5">
    <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-wcm-text">{title}</h2>
    {hint && <p className="mt-1 text-xs text-wcm-dim">{hint}</p>}
    <div className="mt-3">{children}</div>
  </section>
);

const Kpi = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-wcm-line bg-wcm-bg/40 px-3 py-2">
    <span className="block text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
      {label}
    </span>
    <span className="mt-0.5 block font-mono text-lg text-wcm-strong">{value}</span>
  </div>
);

const learningStatusClasses = (status: string | null) => {
  switch ((status ?? '').toUpperCase()) {
    case 'PROMOTED':
      return 'bg-wcm-accent/15 text-wcm-accent border-wcm-accent/40';
    case 'VALIDATED':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'CANDIDATE':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'OBSERVING':
      return 'bg-sky-500/10 text-sky-300 border-sky-500/30';
    case 'REJECTED':
    case 'SUPERSEDED':
      return 'bg-wcm-dim/15 text-wcm-muted border-wcm-line-strong';
    default:
      return 'bg-wcm-dim/15 text-wcm-muted border-wcm-line-strong';
  }
};

const relationStatusClasses = (status: string | null) => {
  switch ((status ?? '').toUpperCase()) {
    case 'BROKEN':
      return 'bg-wcm-alert/15 text-wcm-alert-fg border-wcm-alert/30';
    case 'AT_RISK':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'OPEN':
      return 'bg-sky-500/10 text-sky-300 border-sky-500/30';
    case 'ACTIVE':
    case 'VERIFIED':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    default:
      return 'bg-wcm-dim/15 text-wcm-muted border-wcm-line-strong';
  }
};

const reviewStatusClasses = (status: string | null) => {
  const s = (status ?? '').toUpperCase();
  if (s === 'PENDING' || s === 'PENDING_REVIEW' || s === 'OPEN') {
    return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  }
  if (s === 'REVIEWED' || s === 'CLOSED' || s === 'ACCEPTED') {
    return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  }
  return 'bg-wcm-dim/15 text-wcm-muted border-wcm-line-strong';
};

const LearningRow = ({
  record,
  relationsFor,
}: {
  record: WcmLearningRecord;
  relationsFor: (learningId: string) => { relation_id: string; relation_type: string | null; target_node: string | null; status: string | null }[];
}) => {
  const [open, setOpen] = useState(false);
  const origins = asStringList(record.origin_refs);
  const promoted = asStringList(record.promoted_to);
  const relations = relationsFor(record.learning_id);

  return (
    <li className="rounded-lg border border-wcm-line bg-wcm-bg/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 p-3 text-left"
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-wcm-dim">
              {record.learning_id}
            </span>
            <span
              className={cn(
                'rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                learningStatusClasses(record.status),
              )}
            >
              {record.status ?? 'UNKNOWN'}
            </span>
          </span>
          <span className="mt-1 block text-sm font-medium text-wcm-strong">
            {localizeLearningTitle(record.learning_id, record.title)}
          </span>
          <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-wcm-dim">
            <span>Confidenza: {text(record.confidence)}</span>
            <span>Generalizzabilità: {text(record.generalizability)}</span>
            <span>Origini: {origins.length}</span>
            <span>Promosso in: {promoted.length}</span>
          </span>
        </span>
        <ChevronDown
          className={cn('mt-1 h-4 w-4 shrink-0 text-wcm-dim transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-wcm-line px-3 py-3 text-xs text-wcm-muted">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
              Riferimenti di origine
            </p>
            {origins.length ? (
              <ul className="mt-1 space-y-0.5 font-mono text-[11px] text-wcm-text">
                {origins.map((o) => (
                  <li key={o} className="break-all">
                    {o}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1">{NO_DATA}</p>
            )}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
              Promosso in
            </p>
            {promoted.length ? (
              <ul className="mt-1 space-y-0.5 font-mono text-[11px] text-wcm-text">
                {promoted.map((p) => (
                  <li key={p} className="break-all">
                    {p}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1">{NO_DATA}</p>
            )}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
              Sinapsi del metodo collegate
            </p>
            {relations.length ? (
              <ul className="mt-1 space-y-0.5 text-[11px] text-wcm-text">
                {relations.map((r) => (
                  <li key={r.relation_id} className="break-all font-mono">
                    {r.relation_type ?? '—'} → {r.target_node ?? '—'}{' '}
                    <span className="text-wcm-dim">({r.status ?? 'UNKNOWN'})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1">{NO_DATA}</p>
            )}
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            <p>Percorso record: <span className="font-mono">{text(record.record_path)}</span></p>
            <p>Condizione di riesame: {text(localizeRevisitTrigger(record.revisit_trigger))}</p>
            <p>Creato: {record.origin_created_at ? formatDateTime(record.origin_created_at) : NO_DATA}</p>
            <p>Ultima revisione: {record.last_reviewed_at ? formatDateTime(record.last_reviewed_at) : NO_DATA}</p>
          </div>
        </div>
      )}
    </li>
  );
};

const WcmLearningPage = () => {
  const { data: health, isLoading: healthLoading } = useWcmMethodLearningHealth();
  const { data: records, isLoading: recordsLoading } = useWcmLearningRecords();
  const { data: evidence } = useWcmLearningEvidence();
  const { data: relations } = useWcmMethodRelations();

  const status = normalizeHealthStatus(health?.health_status);
  const metrics = health?.metrics;
  const components = (health?.components ?? {}) as Record<string, unknown>;

  const countByStatus = (value: string) =>
    records ? records.filter((r) => (r.status ?? '').toUpperCase() === value).length : null;

  const kpis: { label: string; value: string }[] = [
    { label: 'Promossi', value: show(learningMetric(metrics, 'promoted_learning') ?? countByStatus('PROMOTED')) },
    { label: 'Candidati', value: show(learningMetric(metrics, 'candidate_learning') ?? countByStatus('CANDIDATE')) },
    { label: 'In osservazione', value: show(learningMetric(metrics, 'observing_learning') ?? countByStatus('OBSERVING')) },
    { label: 'Validati', value: show(learningMetric(metrics, 'validated_learning') ?? countByStatus('VALIDATED')) },
    { label: 'Evidence pending', value: show(learningMetric(metrics, 'pending_evidence')) },
    { label: 'Sinapsi rotte', value: show(learningMetric(metrics, 'broken_method_synapses')) },
    { label: 'Sinapsi a rischio', value: show(learningMetric(metrics, 'at_risk_method_synapses')) },
    { label: 'Orphan', value: show(learningMetric(metrics, 'orphan_learning')) },
  ];

  const relationsFor = (learningId: string) =>
    (relations ?? []).filter((r) => r.source_node === learningId);

  const issues = Array.isArray(health?.issues) ? (health?.issues as unknown[]) : [];

  return (
    <WcmPageShell title="WCM Learning">
      <header className="rounded-xl border border-dashed border-wcm-accent/40 bg-wcm-panel/40 p-4 sm:p-5">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-wcm-accent">
          <GraduationCap className="h-3.5 w-3.5" />
          Piano globale del metodo
        </span>
        <h1 className="mt-1 text-lg font-semibold tracking-tight text-wcm-strong">WCM Learning</h1>
        <p className="mt-1 text-sm text-wcm-muted">
          Cosa il WCM sta imparando dall’esperienza. Memoria di metodo, non stato di un singolo
          progetto.
        </p>
      </header>

      {(healthLoading || recordsLoading) && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-wcm-dim" />
        </div>
      )}

      <Section
        title="Method Knowledge Health"
        hint="Stato osservato della memoria di metodo, proiettato da GitHub."
      >
        {!health ? (
          <p className="text-sm text-wcm-muted">
            Nessuna proiezione disponibile: stato {NO_DATA.toLowerCase()}.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  'rounded-md border px-2 py-0.5 text-xs font-medium',
                  healthClasses(status),
                )}
              >
                {HEALTH_LABELS[status]}
              </span>
              <span className="font-mono text-2xl text-wcm-strong">
                {health.method_integrity_score ?? '—'}
              </span>
              <span className="text-[11px] text-wcm-dim">
                {text(localizeScoreMethod(health.score_method))}
              </span>
            </div>
            <div className="grid gap-1 text-xs text-wcm-muted sm:grid-cols-2">
              <p>Ultimo check: {health.checked_at ? formatDateTime(health.checked_at) : NO_DATA}</p>
              <p>
                Ultimo delta materiale di metodo:{' '}
                {health.last_material_method_delta_at
                  ? formatDateTime(health.last_material_method_delta_at)
                  : NO_DATA}
              </p>
              <p className="break-all font-mono">
                SHA delta: {text(health.last_material_method_delta_sha)}
              </p>
              <p className="break-all font-mono">Sorgente: {text(health.source_path)}</p>
            </div>
            {Object.keys(components).length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
                  Componenti dello score
                </p>
                <ul className="mt-1 grid gap-1 sm:grid-cols-2">
                  {Object.entries(components).map(([key, value]) => (
                    <li
                      key={key}
                      className="flex items-baseline justify-between gap-2 rounded border border-wcm-line bg-wcm-bg/40 px-2 py-1 text-xs"
                    >
                      <span className="text-wcm-dim">{localizeComponentKey(key)}</span>
                      <span className="font-mono text-wcm-text">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {issues.length > 0 && (
              <ul className="space-y-1 text-xs text-wcm-alert-fg">
                {issues.map((issue, i) => (
                  <li key={i}>
                    {typeof issue === 'string' ? issue : JSON.stringify(issue)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Section>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <Kpi key={kpi.label} label={kpi.label} value={kpi.value} />
        ))}
      </section>

      <Section
        title="Learning recenti"
        hint="Lo stato registrato è preservato: un learning PROMOTED non equivale a verità empirica validata."
      >
        {!records || records.length === 0 ? (
          <p className="text-sm text-wcm-muted">Nessun learning record proiettato.</p>
        ) : (
          <ul className="space-y-2">
            {records.map((record) => (
              <LearningRow key={record.id} record={record} relationsFor={relationsFor} />
            ))}
          </ul>
        )}
      </Section>

      <Section title="Evidence / Review" hint="Storico completo degli eventi, inclusi quelli già revisionati.">
        {!evidence || evidence.length === 0 ? (
          <p className="text-sm text-wcm-muted">Nessuna evidence proiettata.</p>
        ) : (
          <ul className="space-y-2">
            {evidence.map((event) => {
              const linked = asStringList(event.linked_learning_ids);
              return (
                <li key={event.id} className="rounded-lg border border-wcm-line bg-wcm-bg/40 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-wcm-dim">
                      {event.event_id} · {text(event.source_type)}
                    </span>
                    <span
                      className={cn(
                        'rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                        reviewStatusClasses(event.review_status),
                      )}
                    >
                      {event.review_status ?? 'UNKNOWN'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-wcm-text">{text(localizeEvidenceSummary(event.summary))}</p>
                  <p className="mt-1 text-[11px] text-wcm-dim">
                    Rilevato: {event.detected_at ? formatDateTime(event.detected_at) : NO_DATA} ·
                    Revisionato:{' '}
                    {event.reviewed_at ? formatDateTime(event.reviewed_at) : NO_DATA}
                  </p>
                  {event.review_note && (
                    <p className="mt-1 text-xs text-wcm-muted">
                      {localizeReviewNote(event.review_note, event.summary)}
                    </p>
                  )}
                  {linked.length > 0 && (
                    <p className="mt-1 break-all font-mono text-[11px] text-wcm-accent">
                      {linked.join(' · ')}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Sinapsi del metodo" hint="Relazioni tra learning, decisioni e artefatti di metodo.">
        {!relations || relations.length === 0 ? (
          <p className="text-sm text-wcm-muted">Nessuna relazione proiettata.</p>
        ) : (
          <ul className="space-y-2">
            {relations.map((relation) => (
              <li
                key={relation.id}
                className="rounded-lg border border-wcm-line bg-wcm-bg/40 p-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="break-all font-mono text-[11px] text-wcm-text">
                    {relation.source_node ?? '—'}{' '}
                    <span className="text-wcm-accent">{relation.relation_type ?? '—'}</span>{' '}
                    {relation.target_node ?? '—'}
                  </span>
                  <span
                    className={cn(
                      'rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                      relationStatusClasses(relation.status),
                    )}
                  >
                    {relation.status ?? 'UNKNOWN'}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-wcm-dim">{relation.relation_id}</p>
                {relation.rationale && (
                  <p className="mt-1 text-wcm-muted">
                    {localizeRelationRationale(relation.relation_id, relation.rationale)}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-wcm-dim">
                  Ultima verifica:{' '}
                  {relation.last_verified_at ? formatDateTime(relation.last_verified_at) : NO_DATA}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <section className="mt-6 rounded-xl border border-wcm-line-strong bg-wcm-panel/40 p-4 text-xs leading-relaxed text-wcm-muted sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-wcm-text">
          <Info className="h-4 w-4 text-wcm-dim" />
          Governance
        </h2>
        <p className="mt-2">
          Mission Control <strong className="text-wcm-text">osserva</strong> il learning del metodo:
          non promuove, non valida e non modifica nulla. Un cambiamento materiale del metodo WCM
          richiede sempre il WCM Change Gate e l’autorità di Stefano. La fonte di verità resta
          GitHub main.
        </p>
      </section>
    </WcmPageShell>
  );
};

export default WcmLearningPage;
