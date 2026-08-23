import { cn } from '@/lib/utils';
import type { WcmKnowledgeHealth } from '@/hooks/useWcmKnowledgeHealth';
import {
  effectiveHealthStatus,
  knowledgeScoreOf,
  knowledgeTrafficLight,
  metricOf,
} from './wcmKnowledge';

/**
 * Semaforo Knowledge Health: sola visualizzazione.
 * Colore derivato ESCLUSIVAMENTE dallo status strutturato; accessibile via
 * label testuale sempre presente (mai solo colore).
 */
const WcmKnowledgeTrafficLight = ({
  health,
  showSynapses = false,
  className,
}: {
  health: WcmKnowledgeHealth | null | undefined;
  showSynapses?: boolean;
  className?: string;
}) => {
  const status = effectiveHealthStatus(health);
  const light = knowledgeTrafficLight(status);
  const score = knowledgeScoreOf(health);
  const active = health ? metricOf(health.metrics, 'active_synapses', 'synapses_active') : null;

  return (
    <div
      role="status"
      aria-label={`Knowledge Health: ${light.label}${score !== null ? ` — ${score}/100` : ''}`}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2',
        light.wrapClass,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('h-3 w-3 shrink-0 rounded-full ring-2 ring-current/30', light.dotClass)}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-wider opacity-70">
          Knowledge Health
        </span>
        <span className="block truncate text-xs font-semibold">{light.label}</span>
      </span>
      <span className="shrink-0 text-right">
        {score !== null && <span className="block font-mono text-sm font-bold">{score}/100</span>}
        {showSynapses && active !== null && (
          <span className="block font-mono text-[10px] opacity-80">{active} sinapsi</span>
        )}
      </span>
    </div>
  );
};

export default WcmKnowledgeTrafficLight;
