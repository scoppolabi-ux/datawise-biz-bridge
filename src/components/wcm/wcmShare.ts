import type { ResolvedState } from './wcmCanonicalState';
import {
  MIME,
  artifactFileName,
  type WcmArtifact,
  type WcmArtifactFormat,
  type WcmArtifactSource,
} from '@/lib/wcmArtifacts';

/** Canonical artifact filename (Word / PDF). No plain-text distribution. */
export const documentFileName = (
  doc: WcmArtifactSource,
  state: ResolvedState,
  format: WcmArtifactFormat = 'pdf',
) => artifactFileName(doc, state, format);

export const documentDeepLink = (projectId: string, documentId: string) =>
  `${window.location.origin}/wcm/${projectId}?tab=documents&document=${encodeURIComponent(
    documentId,
  )}`;

export type ShareOutcome =
  | { kind: 'file'; format: WcmArtifactFormat }
  | { kind: 'link' }
  | { kind: 'whatsapp' }
  | { kind: 'cancelled' }
  | { kind: 'error'; message: string };

type ShareNavigator = Navigator & {
  canShare?: (data?: ShareData) => boolean;
  share?: (data: ShareData) => Promise<void>;
};

/** Pure decision helper: which artifact should be attached, if any. */
export const preferredShareFormat = (
  available: WcmArtifactFormat[],
): WcmArtifactFormat | null =>
  available.includes('pdf') ? 'pdf' : available.includes('docx') ? 'docx' : null;

const toFile = (artifact: WcmArtifact) =>
  new File([artifact.blob], artifact.filename, { type: MIME[artifact.format] });

/**
 * Web Share L2 with a real Word/PDF artifact when the platform allows it,
 * otherwise share the in-app deep link, otherwise WhatsApp.
 */
export const shareDocument = async (
  doc: { title: string; document_id: string },
  projectId: string,
  options: {
    /** Lazily builds an artifact; omitted when no artifact can be produced. */
    buildArtifact?: (format: WcmArtifactFormat) => Promise<WcmArtifact>;
    availableFormats?: WcmArtifactFormat[];
  } = {},
): Promise<ShareOutcome> => {
  const url = documentDeepLink(projectId, doc.document_id);
  const nav = navigator as ShareNavigator;
  const format = preferredShareFormat(options.availableFormats ?? []);

  if (format && options.buildArtifact && nav.share && nav.canShare) {
    try {
      const file = toFile(await options.buildArtifact(format));
      if (nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: doc.title, text: doc.title });
        return { kind: 'file', format };
      }
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return { kind: 'cancelled' };
      // fall through to link sharing
    }
  }

  if (nav.share) {
    try {
      await nav.share({ title: doc.title, text: doc.title, url });
      return { kind: 'link' };
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return { kind: 'cancelled' };
    }
  }

  const wa = `https://wa.me/?text=${encodeURIComponent(`${doc.title}\n${url}`)}`;
  const win = window.open(wa, '_blank', 'noopener,noreferrer');
  if (!win) return { kind: 'error', message: 'Impossibile aprire WhatsApp.' };
  return { kind: 'whatsapp' };
};
