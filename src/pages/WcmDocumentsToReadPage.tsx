import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Loader2 } from 'lucide-react';
import WcmPageShell from '@/components/wcm/WcmPageShell';
import WcmDocumentActions from '@/components/wcm/WcmDocumentActions';
import {
  isOpenNeed,
  useWcmDocumentsToRead,
  useWcmNeeds,
  useWcmProjects,
} from '@/hooks/useWcmProjects';

const WcmDocumentsToReadPage = () => {
  const { data: documents, isLoading, error } = useWcmDocumentsToRead();
  const { data: projects } = useWcmProjects(true);
  const { data: needs } = useWcmNeeds();

  const byId = new Map((projects ?? []).map((p) => [p.project_id, p]));
  const openNeeds = (needs ?? []).filter(isOpenNeed);
  const docs = documents ?? [];

  const needFor = (projectId: string, documentId: string) =>
    openNeeds.find(
      (n) =>
        n.project_id === projectId &&
        (n.related_document_ids ?? []).includes(documentId),
    );

  return (
    <WcmPageShell title="Documenti da leggere" count={docs.length}>
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
          Impossibile caricare i documenti.
        </p>
      )}

      {!isLoading && !error && docs.length === 0 && (
        <p className="rounded-lg border border-wcm-line bg-wcm-surface/50 p-6 text-sm text-wcm-muted">
          Nessun documento in attesa di lettura.
        </p>
      )}

      <ul className="space-y-3">
        {docs.map((doc) => {
          const project = byId.get(doc.project_id);
          const need = needFor(doc.project_id, doc.document_id);
          const meta = [doc.category, doc.status, doc.version && `v${doc.version}`]
            .filter(Boolean)
            .join(' · ');
          return (
            <li
              key={doc.id}
              className="rounded-xl border border-wcm-line bg-wcm-surface/60 transition-colors hover:border-wcm-accent/50"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                <Link
                  to={`/wcm/${doc.project_id}?tab=documents&document=${encodeURIComponent(
                    doc.document_id,
                  )}`}
                  className="min-w-0 flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-wcm-accent"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-wcm-dim">
                    {project?.project_name ?? doc.project_id}
                  </span>
                  <h2 className="mt-1 flex items-start gap-2 text-sm font-semibold text-wcm-strong sm:text-base">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-wcm-dim" />
                    {doc.title}
                  </h2>
                  {meta && (
                    <p className="mt-1 font-mono text-[11px] text-wcm-dim">{meta}</p>
                  )}
                  {need && (
                    <p className="mt-2 text-xs leading-relaxed text-wcm-alert-fg">
                      <span className="font-semibold uppercase tracking-wider">Need: </span>
                      {need.title}
                      {need.reason && (
                        <span className="text-wcm-muted"> — {need.reason}</span>
                      )}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-wcm-accent">
                    Apri documento
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
                <WcmDocumentActions doc={doc} projectId={doc.project_id} />
              </div>
            </li>
          );
        })}
      </ul>
    </WcmPageShell>
  );
};

export default WcmDocumentsToReadPage;
