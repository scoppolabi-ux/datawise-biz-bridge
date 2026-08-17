import { useState } from 'react';
import { ChevronRight, ExternalLink, FileText } from 'lucide-react';
import type { WcmProjectDocument } from '@/hooks/useWcmProjects';
import WcmDocumentReader from './WcmDocumentReader';
import { BUCKET_LABELS, bucketOf, type DocBucket } from './wcmFormat';

const ORDER: DocBucket[] = ['TO_READ', 'APPROVED_FROZEN', 'WORKING_EDITORIAL', 'OTHER'];

const DocRow = ({
  doc,
  onOpen,
}: {
  doc: WcmProjectDocument;
  onOpen: () => void;
}) => (
  <li className="flex items-center gap-2 border-b border-slate-800/70 last:border-0">
    <button
      type="button"
      onClick={onOpen}
      className="flex min-w-0 flex-1 items-start gap-3 p-4 text-left transition-colors hover:bg-slate-800/40"
    >
      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-slate-100">{doc.title}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
          {doc.category && <span className="font-mono">{doc.category}</span>}
          {doc.status && <span className="font-mono">· {doc.status}</span>}
          {doc.version && <span className="font-mono">· v{doc.version}</span>}
          {doc.source_path && <span className="truncate font-mono">· {doc.source_path}</span>}
        </span>
      </span>
      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
    </button>
    {doc.source_url && (
      <a
        href={doc.source_url}
        target="_blank"
        rel="noopener noreferrer"
        title="View source on GitHub"
        className="mr-3 shrink-0 rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    )}
  </li>
);

const WcmDocumentsTab = ({ documents }: { documents: WcmProjectDocument[] }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const openDoc = documents.find((d) => d.id === openId);

  if (openDoc) {
    return <WcmDocumentReader doc={openDoc} onBack={() => setOpenId(null)} />;
  }

  if (documents.length === 0) {
    return (
      <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
        Nessun documento sincronizzato nel read-model.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {ORDER.map((bucket) => {
        const items = documents.filter((d) => bucketOf(d) === bucket);
        if (items.length === 0) return null;
        return (
          <section
            key={bucket}
            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
          >
            <h3 className="flex items-center justify-between border-b border-slate-800 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {BUCKET_LABELS[bucket]}
              <span className="font-mono text-slate-600">{items.length}</span>
            </h3>
            <ul>
              {items.map((doc) => (
                <DocRow key={doc.id} doc={doc} onOpen={() => setOpenId(doc.id)} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
};

export default WcmDocumentsTab;
