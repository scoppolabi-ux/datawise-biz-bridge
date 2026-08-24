import { useState } from 'react';
import { Download, ExternalLink, FileText, Loader2, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { WcmProjectDocument } from '@/hooks/useWcmProjects';
import { useCanonicalState } from '@/hooks/useWcmStateMappings';
import {
  buildArtifact,
  canBuildArtifacts,
  saveBlob,
  type WcmArtifactFormat,
} from '@/lib/wcmArtifacts';
import { shareDocument } from './wcmShare';
import { sourceLink } from './wcmSourceLink';

type Props = {
  doc: WcmProjectDocument;
  projectId: string;
  variant?: 'row' | 'reader';
  /** Rendered as the explicit "Consulta" command (list variant). */
  onOpen?: () => void;
  className?: string;
};

/**
 * Barra azioni documento: Consulta, Word, PDF, Apri origine, Inoltra.
 * Word/PDF sono artefatti reali generati dal markdown canonico; nessun .txt.
 */
const WcmDocumentActions = ({ doc, projectId, variant = 'row', onOpen, className }: Props) => {
  const state = useCanonicalState(doc);
  const [busy, setBusy] = useState<WcmArtifactFormat | 'share' | null>(null);

  // Word/PDF sono distribuzione: solo documenti distribuibili con contenuto
  // canonico. Consulta / Apri origine / Inoltra restano sempre disponibili.
  const artifactsReady = Boolean(doc.distribution_ready) && canBuildArtifacts(doc);
  const origin = sourceLink(projectId, doc.source_path);
  const isReader = variant === 'reader';

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const make = (format: WcmArtifactFormat) => buildArtifact(doc, state, format);

  const onDownload = (format: WcmArtifactFormat) => async (e: React.MouseEvent) => {
    stop(e);
    setBusy(format);
    try {
      const artifact = await make(format);
      saveBlob(artifact.blob, artifact.filename);
      toast({ title: 'Download avviato', description: artifact.filename });
    } catch (error) {
      toast({
        title: `Generazione ${format.toUpperCase()} non riuscita`,
        description: (error as Error).message,
      });
    } finally {
      setBusy(null);
    }
  };

  const onShare = async (e: React.MouseEvent) => {
    stop(e);
    setBusy('share');
    const result = await shareDocument(doc, projectId, {
      buildArtifact: artifactsReady ? make : undefined,
      availableFormats: artifactsReady ? ['pdf', 'docx'] : [],
    });
    setBusy(null);
    if (result.kind === 'file') {
      toast({
        title: 'Documento inoltrato',
        description: `Allegato ${result.format.toUpperCase()} impaginato.`,
      });
    } else if (result.kind === 'link') {
      toast({ title: 'Link inoltrato', description: 'Condiviso il link al documento.' });
    } else if (result.kind === 'whatsapp') {
      toast({
        title: 'WhatsApp aperto',
        description: 'Condiviso solo il link. Usa "Word"/"PDF" per inviare il file.',
      });
    } else if (result.kind === 'error') {
      toast({ title: 'Inoltro non riuscito', description: result.message });
    }
  };

  const base = cn(
    'inline-flex shrink-0 items-center gap-1.5 rounded-md border border-wcm-line-strong text-wcm-text transition-colors hover:bg-wcm-panel hover:text-wcm-strong disabled:opacity-50',
    isReader ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1.5 text-[11px]',
  );
  const icon = 'h-3.5 w-3.5';

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5 sm:gap-2', className)}>
      {onOpen && (
        <button
          type="button"
          onClick={(e) => {
            stop(e);
            onOpen();
          }}
          className={cn(base, 'border-wcm-accent/60 bg-wcm-accent/10 text-wcm-accent hover:bg-wcm-accent/20')}
          title="Consulta il documento"
        >
          <FileText className={icon} />
          Consulta
        </button>
      )}

      {artifactsReady && (
        <>
          <button
            type="button"
            onClick={onDownload('docx')}
            disabled={busy !== null}
            className={base}
            title="Scarica Word impaginato"
          >
            {busy === 'docx' ? <Loader2 className={cn(icon, 'animate-spin')} /> : <Download className={icon} />}
            Word
          </button>
          <button
            type="button"
            onClick={onDownload('pdf')}
            disabled={busy !== null}
            className={base}
            title="Scarica PDF impaginato"
          >
            {busy === 'pdf' ? <Loader2 className={cn(icon, 'animate-spin')} /> : <Download className={icon} />}
            PDF
          </button>
        </>
      )}

      {origin && (
        <a
          href={origin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={base}
          title="Apri il file canonico su GitHub"
        >
          <ExternalLink className={icon} />
          Apri origine
        </a>
      )}

      <button
        type="button"
        onClick={onShare}
        disabled={busy !== null}
        className={base}
        title={artifactsReady ? 'Inoltra il documento' : 'Inoltra il link al documento'}
      >
        {busy === 'share' ? <Loader2 className={cn(icon, 'animate-spin')} /> : <Share2 className={icon} />}
        Inoltra
      </button>
    </div>
  );
};

export default WcmDocumentActions;
