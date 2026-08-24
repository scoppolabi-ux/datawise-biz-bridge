import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * WCM Learning V0.8 — GLOBAL method learning read-model (observation only).
 * GitHub main stays the source of truth: nothing here is editable from the UI.
 */

export type WcmMethodLearningHealth = {
  id: string;
  system_id: string;
  checked_at: string | null;
  health_status: string;
  method_integrity_score: number | null;
  score_method: string | null;
  last_material_method_delta_sha: string | null;
  last_material_method_delta_at: string | null;
  components: Record<string, unknown> | null;
  metrics: Record<string, unknown> | null;
  issues: unknown;
  source_path: string | null;
  source_sha: string | null;
  updated_at: string;
};

export type WcmLearningRecord = {
  id: string;
  learning_id: string;
  title: string;
  status: string | null;
  record_path: string | null;
  origin_created_at: string | null;
  last_reviewed_at: string | null;
  /** Semantic promotion instant, supplied by GitHub source only. */
  promoted_at: string | null;
  confidence: string | null;
  generalizability: string | null;
  origin_refs: unknown;
  promoted_to: unknown;
  revisit_trigger: string | null;
  sort_order: number;
  updated_at: string;
};

/**
 * Global Method Change Gate (read-model). Gates exist ONLY when the GitHub
 * source projects an explicit structured gate object — the app never infers
 * authority requirements from a learning status such as VALIDATED.
 */
export type WcmMethodChangeGate = {
  id: string;
  gate_id: string;
  gate_type: string;
  learning_id: string | null;
  title: string;
  status: string;
  authority_required: string | null;
  procedure_refs: unknown;
  impact_preview_refs: unknown;
  opened_at: string | null;
  decided_at: string | null;
  decided_by: string | null;
  source_path: string | null;
  source_sha: string | null;
  /** Explicit integer revision: the ONLY optimistic-concurrency authority. */
  revision: number;
  sort_order: number;
  updated_at: string;
};

export type WcmLearningEvidence = {
  id: string;
  event_id: string;
  detected_at: string | null;
  source_sha: string | null;
  source_committed_at: string | null;
  source_type: string | null;
  summary: string | null;
  changed_paths: unknown;
  review_status: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  linked_learning_ids: unknown;
  repair_evidence_sha: string | null;
  sort_order: number;
  updated_at: string;
};

export type WcmMethodRelation = {
  id: string;
  relation_id: string;
  source_node: string | null;
  relation_type: string | null;
  target_node: string | null;
  status: string | null;
  rationale: string | null;
  evidence_refs: unknown;
  last_verified_at: string | null;
  sort_order: number;
  updated_at: string;
};

const REFETCH = 30_000;

const table = (name: string) => supabase.from(name as never);

export const useWcmMethodLearningHealth = () =>
  useQuery({
    queryKey: ['wcm-method-learning-health'],
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmMethodLearningHealth | null> => {
      const { data, error } = await table('wcm_method_learning_health')
        .select('*')
        .eq('system_id', 'wcm')
        .maybeSingle();
      if (error) throw error;
      return (data as WcmMethodLearningHealth | null) ?? null;
    },
  });

export const useWcmLearningRecords = () =>
  useQuery({
    queryKey: ['wcm-method-learning-records'],
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmLearningRecord[]> => {
      const { data, error } = await table('wcm_method_learning_records')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as WcmLearningRecord[];
    },
  });

export const useWcmLearningEvidence = () =>
  useQuery({
    queryKey: ['wcm-method-learning-evidence'],
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmLearningEvidence[]> => {
      const { data, error } = await table('wcm_method_learning_evidence')
        .select('*')
        .order('detected_at', { ascending: false, nullsFirst: false })
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as WcmLearningEvidence[];
    },
  });

export const useWcmMethodRelations = () =>
  useQuery({
    queryKey: ['wcm-method-learning-relations'],
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmMethodRelation[]> => {
      const { data, error } = await table('wcm_method_learning_relations')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as WcmMethodRelation[];
    },
  });

/** Global Method Change Gates — read-only observation, exact statuses. */
export const useWcmMethodChangeGates = () =>
  useQuery({
    queryKey: ['wcm-method-change-gates'],
    refetchInterval: REFETCH,
    queryFn: async (): Promise<WcmMethodChangeGate[]> => {
      const { data, error } = await table('wcm_method_change_gates')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as WcmMethodChangeGate[];
    },
  });

/** Numeric metric read from the projected metrics object; null when not projected. */
export const learningMetric = (
  source: unknown,
  ...keys: string[]
): number | null => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return null;
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
};

export const asStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((v) => (typeof v === 'string' ? v : JSON.stringify(v)));
};
