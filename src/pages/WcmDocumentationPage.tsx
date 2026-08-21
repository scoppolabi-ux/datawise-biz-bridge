import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, FileText, Loader2, ShieldAlert } from 'lucide-react';
import WcmPageShell from '@/components/wcm/WcmPageShell';
import WcmMarkdown from '@/components/wcm/WcmMarkdown';
import WcmDocumentToc from '@/components/wcm/WcmDocumentToc';

import {
  SOURCE_OF_TRUTH_NOTE,
  assetUrl,
  canDownload,
  statusLabel,
  type WcmReleaseDocument,
} from '@/components/wcm/wcmDocumentation';
import {
  useWcmDocumentationManifest,
  useWcmDocumentationSnapshot,
} from '@/hooks/useWcmDocumentation';

const Meta = ({ label, value }: { label: string; value: string }) => (
  <span className="min-w-0">
    <span className="block text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
      {label}
    </span>
    <span className="block truncate font-mono text-xs text-wcm-text">{value || '—'}</span>
  </span>
);

const DownloadLink = ({
  href,
  filename,
  children,
}: {
  href: string;
  filename: string;
  children: React.ReactNode;
}) => (
  <a
    href={assetUrl(href)}
    download={filename}
    className="inline-flex items-center gap-2 rounded-md border border-wcm-line-strong px-3 py-1.5 text-xs text-wcm-text transition-colors hover:border-wcm-accent hover:bg-wcm-surface hover:text-wcm-strong"
  >
    <Download className="h-3.5 w-3.5" />
    {children}
  </a>
);

const DocumentCard = ({
  doc,
  onOpen,
}: {
  doc: WcmReleaseDocument;
  onOpen: () => void;
}) => (
  <article className="rounded-xl border border-wcm-line bg-wcm-surface/50 p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-wcm-strong">{doc.title}</h2>
        <p className="mt-0.5 text-xs text-wcm-dim">{doc.audience}</p>
      </div>
      <span className="shrink-0 rounded-md border border-wcm-line-strong px-2 py-0.5 text-[11px] text-wcm-text">
        {statusLabel(doc.status)}
      </span>
    </div>

    <p className="mt-3 text-sm leading-relaxed text-wcm-text">{doc.description}</p>

    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Meta label="Versione" value={doc.version} />
      <Meta label="Data master" value={doc.master_date ?? '—'} />
      <Meta label="Source SHA" value={doc.source_sha_short} />
      <Meta label="QA" value={doc.qa_status} />
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center gap-2 rounded-md border border-wcm-accent/60 bg-wcm-accent/10 px-3 py-1.5 text-xs font-medium text-wcm-accent transition-colors hover:bg-wcm-accent/20"
      >
        <FileText className="h-3.5 w-3.5" />
        Consulta
      </button>
      {canDownload(doc, 'docx') && (
        <DownloadLink
          href={doc.docx_path as string}
          filename={doc.download_filename_docx ?? `${doc.document_id}.docx`}
        >
          Scarica Word
        </DownloadLink>
      )}
      {canDownload(doc, 'pdf') && (
        <DownloadLink
          href={doc.pdf_path as string}
          filename={doc.download_filename_pdf ?? `${doc.document_id}.pdf`}
        >
          Scarica PDF
        </DownloadLink>
      )}
    </div>

    {(!canDownload(doc, 'docx') || !canDownload(doc, 'pdf')) && (
      <p className="mt-3 text-[11px] text-wcm-muted">
        Alcuni formati non sono disponibili in questa release: vengono mostrati solo gli artefatti
        realmente prodotti e verificati dalla pipeline.
      </p>
    )}
  </article>
);

const Reader = ({ doc, onClose }: { doc: WcmReleaseDocument; onClose: () => void }) => {
  const { data, isLoading, error } = useWcmDocumentationSnapshot(doc.markdown_path);

  return (
    <section className="rounded-xl border border-wcm-line bg-wcm-surface/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-wcm-accent transition-colors hover:text-wcm-strong"
          >
            <ArrowLeft className="h-3 w-3" />
            Tutti i documenti
          </button>
          <h2 className="mt-2 text-base font-semibold tracking-tight text-wcm-strong">
            {doc.title}
          </h2>
          <p className="mt-0.5 font-mono text-[11px] text-wcm-dim">
            {doc.version} · {doc.source_path} · source {doc.source_sha_short}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canDownload(doc, 'docx') && (
            <DownloadLink
              href={doc.docx_path as string}
              filename={doc.download_filename_docx ?? `${doc.document_id}.docx`}
            >
              Word
            </DownloadLink>
          )}
          {canDownload(doc, 'pdf') && (
            <DownloadLink
              href={doc.pdf_path as string}
              filename={doc.download_filename_pdf ?? `${doc.document_id}.pdf`}
            >
              PDF
            </DownloadLink>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-wcm-line pt-4">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-wcm-dim" />
          </div>
        )}
        {error && (
          <p className="text-sm text-wcm-muted">
            Snapshot della release non disponibile. Rigenera la release dalla pipeline.
          </p>
        )}
        {data && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-6">
            <div className="order-2 min-w-0 lg:order-1">
              <WcmMarkdown content={data} />
            </div>
            <div className="order-1 min-w-0 lg:order-2">
              <WcmDocumentToc markdown={data} documentTitle={doc.title} />
            </div>
          </div>
        )}
      </div>

    </section>
  );
};

const WcmDocumentationPage = () => {
  const [params, setParams] = useSearchParams();
  const { data: manifest, isLoading, error } = useWcmDocumentationManifest();

  const documents = manifest?.documents ?? [];
  const selected = documents.find((d) => d.document_id === params.get('document')) ?? null;

  const open = (documentId: string) => {
    const next = new URLSearchParams(params);
    next.set('document', documentId);
    setParams(next, { replace: false });
  };
  const close = () => {
    const next = new URLSearchParams(params);
    next.delete('document');
    setParams(next, { replace: false });
  };

  return (
    <WcmPageShell title="Documentazione WCM" count={documents.length || undefined}>
      <p className="flex items-start gap-2 rounded-lg border border-wcm-line bg-wcm-panel/40 p-3 text-xs leading-relaxed text-wcm-muted">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wcm-accent" />
        {SOURCE_OF_TRUTH_NOTE}
      </p>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
          Nessuna release di documentazione disponibile. Gli artefatti Word/PDF e gli snapshot
          vengono prodotti dalla pipeline di rilascio prima del build.
        </p>
      )}

      {!isLoading && !error && documents.length === 0 && (
        <p className="mt-4 rounded-lg border border-wcm-line bg-wcm-surface/50 p-6 text-sm text-wcm-muted">
          Nessun documento presente nella release corrente.
        </p>
      )}

      {selected ? (
        <div className="mt-4">
          <Reader doc={selected} onClose={close} />
        </div>
      ) : (
        documents.length > 0 && (
          <div className="mt-4 space-y-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-wcm-dim">
              <BookOpen className="h-3.5 w-3.5" />
              Master correnti
            </p>
            {documents.map((doc) => (
              <DocumentCard key={doc.document_id} doc={doc} onOpen={() => open(doc.document_id)} />
            ))}
          </div>
        )
      )}
    </WcmPageShell>
  );
};

export default WcmDocumentationPage;
