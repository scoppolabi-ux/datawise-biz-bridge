import { Link } from 'react-router-dom';
import { ChevronRight, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HEALTH_LABELS, healthClasses, normalizeHealthStatus } from './wcmKnowledge';
import {
  learningMetric,
  useWcmLearningRecords,
  useWcmMethodLearningHealth,
} from '@/hooks/useWcmMethodLearning';

const Stat = ({ label, value }: { label: string; value: number | string }) => (
  <span className="min-w-0">
    <span className="block text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
      {label}
    </span>
    <span className="block font-mono text-sm text-wcm-strong">{value}</span>
  </span>
);

/**
 * GLOBAL method plane entry point on Mission Control.
 * Visually distinct from project cards: it is the WCM method, not a project.
 */
const WcmLearningCard = () => {
  const { data: health, isLoading } = useWcmMethodLearningHealth();
  const { data: records } = useWcmLearningRecords();

  const status = normalizeHealthStatus(health?.health_status);
  const metrics = health?.metrics;

  const count = (statusValue: string) =>
    records ? records.filter((r) => (r.status ?? '').toUpperCase() === statusValue).length : null;

  const promoted = learningMetric(metrics, 'promoted_learning') ?? count('PROMOTED');
  const candidate = learningMetric(metrics, 'candidate_learning') ?? count('CANDIDATE');
  const observing = learningMetric(metrics, 'observing_learning') ?? count('OBSERVING');
  const pendingEvidence = learningMetric(metrics, 'pending_evidence');

  const show = (value: number | null) => (value === null ? '—' : value);

  return (
    <Link
      to="/wcm/learning"
      className="group block rounded-xl border border-dashed border-wcm-accent/40 bg-wcm-panel/40 p-4 transition-colors hover:border-wcm-accent hover:bg-wcm-surface/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-wcm-accent sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-wcm-accent">
            <GraduationCap className="h-3.5 w-3.5" />
            Piano globale del metodo
          </span>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-wcm-strong">
            WCM Learning
          </h2>
          <p className="mt-0.5 text-xs text-wcm-dim">
            Cosa il WCM sta imparando dall’esperienza
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              'rounded-md border px-2 py-0.5 text-[11px] font-medium',
              healthClasses(status),
            )}
          >
            {isLoading ? '…' : HEALTH_LABELS[status]}
            {health?.method_integrity_score != null && (
              <span className="ml-1 font-mono">{health.method_integrity_score}</span>
            )}
          </span>
          <ChevronRight className="h-4 w-4 text-wcm-dim transition-colors group-hover:text-wcm-accent" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Promossi" value={show(promoted)} />
        <Stat label="Candidati" value={show(candidate)} />
        <Stat label="In osservazione" value={show(observing)} />
        <Stat label="Evidence pending" value={show(pendingEvidence)} />
      </div>
    </Link>
  );
};

export default WcmLearningCard;
