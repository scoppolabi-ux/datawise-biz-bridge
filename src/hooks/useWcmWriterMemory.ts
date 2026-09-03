import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Writer Memory — read-model project-scoped, sola lettura.
 * GitHub/WCM main resta source of truth: nessun write-back dal browser.
 */
export type WcmWriterMemoryStatus = 'ACTIVE' | 'SUPERSEDED' | 'CLOSED';

export type WcmWriterMemory = {
  id: string;
  project_id: string;
  memory_id: string;
  scope: string;
  category: string | null;
  guidance: string;
  origin_type: string | null;
  origin_ref: string | null;
  origin_context: string | null;
  status: string;
  source_path: string | null;
  source_sha: string | null;
  sort_order: number;
  updated_at: string;
};

const TABLE = 'wcm_project_writer_memory';

export const useWcmWriterMemory = (projectId: string | undefined) =>
  useQuery({
    queryKey: ['wcm-writer-memory', projectId],
    enabled: Boolean(projectId),
    refetchInterval: 30_000,
    queryFn: async (): Promise<WcmWriterMemory[]> => {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('project_id', projectId!)
        .order('sort_order', { ascending: true })
        .order('memory_id', { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as WcmWriterMemory[];
    },
  });
