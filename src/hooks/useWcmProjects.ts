import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type WcmProjectStatus = {
  id: string;
  project_id: string;
  project_name: string;
  status: string;
  short_description: string | null;
  phase: string | null;

  summary: string | null;
  current_focus: string | null;
  next_action: string | null;
  needs_stefano: boolean;
  board_gate_reason: string | null;
  board_gate_action_requested: string | null;
  board_verdict: string | null;
  board_narrative_mass: string | null;
  board_review_summary: string | null;
  progress_summary: string | null;
  documents_to_read_count: number;
  repo_url: string | null;
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

export type WcmProjectDocument = {
  id: string;
  project_id: string;
  document_id: string;
  title: string;
  category: string | null;
  status: string | null;
  version: string | null;
  source_path: string | null;
  source_url: string | null;
  source_sha: string | null;
  content_markdown: string | null;
  requires_stefano: boolean;
  sort_order: number;
  updated_at: string;
};

export type WcmProjectActivity = {
  id: string;
  project_id: string;
  event_id: string;
  occurred_at: string | null;
  event_type: string | null;
  title: string;
  description: string | null;
  source_path: string | null;
  source_sha: string | null;
  sort_order: number;
};

export type WcmProjectRoadmapItem = {
  id: string;
  project_id: string;
  item_id: string;
  label: string;
  item_type: string | null;
  status: string | null;
  sequence: number;
  parent_id: string | null;
  related_document_id: string | null;
  source_path: string | null;
  notes: string | null;
};

const REFETCH = 60_000;

/**
 * Single data entry point for Mission Control.
 * Supabase is the read-model; GitHub stays the source of truth and only
 * the Projector edge function writes into these tables.
 */
export const useWcmProjects = (enabled = true) =>
  useQuery({
    queryKey: ['wcm-project-status'],
    enabled,
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmProjectStatus[]> => {
      const { data, error } = await supabase
        .from('wcm_project_status')
        .select('*')
        .order('needs_stefano', { ascending: false })
        .order('project_name', { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as WcmProjectStatus[];
    },
  });

export const useWcmProject = (projectId: string | undefined) =>
  useQuery({
    queryKey: ['wcm-project-status', projectId],
    enabled: Boolean(projectId),
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmProjectStatus | null> => {
      const { data, error } = await supabase
        .from('wcm_project_status')
        .select('*')
        .eq('project_id', projectId!)
        .maybeSingle();

      if (error) throw error;
      return (data ?? null) as unknown as WcmProjectStatus | null;
    },
  });

export const useWcmDocuments = (projectId: string | undefined) =>
  useQuery({
    queryKey: ['wcm-project-documents', projectId],
    enabled: Boolean(projectId),
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmProjectDocument[]> => {
      const { data, error } = await supabase
        .from('wcm_project_documents')
        .select('*')
        .eq('project_id', projectId!)
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as WcmProjectDocument[];
    },
  });

export const useWcmActivity = (projectId: string | undefined) =>
  useQuery({
    queryKey: ['wcm-project-activity', projectId],
    enabled: Boolean(projectId),
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmProjectActivity[]> => {
      const { data, error } = await supabase
        .from('wcm_project_activity')
        .select('*')
        .eq('project_id', projectId!)
        .order('occurred_at', { ascending: false, nullsFirst: false })
        .order('sort_order', { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as WcmProjectActivity[];
    },
  });

export const useWcmRoadmap = (projectId: string | undefined) =>
  useQuery({
    queryKey: ['wcm-project-roadmap', projectId],
    enabled: Boolean(projectId),
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmProjectRoadmapItem[]> => {
      const { data, error } = await supabase
        .from('wcm_project_roadmap')
        .select('*')
        .eq('project_id', projectId!)
        .order('sequence', { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as WcmProjectRoadmapItem[];
    },
  });

/** Counts of documents per read-state, used for the summary card. */
export const useWcmDocumentCounts = (projectId: string | undefined) => {
  const query = useWcmDocuments(projectId);
  const docs = query.data ?? [];
  return {
    ...query,
    toRead: docs.filter((d) => d.requires_stefano).length,
    total: docs.length,
  };
};
