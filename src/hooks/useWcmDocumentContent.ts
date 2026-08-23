import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { validateSourcePath } from '../../supabase/functions/_shared/wcmSourcePath';

/**
 * Fallback di lettura: GitHub WCM-LAB resta source of truth, Supabase read model.
 * Se `content_markdown` è vuoto e il `source_path` è valido, il contenuto viene
 * recuperato server-side dalla edge function `wcm-document-content`.
 */
export const canFetchSourceContent = (
  projectId: string | null | undefined,
  doc: { content_markdown: string | null; source_path: string | null } | null | undefined,
): boolean => {
  if (!doc) return false;
  if ((doc.content_markdown ?? '').trim() !== '') return false;
  return validateSourcePath(projectId ?? '', doc.source_path ?? '').ok;
};

export const useWcmDocumentContent = (
  projectId: string | null | undefined,
  doc: { content_markdown: string | null; source_path: string | null } | null | undefined,
) => {
  const enabled = canFetchSourceContent(projectId, doc);
  return useQuery({
    queryKey: ['wcm-document-content', projectId, doc?.source_path],
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
    queryFn: async (): Promise<string> => {
      const { data, error } = await supabase.functions.invoke('wcm-document-content', {
        body: { project_id: projectId, source_path: doc?.source_path },
      });
      if (error) {
        let message = error.message;
        const ctx = (error as { context?: Response }).context;
        if (ctx && typeof ctx.json === 'function') {
          try {
            const payload = await ctx.json();
            if (payload?.error) message = String(payload.error);
          } catch {
            /* mantieni il messaggio originale */
          }
        }
        throw new Error(message);
      }
      const content = (data as { content_markdown?: string } | null)?.content_markdown ?? '';
      if (content.trim() === '') throw new Error('Sorgente GitHub vuoto');
      return content;
    },
  });
};
