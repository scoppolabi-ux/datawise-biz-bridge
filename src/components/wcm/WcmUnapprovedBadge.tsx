import { AlertTriangle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCanonicalState } from '@/hooks/useWcmStateMappings';
import { governanceBadgeOf } from './wcmCanonicalState';
import { UNAPPROVED_LABEL, UNCLASSIFIED_LABEL } from './wcmFormat';

type Props = {
  doc: { distribution_ready: boolean; status: string | null; category: string | null };
  className?: string;
};

/**
 * Governance badge derived from the canonical state (exact mapping):
 * working/waiting distribuibile → non approvato; CLOSED/SUPERSEDED/APPROVED → nessun
 * badge; stato non mappato → "STATO DA CLASSIFICARE".
 */
const WcmUnapprovedBadge = ({ doc, className }: Props) => {
  const state = useCanonicalState(doc);
  const badge = governanceBadgeOf(doc, state);
  if (badge === 'NONE') return null;

  if (badge === 'UNCLASSIFIED') {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-1 rounded border border-wcm-line-strong bg-wcm-panel px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-wcm-text',
          className,
        )}
        title="Stato non riconosciuto: richiede una classificazione di Stefano"
      >
        <HelpCircle className="h-3 w-3" />
        {UNCLASSIFIED_LABEL}
      </span>
    );
  }

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
