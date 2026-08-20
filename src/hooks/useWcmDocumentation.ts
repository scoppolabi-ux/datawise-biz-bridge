import { useQuery } from '@tanstack/react-query';
import {
  MANIFEST_PATH,
  assetUrl,
  parseManifest,
  type WcmReleaseManifest,
} from '@/components/wcm/wcmDocumentation';

/** Static build-time release manifest (read-only, no backend involved). */
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
      return manifest;
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
