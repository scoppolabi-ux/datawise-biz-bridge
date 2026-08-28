import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * WCM Technical Issue Tracking V1 (read-only).
 * GitHub main is the source of truth; the browser never writes back.
 */
export type WcmTechnicalIssue = {
  id: string;
  project_id: string;
  issue_id: string;
  issue_type: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  blocking: boolean;
  detected_by: string;
  detected_at: string;
  error_code: string;
  detail: string;
  source_path: string;
  source_sha: string;
  opened_at: string;
  closed_at: string | null;
  closed_by: string | null;
  resolution_note: string | null;
  updated_at: string;
};

/** OPEN first, then most recently detected. */
export const useWcmTechnicalIssues = () =>
  useQuery({
    queryKey: ['wcm-technical-issues'],
    refetchInterval: 30_000,
    queryFn: async (): Promise<WcmTechnicalIssue[]> => {
      const { data, error } = await supabase
        .from('wcm_project_technical_issues')
        .select('*')
        .order('status', { ascending: true }) // CLOSED < OPEN alphabetically
        .order('detected_at', { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as unknown as WcmTechnicalIssue[];
      return [...rows].sort((a, b) => {
        if (a.status !== b.status) return a.status === 'OPEN' ? -1 : 1;
        return b.detected_at.localeCompare(a.detected_at);
      });
    },
  });
