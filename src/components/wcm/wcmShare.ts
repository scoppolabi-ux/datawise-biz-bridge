import type { WcmProjectDocument } from '@/hooks/useWcmProjects';
import { isApprovedDocument } from './wcmFormat';

/** Safe, portable filename derived from title (+ version, + approval marker). */
export const documentFileName = (doc: {
  title: string;
  version?: string | null;
  document_id: string;
  status?: string | null;
  category?: string | null;
}) => {
  const base = (doc.title || doc.document_id)
    .normalize('NFKD')
    .replace(/[^\w\s.-]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-|-$/g, '');
  const version = doc.version ? `-v${String(doc.version).replace(/[^\w.-]+/g, '')}` : '';
  const approved = isApprovedDocument({
    status: doc.status ?? null,
    category: doc.category ?? null,
  });
  const marker = approved ? '' : '-UNAPPROVED';
  return `${base || 'documento'}${version}${marker}.txt`;
};

export const documentDeepLink = (projectId: string, documentId: string) =>
  `${window.location.origin}/wcm/${projectId}?tab=documents&document=${encodeURIComponent(
    documentId,
  )}`;

const textFile = (doc: WcmProjectDocument) =>
  new File([doc.content_markdown ?? ''], documentFileName(doc), {
    type: 'text/plain;charset=utf-8',
  });

export const downloadDocument = (doc: WcmProjectDocument) => {
  const blob = new Blob([doc.content_markdown ?? ''], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = documentFileName(doc);
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
): Promise<ShareOutcome> => {
  const url = documentDeepLink(projectId, doc.document_id);
  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };

  if (doc.content_markdown && nav.share && nav.canShare) {
    try {
      const file = textFile(doc);
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
