import { ChevronRight, FileText } from 'lucide-react';
import type { WcmProjectDocument } from '@/hooks/useWcmProjects';
import { useCanonicalStateIndex } from '@/hooks/useWcmStateMappings';
import WcmDocumentReader from './WcmDocumentReader';
import WcmDocumentActions from './WcmDocumentActions';
import WcmUnapprovedBadge from './WcmUnapprovedBadge';
import { resolveCanonicalState } from './wcmCanonicalState';
import { BUCKET_LABELS, bucketOf, toReadSortRank, type DocBucket } from './wcmFormat';

const ORDER: DocBucket[] = [
  'TO_READ',
  'UNCLASSIFIED',
  'MANUSCRIPT_APPROVED',
  'APPROVED_BASELINE',
  'WAITING_AUTHORITY',
  'WORKING_EDITORIAL',
  'CLOSED_SUPPORTING',
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
  <li className="border-b border-wcm-line/70 last:border-0">
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full min-w-0 items-start gap-3 p-4 pb-2 text-left transition-colors hover:bg-wcm-panel/40"
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
    <WcmDocumentActions
      doc={doc}
      projectId={projectId}
      onOpen={onOpen}
      className="px-4 pb-3 pl-11"
    />
  </li>
);

const WcmDocumentsTab = ({
  documents,
  projectId,
  openDocumentId,
  onOpenDocument,
  backLabel,
  onBack,
}: {
  documents: WcmProjectDocument[];
  projectId: string;
  openDocumentId: string | null;
  onOpenDocument: (documentId: string | null) => void;
  backLabel?: string;
  onBack?: () => void;
}) => {
  const { index } = useCanonicalStateIndex();
  const openDoc = documents.find((d) => d.document_id === openDocumentId);

  if (openDoc) {
    return (
      <WcmDocumentReader
        doc={openDoc}
        projectId={projectId}
        backLabel={backLabel}
        onBack={() => (onBack ? onBack() : onOpenDocument(null))}
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
          .filter((d) => bucketOf(d, resolveCanonicalState(d, index)) === bucket)
          .sort((a, b) =>
            bucket === 'TO_READ'
              ? toReadSortRank(a) - toReadSortRank(b)
              : Number(b.requires_stefano) - Number(a.requires_stefano),
          );
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
