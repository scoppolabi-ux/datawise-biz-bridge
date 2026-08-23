import { AlertTriangle, Loader2 } from 'lucide-react';
import WcmMarkdown from './WcmMarkdown';
import { canFetchSourceContent, useWcmDocumentContent } from '@/hooks/useWcmDocumentContent';

type Props = {
  projectId: string;
  doc: {
    content_markdown: string | null;
    source_path: string | null;
    source_url: string | null;
  };
};

/**
 * Corpo del documento: read model se presente, altrimenti fallback server-side
 * sul sorgente GitHub (nessuna scrittura sul read model).
 */
const WcmDocumentBody = ({ projectId, doc }: Props) => {
  const stored = (doc.content_markdown ?? '').trim();
  const fallbackEligible = canFetchSourceContent(projectId, doc);
  const query = useWcmDocumentContent(projectId, doc);

  if (stored !== '') return <WcmMarkdown content={stored} />;

  if (fallbackEligible) {
    if (query.isLoading) {
      return (
        <p className="flex items-center gap-2 rounded-lg border border-wcm-line bg-wcm-bg/50 p-4 text-sm text-wcm-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Lettura del sorgente da GitHub in corso…
        </p>
      );
    }
    if (query.isError) {
      return (
        <div className="rounded-lg border border-wcm-alert/40 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
          <p className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            Impossibile leggere il sorgente da GitHub
          </p>
          <p className="mt-1 text-wcm-text">{(query.error as Error).message}</p>
          {doc.source_url && (
            <p className="mt-1 text-wcm-muted">
              Usa "Apri il sorgente su GitHub" per leggere l'originale.
            </p>
          )}
        </div>
      );
    }
    if (query.data) return <WcmMarkdown content={query.data} />;
  }

  return (
    <p className="rounded-lg border border-wcm-line bg-wcm-bg/50 p-4 text-sm text-wcm-muted">
      Contenuto non ancora sincronizzato nel read-model.
      {doc.source_url && ' Usa "Apri il sorgente su GitHub" per leggere l\'originale.'}
    </p>
  );
};

export default WcmDocumentBody;
