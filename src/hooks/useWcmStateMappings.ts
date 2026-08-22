import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  buildMappingIndex,
  resolveCanonicalState,
  type CanonicalState,
  type ResolvedState,
  type StateInput,
  type WcmStateMapping,
} from '@/components/wcm/wcmCanonicalState';

const QUERY_KEY = ['wcm-document-state-mappings'];

/** Read-model of the exact category+status → canonical state decisions. */
export const useWcmStateMappings = () =>
  useQuery({
    queryKey: QUERY_KEY,
    staleTime: 60_000,
    queryFn: async (): Promise<WcmStateMapping[]> => {
      const { data, error } = await supabase
        .from('wcm_document_state_mappings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as WcmStateMapping[];
    },
  });

/** Index of ACTIVE mappings; PENDING proposals never influence the UI. */
export const useCanonicalStateIndex = () => {
  const query = useWcmStateMappings();
  const index = useMemo(() => buildMappingIndex(query.data ?? []), [query.data]);
  return { ...query, index };
};

export const useCanonicalState = (doc: StateInput | null | undefined): ResolvedState => {
  const { index } = useCanonicalStateIndex();
  if (!doc) return 'UNKNOWN';
  return resolveCanonicalState(doc, index);
};

export type StateDecision =
  | {
      kind: 'MAP';
      category: string | null;
      status: string | null;
      canonical_state: CanonicalState;
      reason: string;
      confidence: string | null;
    }
  | {
      kind: 'PROPOSE';
      category: string | null;
      status: string | null;
      proposed_state: string;
      reason: string;
    };

/**
 * Stefano's decision. A MAP decision activates an existing canonical state.
 * A PROPOSE decision stays PENDING and never creates a canonical category.
 */
export const useSubmitStateDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (decision: StateDecision) => {
      const { data: auth } = await supabase.auth.getUser();
      const base = {
        category: (decision.category ?? '').trim().toUpperCase() || 'UNSPECIFIED',
        status: (decision.status ?? '').trim().toUpperCase() || 'UNSPECIFIED',
        reason: decision.reason || null,
        decided_by: auth.user?.id ?? null,
        decided_by_email: auth.user?.email ?? null,
      };

      const row =
        decision.kind === 'MAP'
          ? {
              ...base,
              canonical_state: decision.canonical_state,
              proposed_state: null,
              mapping_status: 'ACTIVE',
              confidence: decision.confidence,
            }
          : {
              ...base,
              canonical_state: null,
              proposed_state: decision.proposed_state.trim().toUpperCase(),
              mapping_status: 'PENDING',
              confidence: null,
            };

      const { error } = await supabase.from('wcm_document_state_mappings').insert(row);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};
