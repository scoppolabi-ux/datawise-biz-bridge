import { useQuery } from '@tanstack/react-query';
import {
  MANIFEST_PATH,
  assetUrl,
  parseManifest,
  type WcmReleaseManifest,
} from '@/components/wcm/wcmDocumentation';
import { supabase } from '@/integrations/supabase/client';
import {
  BOOK_LIVE_SCHEME,
  BOOK_PUBLICATION_PROJECT_ID,
  mergeBookPublicationOverlay,
  publicationOverlayFromReadModel,
  type BookPublicationReadModelRow,
} from '@/lib/wcmArtifacts/bookPublication';

/**
 * Static release + deterministic book projection.
 *
 * Manuals and historical binary artifacts remain static build artifacts.
 * Completed book chapters are overlaid from the Supabase read-model written
 * directly by WCM-LAB GitHub Actions through the existing OIDC projector.
 * No Lovable edit is required for ordinary chapter publication.
 */
export const useWcmDocumentationManifest = () =>
  useQuery<WcmReleaseManifest>({
    queryKey: ['wcm-documentation-manifest'],
    staleTime: 30_000,
    refetchInterval: 30_000,
    retry: false,
    queryFn: async () => {
      const response = await fetch(assetUrl(MANIFEST_PATH), { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Manifest non disponibile (${response.status})`);
      const manifest = parseManifest(await response.json());
      if (!manifest) throw new Error('Manifest della documentazione non valido');

      const { data, error } = await supabase
        .from('wcm_project_documents')
        .select(
          'document_id,title,category,status,version,source_url,source_sha,content_markdown,distribution_ready,sort_order,updated_at',
        )
        .eq('project_id', BOOK_PUBLICATION_PROJECT_ID)
        .order('sort_order', { ascending: true });

      if (error) return manifest;
      const book = manifest.books.find((item) => item.book_id === 'wcm-process-memory-book');
      if (!book) return manifest;
      const overlay = publicationOverlayFromReadModel(
        (data ?? []) as unknown as BookPublicationReadModelRow[],
        book.index_source_path,
        book.index_source_sha,
      );
      return overlay ? mergeBookPublicationOverlay(manifest, overlay) : manifest;
    },
  });

/** Markdown snapshot from either a static release asset or the live book read-model. */
export const useWcmDocumentationSnapshot = (markdownPath: string | null) =>
  useQuery<string>({
    queryKey: ['wcm-documentation-snapshot', markdownPath],
    enabled: Boolean(markdownPath),
    staleTime: 30_000,
    refetchInterval: markdownPath?.startsWith(BOOK_LIVE_SCHEME) ? 30_000 : false,
    retry: false,
    queryFn: async () => {
      if ((markdownPath as string).startsWith(BOOK_LIVE_SCHEME)) {
        const documentId = decodeURIComponent((markdownPath as string).slice(BOOK_LIVE_SCHEME.length));
        const { data, error } = await supabase
          .from('wcm_project_documents')
          .select('content_markdown')
          .eq('project_id', BOOK_PUBLICATION_PROJECT_ID)
          .eq('document_id', documentId)
          .maybeSingle();

        if (error || !data?.content_markdown?.trim()) {
          throw new Error('Snapshot live del capitolo non disponibile');
        }
        return data.content_markdown;
      }

      const response = await fetch(assetUrl(markdownPath as string), { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Snapshot non disponibile (${response.status})`);
      const text = await response.text();
      if (!text.trim()) throw new Error('Snapshot vuoto');
      return text;
    },
  });
