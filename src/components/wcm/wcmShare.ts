import type { WcmProjectDocument } from '@/hooks/useWcmProjects';
import { governanceBadgeOf, type ResolvedState } from './wcmCanonicalState';

/** Safe, portable filename derived from title (+ version, + governance marker). */
export const documentFileName = (
  doc: {
    title: string;
    version?: string | null;
    document_id: string;
    distribution_ready?: boolean;
  },
  state: ResolvedState,
) => {
  const base = (doc.title || doc.document_id)
    .normalize('NFKD')
    .replace(/[^\w\s.-]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-|-$/g, '');
  const version = doc.version ? `-v${String(doc.version).replace(/[^\w.-]+/g, '')}` : '';
  const badge = governanceBadgeOf({ distribution_ready: doc.distribution_ready ?? true }, state);
  const marker =
    badge === 'UNAPPROVED' ? '-UNAPPROVED' : badge === 'UNCLASSIFIED' ? '-DA-CLASSIFICARE' : '';
  return `${base || 'documento'}${version}${marker}.txt`;
};

export const documentDeepLink = (projectId: string, documentId: string) =>
  `${window.location.origin}/wcm/${projectId}?tab=documents&document=${encodeURIComponent(
    documentId,
  )}`;

const textFile = (doc: WcmProjectDocument, state: ResolvedState) =>
  new File([doc.content_markdown ?? ''], documentFileName(doc, state), {
    type: 'text/plain;charset=utf-8',
  });

export const downloadDocument = (doc: WcmProjectDocument, state: ResolvedState) => {
  const blob = new Blob([doc.content_markdown ?? ''], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = documentFileName(doc, state);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export type ShareOutcome =
  | { kind: 'file' }
  | { kind: 'link' }
  | { kind: 'whatsapp' }
  | { kind: 'cancelled' }
  | { kind: 'error'; message: string };

/**
 * Level 2 Web Share (real .txt file) first, then link share, then WhatsApp deep link.
 */
export const shareDocument = async (
  doc: WcmProjectDocument,
  projectId: string,
  state: ResolvedState,
): Promise<ShareOutcome> => {
  const url = documentDeepLink(projectId, doc.document_id);
  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };

  if (doc.content_markdown && nav.share && nav.canShare) {
    try {
      const file = textFile(doc, state);
      if (nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: doc.title, text: doc.title });
        return { kind: 'file' };
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
