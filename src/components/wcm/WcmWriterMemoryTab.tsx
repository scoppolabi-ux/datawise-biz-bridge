import { useMemo, useState } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WcmWriterMemory } from '@/hooks/useWcmWriterMemory';

/**
 * Writer Memory — superficie di sola osservazione.
 * Nessun edit, nessun write-back: GitHub/WCM main resta source of truth.
 */

const STATUS_FILTERS = ['ALL', 'ACTIVE', 'SUPERSEDED', 'CLOSED'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const STATUS_LABELS: Record<string, string> = {
  ALL: 'Tutte',
  ACTIVE: 'Attive',
  SUPERSEDED: 'Superate',
  CLOSED: 'Chiuse',
};

const CATEGORY_LABELS: Record<string, string> = {
  CHARACTER: 'Personaggio',
  STYLE: 'Stile',
  THRILLER: 'Thriller',
  REVEAL: 'Rivelazione',
  RELATIONSHIP: 'Relazione',
  OTHER: 'Altro',
};

const statusClasses = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    case 'SUPERSEDED':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
    case 'CLOSED':
      return 'border-wcm-line-strong bg-wcm-panel text-wcm-muted';
    default:
      return 'border-wcm-line-strong bg-wcm-panel text-wcm-muted';
  }
};

const categoryLabel = (category: string | null) =>
  category ? CATEGORY_LABELS[category] ?? category : null;

const FilterButton = ({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'rounded-md border px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] transition-colors',
      active
        ? 'border-wcm-accent/40 bg-wcm-panel text-wcm-strong'
        : 'border-wcm-line bg-transparent text-wcm-muted hover:border-wcm-accent hover:text-wcm-strong',
    )}
  >
    {label}
    {count !== undefined && <span className="ml-1.5 font-mono text-wcm-dim">{count}</span>}
  </button>
);

const MemoryCard = ({ item }: { item: WcmWriterMemory }) => {
  const origin = item.origin_context ?? item.origin_type;
  return (
    <article className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-wcm-strong">
          <span className="font-mono">{item.memory_id}</span>
          <span className="text-wcm-dim"> — </span>
          {item.scope}
          {categoryLabel(item.category) && (
            <>
              <span className="text-wcm-dim"> / </span>
              <span className="font-normal text-wcm-text">{categoryLabel(item.category)}</span>
            </>
          )}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {item.category && (
            <span className="rounded-md border border-wcm-line-strong px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-wcm-muted">
              {item.category}
            </span>
          )}
          <span
            className={cn(
              'rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]',
              statusClasses(item.status),
            )}
          >
            {item.status}
          </span>
        </div>
      </header>

      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-wcm-text">
        {item.guidance}
      </p>

      {origin && (
        <p className="mt-3 text-xs text-wcm-muted">
          <span className="font-semibold uppercase tracking-[0.12em] text-wcm-dim">Origine: </span>
          {origin}
          {item.origin_ref && <span className="font-mono text-wcm-dim"> · {item.origin_ref}</span>}
        </p>
      )}

      {(item.source_path || item.source_sha) && (
        <p className="mt-2 truncate font-mono text-[10px] text-wcm-dim">
          {item.source_path}
          {item.source_sha && ` · ${item.source_sha.slice(0, 8)}`}
        </p>
      )}
    </article>
  );
};

const WcmWriterMemoryTab = ({
  items,
  isLoading,
  hasError,
}: {
  items: WcmWriterMemory[];
  isLoading?: boolean;
  hasError?: boolean;
}) => {
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [category, setCategory] = useState<string>('ALL');

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[])).sort(),
    [items],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: items.length };
    for (const item of items) counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          (status === 'ALL' || i.status === status) &&
          (category === 'ALL' || i.category === category),
      ),
    [items, status, category],
  );

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
        Impossibile caricare la Writer Memory.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-6 text-sm text-wcm-muted">
        <p className="flex items-center gap-2 font-medium text-wcm-text">
          <BookOpen className="h-4 w-4 text-wcm-dim" />
          Nessuna Writer Memory nel read-model.
        </p>
        <p className="mt-2 text-xs">
          La collection è opzionale: comparirà qui non appena la source su main la pubblicherà.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_FILTERS.map((value) => (
          <FilterButton
            key={value}
            active={status === value}
            label={STATUS_LABELS[value]}
            count={statusCounts[value] ?? 0}
            onClick={() => setStatus(value)}
          />
        ))}
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterButton
            active={category === 'ALL'}
            label="Tutte le categorie"
            onClick={() => setCategory('ALL')}
          />
          {categories.map((value) => (
            <FilterButton
              key={value}
              active={category === value}
              label={categoryLabel(value) ?? value}
              onClick={() => setCategory(value)}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-6 text-sm text-wcm-muted">
          Nessuna memoria corrisponde ai filtri selezionati.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <MemoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WcmWriterMemoryTab;
