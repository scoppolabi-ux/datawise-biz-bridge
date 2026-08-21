import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WcmExecutionWorkflow } from '@/hooks/useWcmExecutionWorkflows';
import { executionToneClasses, portfolioExecutionSignal } from './wcmExecution';

/**
 * Segnale compatto di Execution Health (DEC-012) per card portfolio e Overview.
 * Non è un Need Stefano: è solo osservazione dello stato dei workflow.
 */
const WcmExecutionSignal = ({
  workflows,
  projectId,
  asLink = false,
}: {
  workflows: WcmExecutionWorkflow[] | undefined;
  projectId: string;
  asLink?: boolean;
}) => {
  const signal = portfolioExecutionSignal(workflows);
  if (!signal) return null;

  const content = (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold',
        executionToneClasses(signal.tone),
      )}
    >
      <Activity className="h-3 w-3 shrink-0" />
      <span className="tracking-[0.1em]">{signal.label}</span>
      <span className="min-w-0 truncate font-normal opacity-80">· {signal.workflow}</span>
      {signal.openCount > 1 && (
        <span className="shrink-0 font-normal opacity-80">+{signal.openCount - 1}</span>
      )}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link to={`/wcm/${projectId}?tab=execution`} className="inline-flex max-w-full">
      {content}
    </Link>
  );
};

export default WcmExecutionSignal;
