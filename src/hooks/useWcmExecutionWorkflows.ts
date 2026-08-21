import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * DEC-012 — Session-Independent Workflow Execution.
 * Read-model only: GitHub main resta source of truth, nessun write-back dal browser.
 */
export type WcmExecutionWorkflowStatus =
  | 'ACTIVE'
  | 'INTERRUPTED_RESUMABLE'
  | 'WAITING_AUTHORITY'
  | 'BLOCKED'
  | 'COMPLETED'
  | 'CANCELLED';

export type WcmExecutionWorkflow = {
  id: string;
  project_id: string;
  workflow_instance_id: string;
  workflow: string;
  status: string;
  authority_refs: unknown;
  scope: string | null;
  last_completed_transition: string | null;
  next_transition: string | null;
  true_stop_condition: string;
  started_at: string | null;
  last_checkpoint_at: string | null;
  resume_required: boolean;
  interruption_type: string | null;
  interruption_reason: string | null;
  interruption_evidence: unknown;
  completed_step_ids: unknown;
  completion_gate: Record<string, unknown> | null;
  source_path: string | null;
  source_sha: string | null;
  sort_order: number;
  updated_at: string;
};

const REFETCH = 30_000;
const TABLE = 'wcm_project_execution_workflows';

export const useWcmExecutionWorkflows = (projectId: string | undefined) =>
  useQuery({
    queryKey: ['wcm-execution-workflows', projectId],
    enabled: Boolean(projectId),
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmExecutionWorkflow[]> => {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('project_id', projectId!)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as WcmExecutionWorkflow[];
    },
  });

/** Tutti i workflow del portfolio — una sola query, nessun N+1. */
export const useWcmExecutionWorkflowsAll = () =>
  useQuery({
    queryKey: ['wcm-execution-workflows'],
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmExecutionWorkflow[]> => {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('project_id', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as WcmExecutionWorkflow[];
    },
  });
