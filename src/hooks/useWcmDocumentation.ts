import { useQuery } from '@tanstack/react-query';
import {
  MANIFEST_PATH,
  assetUrl,
  parseManifest,
  type WcmReleaseManifest,
} from '@/components/wcm/wcmDocumentation';
import {
  BOOK_PUBLICATION_OVERLAY_URL,
  mergeBookPublicationOverlay,
  parseBookPublicationOverlay,
} from '@/lib/wcmArtifacts/bookPublication';

/**
 * Static build-time release manifest plus a deterministic live overlay for the
 * Process & Memory Book. The overlay is read directly from WCM-LAB/main, so a
 * newly completed chapter does not require an application edit or Lovable run.
 */
export const useWcmDocumentationManifest = () =>
  useQuery<WcmReleaseManifest>({
    queryKey: ['wcm-documentation-manifest'],
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async () => {
      const response = await fetch(assetUrl(MANIFEST_PATH), { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Manifest non disponibile (${response.status})`);
      const manifest = parseManifest(await response.json());
      if (!manifest) throw new Error('Manifest della documentazione non valido');

      try {
        const overlayResponse = await fetch(BOOK_PUBLICATION_OVERLAY_URL, { cache: 'no-cache' });
        if (!overlayResponse.ok) return manifest;
        const overlay = parseBookPublicationOverlay(await overlayResponse.json());
        return overlay ? mergeBookPublicationOverlay(manifest, overlay) : manifest;
      } catch {
        // Fail-safe: the last coherent static release remains readable if the
        // live WCM-LAB projection is temporarily unavailable.
        return manifest;
      }
    },
  });

/** Markdown snapshot of the same release the downloads come from. */
export const useWcmDocumentationSnapshot = (markdownPath: string | null) =>
  useQuery<string>({
    queryKey: ['wcm-documentation-snapshot', markdownPath],
    enabled: Boolean(markdownPath),
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async () => {
      const response = await fetch(assetUrl(markdownPath as string), { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Snapshot non disponibile (${response.status})`);
      const text = await response.text();
      if (!text.trim()) throw new Error('Snapshot vuoto');
      return text;
    },
  });
