import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { baseLevel, buildToc, type WcmTocEntry } from './wcmToc';

const INDENT = ['pl-0', 'pl-3', 'pl-6'];

/** Highlight the heading currently visible in the viewport (best effort). */
const useActiveHeading = (entries: WcmTocEntry[]) => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!entries.length || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-88px 0px -70% 0px', threshold: 0 },
    );
    const nodes = entries
      .map((e) => document.getElementById(e.id))
      .filter((n): n is HTMLElement => Boolean(n));
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [entries]);

  return active;
};

const TocLinks = ({
  entries,
  min,
  active,
  onNavigate,
}: {
  entries: WcmTocEntry[];
  min: number;
  active: string | null;
  onNavigate?: () => void;
}) => (
  <nav aria-label="Indice del documento" className="space-y-0.5">
    {entries.map((entry) => (
      <a
        key={entry.id}
        href={`#${entry.id}`}
        onClick={(event) => {
          event.preventDefault();
          const target = document.getElementById(entry.id);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.replaceState(null, '', `#${entry.id}`);
          }
          onNavigate?.();
        }}
        className={cn(
          'block rounded-md border-l-2 py-1 pr-2 text-xs leading-snug transition-colors',
          INDENT[Math.min(entry.level - min, INDENT.length - 1)],
          entry.level === min ? 'font-medium' : 'font-normal',
          active === entry.id
            ? 'border-wcm-accent bg-wcm-accent/10 text-wcm-accent'
            : 'border-transparent text-wcm-muted hover:border-wcm-line-strong hover:text-wcm-strong',
        )}
      >
        <span className="ml-2 block">{entry.text}</span>
      </a>
    ))}
  </nav>
);

/**
 * Table of contents generated from the Markdown source of the open manual.
 * Desktop: sticky side panel. Mobile: collapsible "Indice".
 */
const WcmDocumentToc = ({
  markdown,
  documentTitle,
}: {
  markdown: string;
  documentTitle?: string;
}) => {
  const entries = useMemo(() => buildToc(markdown, documentTitle), [markdown, documentTitle]);
  const min = useMemo(() => baseLevel(entries), [entries]);
  const active = useActiveHeading(entries);
  const [open, setOpen] = useState(false);

  if (!entries.length) return null;

  return (
    <>
      {/* Mobile: collapsible */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-wcm-line bg-wcm-panel/40 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-wcm-muted"
        >
          <span className="inline-flex items-center gap-2">
            <List className="h-3.5 w-3.5 text-wcm-accent" />
            Indice
            <span className="font-mono text-[10px] text-wcm-dim">{entries.length}</span>
          </span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </button>
        {open && (
          <div className="mt-2 max-h-[50vh] overflow-y-auto rounded-lg border border-wcm-line bg-wcm-surface/60 p-2">
            <TocLinks entries={entries} min={min} active={active} onNavigate={() => setOpen(false)} />
          </div>
        )}
      </div>

      {/* Desktop: sticky side panel */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-wcm-line bg-wcm-panel/30 p-3">
          <p className="mb-2 flex items-center gap-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-wcm-dim">
            <List className="h-3.5 w-3.5 text-wcm-accent" />
            Indice
          </p>
          <TocLinks entries={entries} min={min} active={active} />
        </div>
      </aside>
    </>
  );
};

export default WcmDocumentToc;
