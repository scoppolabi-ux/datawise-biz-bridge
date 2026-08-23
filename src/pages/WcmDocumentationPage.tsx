import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Download,
  FileText,
  FolderKanban,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
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

const DownloadLink = ({ href, filename, children }: {
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

const qaLabel = (doc: WcmReleaseDocument) =>
  `${doc.qa_status} / visual ${doc.visual_qa_status}`;

const DocumentCard = ({ doc, onOpen }: { doc: WcmReleaseDocument; onOpen: () => void }) => (
  <article className="rounded-xl border border-wcm-line bg-wcm-surface/50 p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-base font-semibold tracking-tight text-wcm-strong">{doc.title}</h3>
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
      <Meta label="QA" value={qaLabel(doc)} />
    </div>

    {(doc.docx_page_count || doc.pdf_page_count) && (
      <p className="mt-2 text-[11px] text-wcm-dim">
        Pagine verificate: Word {doc.docx_page_count ?? '—'} · PDF {doc.pdf_page_count ?? '—'}
      </p>
    )}

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
        <DownloadLink href={doc.docx_path as string} filename={doc.download_filename_docx ?? `${doc.document_id}.docx`}>
          Scarica Word
        </DownloadLink>
      )}
      {canDownload(doc, 'pdf') && (
        <DownloadLink href={doc.pdf_path as string} filename={doc.download_filename_pdf ?? `${doc.document_id}.pdf`}>
          Scarica PDF
        </DownloadLink>
      )}
    </div>

    {doc.visual_qa_status !== 'PASS' && (
      <p className="mt-3 text-[11px] text-wcm-muted">
        Word/PDF sono stati generati, ma il download resta nascosto finché il controllo visuale pagina-per-pagina non è `PASS`.
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
            Documentazione
          </button>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-wcm-dim">
            {doc.scope === 'project' ? `Progetto · ${doc.project_label ?? doc.project_id}` : 'WCM · Metodo generale'}
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-wcm-strong">{doc.title}</h2>
          <p className="mt-0.5 font-mono text-[11px] text-wcm-dim">
            {doc.version} · {doc.source_path} · source {doc.source_sha_short} · {qaLabel(doc)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canDownload(doc, 'docx') && (
            <DownloadLink href={doc.docx_path as string} filename={doc.download_filename_docx ?? `${doc.document_id}.docx`}>
              Word
            </DownloadLink>
          )}
          {canDownload(doc, 'pdf') && (
            <DownloadLink href={doc.pdf_path as string} filename={doc.download_filename_pdf ?? `${doc.document_id}.pdf`}>
              PDF
            </DownloadLink>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-wcm-line pt-4">
        {isLoading && <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-wcm-dim" /></div>}
        {error && <p className="text-sm text-wcm-muted">Snapshot della release non disponibile. Rigenera la release dalla pipeline.</p>}
        {data && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-6">
            <div className="order-2 min-w-0 lg:order-1"><WcmMarkdown content={data} /></div>
            <div className="order-1 min-w-0 lg:order-2"><WcmDocumentToc markdown={data} documentTitle={doc.title} /></div>
          </div>
        )}
      </div>
    </section>
  );
};

const DocGroup = ({
  title,
  subtitle,
  icon,
  documents,
  onOpen,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  documents: WcmReleaseDocument[];
  onOpen: (id: string) => void;
}) => {
  if (!documents.length) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-start gap-2 border-b border-wcm-line pb-2">
        <span className="mt-0.5 text-wcm-accent">{icon}</span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-wcm-strong">{title}</h2>
          <p className="mt-0.5 text-xs text-wcm-muted">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-3">
        {documents.map((doc) => <DocumentCard key={doc.document_id} doc={doc} onOpen={() => onOpen(doc.document_id)} />)}
      </div>
    </section>
  );
};

const WcmDocumentationPage = () => {
  const [params, setParams] = useSearchParams();
  const { data: manifest, isLoading, error } = useWcmDocumentationManifest();

  const documents = manifest?.documents ?? [];
  const selected = documents.find((d) => d.document_id === params.get('document')) ?? null;
  const wcmDocuments = documents.filter((d) => d.scope === 'wcm');
  const projectDocuments = documents.filter((d) => d.scope === 'project');
  const projectGroups = Array.from(
    projectDocuments.reduce((groups, doc) => {
      const key = doc.project_id ?? 'unknown';
      const group = groups.get(key) ?? { label: doc.project_label ?? key, docs: [] as WcmReleaseDocument[] };
      group.docs.push(doc);
      groups.set(key, group);
      return groups;
    }, new Map<string, { label: string; docs: WcmReleaseDocument[] }>()),
  );

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
    <WcmPageShell title="Documentazione" count={documents.length || undefined}>
      <p className="flex items-start gap-2 rounded-lg border border-wcm-line bg-wcm-panel/40 p-3 text-xs leading-relaxed text-wcm-muted">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wcm-accent" />
        {SOURCE_OF_TRUTH_NOTE}
      </p>

      {isLoading && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-wcm-dim" /></div>}
      {error && (
        <p className="mt-4 rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
          Nessuna release di documentazione disponibile. Gli snapshot e gli artefatti vengono prodotti dalla pipeline di rilascio prima del build.
        </p>
      )}
      {!isLoading && !error && documents.length === 0 && (
        <p className="mt-4 rounded-lg border border-wcm-line bg-wcm-surface/50 p-6 text-sm text-wcm-muted">Nessun documento presente nella release corrente.</p>
      )}

      {selected ? (
        <div className="mt-4"><Reader doc={selected} onClose={close} /></div>
      ) : (
        documents.length > 0 && (
          <div className="mt-5 space-y-8">
            <DocGroup
              title="WCM"
              subtitle="Metodo generale: come è costruito, perché serve e come si usa."
              icon={<BookOpen className="h-4 w-4" />}
              documents={wcmDocuments}
              onOpen={open}
            />
            {projectGroups.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-wcm-dim">
                  <FolderKanban className="h-3.5 w-3.5" />
                  Progetti
                </div>
                {projectGroups.map(([projectId, group]) => (
                  <DocGroup
                    key={projectId}
                    title={group.label}
                    subtitle="Documentazione specifica dell’applicazione WCM al progetto."
                    icon={<FolderKanban className="h-4 w-4" />}
                    documents={group.docs}
                    onOpen={open}
                  />
                ))}
              </div>
            )}
          </div>
        )
      )}
    </WcmPageShell>
  );
};

export default WcmDocumentationPage;
