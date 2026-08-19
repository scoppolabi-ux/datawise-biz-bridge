import { ChevronRight, ExternalLink, FileText } from 'lucide-react';
import type { WcmProjectDocument } from '@/hooks/useWcmProjects';
import WcmDocumentReader from './WcmDocumentReader';
import WcmDocumentActions from './WcmDocumentActions';
import WcmUnapprovedBadge from './WcmUnapprovedBadge';
import { BUCKET_LABELS, bucketOf, type DocBucket } from './wcmFormat';

const ORDER: DocBucket[] = [
  'TO_READ',
  'MANUSCRIPT_APPROVED',
  'APPROVED_BASELINE',
  'WORKING_EDITORIAL',
  'OTHER',
];

const DocRow = ({
  doc,
  projectId,
  onOpen,
}: {
  doc: WcmProjectDocument;
  projectId: string;
  onOpen: () => void;
}) => (
  <li className="flex items-center gap-2 border-b border-wcm-line/70 last:border-0">
    <button
      type="button"
      onClick={onOpen}
      className="flex min-w-0 flex-1 items-start gap-3 p-4 text-left transition-colors hover:bg-wcm-panel/40"
    >
      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-wcm-dim" />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-wcm-strong">
          {doc.title}
          <WcmUnapprovedBadge doc={doc} />
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-wcm-dim">
          {doc.category && <span className="font-mono">{doc.category}</span>}
          {doc.status && <span className="font-mono">· {doc.status}</span>}
          {doc.version && <span className="font-mono">· v{doc.version}</span>}
          {doc.source_path && <span className="truncate font-mono">· {doc.source_path}</span>}
        </span>
      </span>
      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-wcm-dim" />
    </button>
    <div className="mr-3 flex shrink-0 items-center gap-1.5">
      <WcmDocumentActions doc={doc} projectId={projectId} />
      {doc.source_url && (
        <a
          href={doc.source_url}
          target="_blank"
          rel="noopener noreferrer"
          title="Apri il sorgente su GitHub"
          className="shrink-0 rounded-md p-2 text-wcm-dim transition-colors hover:bg-wcm-panel hover:text-wcm-text"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  </li>
);

const WcmDocumentsTab = ({
  documents,
  projectId,
  openDocumentId,
  onOpenDocument,
}: {
  documents: WcmProjectDocument[];
  projectId: string;
  openDocumentId: string | null;
  onOpenDocument: (documentId: string | null) => void;
}) => {
  const openDoc = documents.find((d) => d.document_id === openDocumentId);

  if (openDoc) {
    return (
      <WcmDocumentReader
        doc={openDoc}
        projectId={projectId}
        onBack={() => onOpenDocument(null)}
      />
    );
  }

  if (documents.length === 0) {
    return (
      <p className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-6 text-sm text-wcm-muted">
        Nessun documento sincronizzato nel read-model.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {ORDER.map((bucket) => {
        const items = documents
          .filter((d) => bucketOf(d) === bucket)
          .sort((a, b) => Number(b.requires_stefano) - Number(a.requires_stefano));
        if (items.length === 0) return null;
        return (
          <section
            key={bucket}
            className="overflow-hidden rounded-xl border border-wcm-line bg-wcm-surface/60"
          >
            <h3 className="flex items-center justify-between border-b border-wcm-line px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
              {BUCKET_LABELS[bucket]}
              <span className="font-mono text-wcm-dim">{items.length}</span>
            </h3>
            <ul>
              {items.map((doc) => (
                <DocRow
                  key={doc.id}
                  doc={doc}
                  projectId={projectId}
                  onOpen={() => onOpenDocument(doc.document_id)}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
};

export default WcmDocumentsTab;
