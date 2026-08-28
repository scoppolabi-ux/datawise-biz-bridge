import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * GLOBAL WCM System Maintenance Log (read-only).
 * GitHub main is the source of truth; Supabase is a rebuildable read-model
 * and the browser never writes back.
 */
export type WcmSystemMaintenanceEntry = {
  id: string;
  event_id: string;
  occurred_on: string | null;
  event_type: string | null;
  title: string;
  description: string | null;
  technical_label: string | null;
  status: string | null;
  authority: string | null;
  manifest_path: string | null;
  scope: string;
  schema_version: string | null;
  language_policy: string | null;
  source_path: string | null;
  source_sha: string | null;
  sort_order: number;
  updated_at: string;
};

export const useWcmSystemMaintenanceLog = () =>
  useQuery({
    queryKey: ['wcm-system-maintenance-log'],
    refetchInterval: 30_000,
    queryFn: async (): Promise<WcmSystemMaintenanceEntry[]> => {
      const { data, error } = await supabase
        .from('wcm_system_maintenance_log')
        .select('*')
        .order('occurred_on', { ascending: false, nullsFirst: false })
        .order('sort_order', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as WcmSystemMaintenanceEntry[];
    },
  });
