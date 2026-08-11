import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type WcmProjectStatus = {
  id: string;
  project_id: string;
  project_name: string;
  status: string;
  phase: string | null;
  summary: string | null;
  current_focus: string | null;
  next_action: string | null;
  needs_stefano: boolean;
  board_gate_reason: string | null;
  board_gate_action_requested: string | null;
  blocker: string | null;
  heartbeat_cadence: string | null;
  heartbeat_last_run_at: string | null;
  heartbeat_last_outcome: string | null;
  last_material_activity_at: string | null;
  last_material_activity: string | null;
  notes: string | null;
  source: string | null;
  updated_at: string;
};

/**
 * Single data entry point for Mission Control.
 * Today it reads from the database; a future GitHub -> DB bridge
 * will only need to write to the same table.
 */
export const useWcmProjects = (enabled: boolean) =>
  useQuery({
    queryKey: ['wcm-project-status'],
    enabled,
    refetchInterval: 60_000,
    queryFn: async (): Promise<WcmProjectStatus[]> => {
      const { data, error } = await supabase
        .from('wcm_project_status')
        .select('*')
        .order('needs_stefano', { ascending: false })
        .order('project_name', { ascending: true });

      if (error) throw error;
      return (data ?? []) as WcmProjectStatus[];
    },
  });
