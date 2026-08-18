import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UNAPPROVED_LABEL, isUnapprovedDistribution } from './wcmFormat';

type Props = {
  doc: { distribution_ready: boolean; status: string | null; category: string | null };
  className?: string;
};

/**
 * Shown when a document is distributable but NOT approved.
 * Distribution never implies approval, freeze or authority.
 */
const WcmUnapprovedBadge = ({ doc, className }: Props) => {
  if (!isUnapprovedDistribution(doc)) return null;
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded border border-wcm-alert/40 bg-wcm-alert/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-wcm-alert-fg',
        className,
      )}
      title="Documento condivisibile ma non approvato"
    >
      <AlertTriangle className="h-3 w-3" />
      {UNAPPROVED_LABEL}
    </span>
  );
};

export default WcmUnapprovedBadge;
