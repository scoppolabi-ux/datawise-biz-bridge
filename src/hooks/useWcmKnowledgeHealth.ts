import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Knowledge Health is an OBSERVATION read-model (DEC-007 / CONCEPT-011).
 * GitHub main stays the source of truth: nothing here is editable from the UI.
 */
export type WcmHealthStatus = 'HEALTHY' | 'DEGRADED' | 'STALE' | 'CRITICAL' | 'UNKNOWN';

export type WcmKnowledgeHealth = {
  id: string;
  project_id: string;
  health_status: string;
  knowledge_integrity_score: number | null;
  score_method: string | null;
  checked_at: string | null;
  last_reconciliation_at: string | null;
  last_material_delta_at: string | null;
  components: Record<string, unknown> | null;
  metrics: Record<string, unknown> | null;
  issues: unknown;
  checkpoint: Record<string, unknown> | null;
  source_path: string | null;
  source_sha: string | null;
  notes: string | null;
  /** V0.7 — ultimo ciclo del Knowledge Steward (observation-only). */
  steward_activity?: WcmStewardActivity | null;
  /** V0.7 — storico bounded dei cicli recenti. */
  steward_activity_history?: WcmStewardActivity[] | null;
  updated_at: string;
};

/** Evento di attività del Knowledge Steward, proiettato da GitHub. */
export type WcmStewardActivity = {
  activity_id?: string | null;
  occurred_at?: string | null;
  trigger?: string | null;
  run_id?: string | null;
  run_url?: string | null;
  source_sha?: string | null;
  engine?: string | null;
  authority?: string | null;
  classification?: string | null;
  pre_health_status?: string | null;
  pre_score?: number | null;
  repairs_attempted?: unknown;
  repairs_applied?: unknown;
  files_changed?: unknown;
  escalations?: unknown;
  post_health_status?: string | null;
  post_score?: number | null;
  alert_disposition?: string | null;
  [key: string]: unknown;
};

export type WcmKnowledgeCheckpoint = {
  id: string;
  project_id: string;
  checkpoint_id: string;
  label: string;
  occurred_at: string | null;
  health_status: string | null;
  knowledge_integrity_score: number | null;
  metrics: Record<string, unknown> | null;
  note: string | null;
  source_path: string | null;
  source_sha: string | null;
  sort_order: number;
  updated_at: string;
};

const REFETCH = 30_000;

export const useWcmKnowledgeHealth = (projectId: string | undefined) =>
  useQuery({
    queryKey: ['wcm-knowledge-health', projectId],
    enabled: Boolean(projectId),
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmKnowledgeHealth | null> => {
      const { data, error } = await supabase
        .from('wcm_project_knowledge_health')
        .select('*')
        .eq('project_id', projectId!)
        .maybeSingle();

      if (error) throw error;
      return (data ?? null) as unknown as WcmKnowledgeHealth | null;
    },
  });

export const useWcmKnowledgeCheckpoints = (projectId: string | undefined) =>
  useQuery({
    queryKey: ['wcm-knowledge-checkpoints', projectId],
    enabled: Boolean(projectId),
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmKnowledgeCheckpoint[]> => {
      const { data, error } = await supabase
        .from('wcm_project_knowledge_checkpoints')
        .select('*')
        .eq('project_id', projectId!)
        .order('occurred_at', { ascending: false, nullsFirst: false })
        .order('sort_order', { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as WcmKnowledgeCheckpoint[];
    },
  });

/** Knowledge Health for every project — one query for portfolio views. */
export const useWcmKnowledgeHealthAll = () =>
  useQuery({
    queryKey: ['wcm-knowledge-health'],
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmKnowledgeHealth[]> => {
      const { data, error } = await supabase.from('wcm_project_knowledge_health').select('*');
      if (error) throw error;
      return (data ?? []) as unknown as WcmKnowledgeHealth[];
    },
  });
