import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WcmMarkdown from './WcmMarkdown';
import WcmDocumentActions from './WcmDocumentActions';
import WcmUnapprovedBadge from './WcmUnapprovedBadge';
import type { WcmProjectDocument } from '@/hooks/useWcmProjects';

const Meta = ({ label, value }: { label: string; value: string | null }) => {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
        {label}
      </span>
      <p className="truncate font-mono text-xs text-wcm-text" title={value}>
        {value}
      </p>
    </div>
  );
};

const WcmDocumentReader = ({
  doc,
  projectId,
  onBack,
  backLabel = 'Torna ai documenti',
}: {
  doc: WcmProjectDocument;
  projectId: string;
  onBack: () => void;
  backLabel?: string;
}) => (
  <div className="rounded-xl border border-wcm-line bg-wcm-surface/60">
    <header className="space-y-4 border-b border-wcm-line p-4 sm:p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="-ml-2 h-8 text-wcm-muted hover:bg-wcm-panel hover:text-wcm-strong"
      >
        <ArrowLeft className="mr-2 h-3.5 w-3.5" />
        {backLabel}
      </Button>


      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <FileText className="mt-1 h-4 w-4 shrink-0 text-wcm-dim" />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-wcm-strong sm:text-xl">{doc.title}</h2>
            <p className="mt-1 font-mono text-xs text-wcm-dim">{doc.document_id}</p>
            <WcmUnapprovedBadge doc={doc} className="mt-2" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <WcmDocumentActions doc={doc} projectId={projectId} variant="reader" />
          {doc.source_url && (
            <a
              href={doc.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-md border border-wcm-line-strong px-3 py-1.5 text-xs text-wcm-text transition-colors hover:bg-wcm-panel hover:text-wcm-strong"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View source on GitHub
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Meta label="Category" value={doc.category} />
        <Meta label="Status" value={doc.status} />
        <Meta label="Version" value={doc.version} />
        <Meta label="Source SHA" value={doc.source_sha ? doc.source_sha.slice(0, 10) : null} />
        <div className="col-span-2 sm:col-span-4">
          <Meta label="Source path" value={doc.source_path} />
        </div>
      </div>
    </header>

    <div className="p-4 sm:p-6">
      {doc.content_markdown ? (
        <WcmMarkdown content={doc.content_markdown} />
      ) : (
        <p className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-4 text-sm text-wcm-muted">
          Contenuto non ancora sincronizzato nel read-model.
          {doc.source_url && ' Usa "View source on GitHub" per leggere l\'originale.'}
        </p>
      )}
    </div>
  </div>
);

export default WcmDocumentReader;
