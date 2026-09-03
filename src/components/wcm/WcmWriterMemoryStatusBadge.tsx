import { PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WcmProjectStatus } from '@/hooks/useWcmProjects';

/**
 * Etichetta human-facing dello stato Writer Memory Review.
 * Ritorna null quando il read-model non espone ancora i campi: il badge non
 * viene mai reso "a vuoto" e nessun dato viene derivato lato client.
 */
export const writerMemoryStatusLabel = (
  project: Pick<
    WcmProjectStatus,
    | 'writer_memory_processing_status'
    | 'writer_memory_review_status'
    | 'writer_memory_review_open_count'
  >,
): string | null => {
  const processing = project.writer_memory_processing_status ?? null;
  const review = project.writer_memory_review_status ?? null;
  if (!processing && !review) return null;

  const parts = [processing, review].filter(Boolean) as string[];
  let label = `Writer Memory: ${parts.join(' · ')}`;

  const openCount = project.writer_memory_review_open_count;
  if (typeof openCount === 'number' && openCount > 0) {
    label += ` · ${openCount} aperte`;
  }
  return label;
};

/**
 * Badge osservativo read-only dello stato Writer Memory Review.
 * Nessuna command surface: la risoluzione di Writer Memory Pending resta
 * fuori da Mission Control per scelta esplicita.
 */
const WcmWriterMemoryStatusBadge = ({
  project,
  className,
}: {
  project: WcmProjectStatus;
  className?: string;
}) => {
  const label = writerMemoryStatusLabel(project);
  if (!label) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-wcm-line bg-wcm-surface/60 px-2 py-0.5 text-[11px] font-medium text-wcm-muted',
        className,
      )}
      title="Writer Memory Review — stato osservato dal read-model (read-only)"
    >
      <PenLine className="h-3 w-3 shrink-0" />
      {label}
    </span>
  );
};

export default WcmWriterMemoryStatusBadge;
