import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WcmProjectDocument, WcmProjectRoadmapItem } from '@/hooks/useWcmProjects';
import { ROADMAP_STATUS_LABELS, roadmapStatusClasses } from './wcmFormat';

const WcmRoadmapTab = ({
  items,
  documents,
  onOpenDocument,
}: {
  items: WcmProjectRoadmapItem[];
  documents: WcmProjectDocument[];
  onOpenDocument: (documentId: string) => void;
}) => {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
        Nessuna milestone sincronizzata nel read-model.
      </p>
    );
  }

  const roots = items.filter((i) => !i.parent_id);
  const childrenOf = (id: string) => items.filter((i) => i.parent_id === id);

  const renderItem = (item: WcmProjectRoadmapItem, depth = 0) => {
    const doc = documents.find((d) => d.document_id === item.related_document_id);
    return (
      <li key={item.id} className={cn(depth > 0 && 'ml-4 border-l border-slate-800 pl-4')}>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-slate-100">{item.label}</h3>
              <p className="mt-1 font-mono text-[11px] text-slate-600">
                {item.item_type ?? 'milestone'} · #{item.sequence}
              </p>
            </div>
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 text-[11px] font-medium',
                roadmapStatusClasses(item.status),
              )}
            >
              {ROADMAP_STATUS_LABELS[(item.status ?? '').toUpperCase()] ?? item.status ?? '—'}
            </span>
          </div>
          {item.notes && <p className="mt-2 text-sm text-slate-400">{item.notes}</p>}
          {doc && (
            <button
              type="button"
              onClick={() => onOpenDocument(doc.document_id)}
              className="mt-3 inline-flex items-center gap-2 rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
            >
              <FileText className="h-3.5 w-3.5" />
              {doc.title}
            </button>
          )}
        </div>
        {childrenOf(item.item_id).length > 0 && (
          <ul className="mt-3 space-y-3">
            {childrenOf(item.item_id).map((child) => renderItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return <ul className="space-y-3">{roots.map((item) => renderItem(item))}</ul>;
};

export default WcmRoadmapTab;
