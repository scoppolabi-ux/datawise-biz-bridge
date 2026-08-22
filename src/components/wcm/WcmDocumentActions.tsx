import { Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { WcmProjectDocument } from '@/hooks/useWcmProjects';
import { useCanonicalState } from '@/hooks/useWcmStateMappings';
import { downloadDocument, shareDocument } from './wcmShare';

type Props = {
  doc: WcmProjectDocument;
  projectId: string;
  variant?: 'row' | 'reader';
  className?: string;
};

/** Download + share actions, only rendered for distribution_ready documents. */
const WcmDocumentActions = ({ doc, projectId, variant = 'row', className }: Props) => {
  const state = useCanonicalState(doc);
  if (!doc.distribution_ready) return null;

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDownload = (e: React.MouseEvent) => {
    stop(e);
    if (!doc.content_markdown) {
      toast({ title: 'Contenuto non disponibile', description: 'Documento non sincronizzato.' });
      return;
    }
    downloadDocument(doc, state);
    toast({ title: 'Download avviato', description: doc.title });
  };

  const onShare = async (e: React.MouseEvent) => {
    stop(e);
    const result = await shareDocument(doc, projectId, state);
    if (result.kind === 'file') {
      toast({ title: 'Documento condiviso', description: 'File allegato alla condivisione.' });
    } else if (result.kind === 'link') {
      toast({
        title: 'Link condiviso',
        description: 'Il file non è allegabile su questo browser: condiviso solo il link.',
      });
    } else if (result.kind === 'whatsapp') {
      toast({
        title: 'WhatsApp aperto',
        description: 'Condiviso solo il link. Usa "Scarica" per inviare il file.',
      });
    } else if (result.kind === 'error') {
      toast({ title: 'Condivisione non riuscita', description: result.message });
    }
  };

  const isReader = variant === 'reader';
  const base = cn(
    'inline-flex shrink-0 items-center gap-2 rounded-md border border-wcm-line-strong text-wcm-text transition-colors hover:bg-wcm-panel hover:text-wcm-strong',
    isReader ? 'px-3 py-1.5 text-xs' : 'p-2',
  );

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button type="button" onClick={onDownload} className={base} title="Scarica documento">
        <Download className="h-3.5 w-3.5" />
        {isReader && <span>Scarica</span>}
        {!isReader && <span className="sr-only">Scarica</span>}
      </button>
      <button type="button" onClick={onShare} className={base} title="Condividi documento">
        <Share2 className="h-3.5 w-3.5" />
        {isReader && <span>Condividi</span>}
        {!isReader && <span className="sr-only">Condividi</span>}
      </button>
    </div>
  );
};

export default WcmDocumentActions;
