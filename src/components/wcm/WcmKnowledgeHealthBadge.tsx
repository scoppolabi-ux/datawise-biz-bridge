import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WcmKnowledgeHealth } from '@/hooks/useWcmKnowledgeHealth';
import {
  HEALTH_LABELS,
  effectiveHealthStatus,
  healthClasses,
  metricOf,
} from './wcmKnowledge';

/**
 * Compact, secondary observability signal. Never a command surface.
 */
const WcmKnowledgeHealthBadge = ({
  health,
  showSynapses = false,
  className,
}: {
  health: WcmKnowledgeHealth | null | undefined;
  showSynapses?: boolean;
  className?: string;
}) => {
  const status = effectiveHealthStatus(health);
  const active = health ? metricOf(health.metrics, 'active_synapses', 'synapses_active') : null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium',
        healthClasses(status),
        className,
      )}
      title={
        health
          ? 'Knowledge Health — stato osservato della memoria di progetto'
          : 'Knowledge Health non ancora attiva per questo progetto'
      }
    >
      <Brain className="h-3 w-3 shrink-0" />
      Knowledge: {HEALTH_LABELS[status]}
      {showSynapses && active !== null && (
        <span className="font-mono opacity-80">· {active} sinapsi</span>
      )}
    </span>
  );
};

export default WcmKnowledgeHealthBadge;
