import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  ACTIVE_COMMAND_STATUSES,
  type WcmCommandRequest,
} from '@/hooks/useWcmCommands';
import {
  latestMethodCommandByGate,
  hasActiveMethodCommand,
  useWcmMethodCommands,
  type WcmMethodCommandRequest,
} from '@/hooks/useWcmMethodCommands';
import { isOpenNeed, useWcmNeeds, type WcmProjectNeed } from '@/hooks/useWcmProjects';
import { useWcmMethodChangeGates } from '@/hooks/useWcmMethodLearning';
import { useCanonicalStateIndex } from '@/hooks/useWcmStateMappings';
import { resolveCanonicalState } from '@/components/wcm/wcmCanonicalState';
import { isOpenGate } from '@/components/wcm/wcmLearningLifecycle';
import { methodGateToNeed, WCM_CHANGE_GATE } from '@/components/wcm/wcmMethodGateNeeds';

export type DerivedNeedState = 'NEEDS_STEFANO' | 'PENDING_SYSTEM';

export type ClassifiedNeed = {
  need: WcmProjectNeed;
  derived: DerivedNeedState;
  latestCommand: WcmCommandRequest | null;
  /**
   * Latest GLOBAL method command for WCM_CHANGE_GATE needs (separate domain
   * from project commands; never mixed into latestCommand).
   */
  latestMethodCommand?: WcmMethodCommandRequest | null;
  /**
   * Derived in the UI (unmapped document state or global method change gate):
   * never written to wcm_project_needs, never routed to the command surface.
   */
  virtual?: boolean;
};

/** All governance commands (owner/admin RLS, read-only). */
export const useWcmAllCommands = () =>
  useQuery({
    queryKey: ['wcm-command-requests', 'all'],
    refetchInterval: 20_000,
    queryFn: async (): Promise<WcmCommandRequest[]> => {
      const { data, error } = await supabase
        .from('wcm_command_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as WcmCommandRequest[];
    },
  });

type MinimalDoc = {
  project_id: string;
  document_id: string;
  title: string;
  category: string | null;
  status: string | null;
};

/** Minimal projection of every document, used to detect unmapped states. */
export const useWcmAllDocumentStates = () =>
  useQuery({
    queryKey: ['wcm-project-documents', 'states'],
    refetchInterval: 30_000,
    queryFn: async (): Promise<MinimalDoc[]> => {
      const { data, error } = await supabase
        .from('wcm_project_documents')
        .select('project_id, document_id, title, category, status');

      if (error) throw error;
      return (data ?? []) as unknown as MinimalDoc[];
    },
  });

export const needKey = (projectId: string, needId: string) => `${projectId}::${needId}`;

/** Human-attention badge label for a classified need. */
export const derivedBadge = (item: ClassifiedNeed) => {
  if (item.need.need_type === WCM_CHANGE_GATE) {
    if (item.derived === 'PENDING_SYSTEM') {
      return item.latestMethodCommand?.status === 'RECORDED'
        ? 'AUTORITÀ REGISTRATA · IN ATTESA WCM'
        : 'DECISIONE INVIATA · IN ATTESA';
    }
    return 'AUTORITÀ RICHIESTA';
  }
  if (item.virtual) return 'STATO DA CLASSIFICARE';
  if (item.derived === 'NEEDS_STEFANO') return 'ACTION REQUIRED';
  return item.latestCommand?.status === 'RECORDED'
    ? 'AUTHORITY RECORDED · PENDING WCM'
    : 'DECISION SUBMITTED · PENDING';
};

/**
 * Human attention vs workflow state.
 * A currently-OPEN need covered by an active command (SUBMITTED/CLAIMED/RECORDED)
 * is pending machine execution; anything else (no command, or terminal
 * STALE/FAILED/REJECTED as latest) requires a new human decision.
 * Commands whose need is no longer in the snapshot are ignored entirely.
 */
export const useWcmNeedStates = () => {
  const needsQuery = useWcmNeeds();
  const commandsQuery = useWcmAllCommands();
  const docsQuery = useWcmAllDocumentStates();
  const gatesQuery = useWcmMethodChangeGates();
  const methodCommandsQuery = useWcmMethodCommands();
  const { index } = useCanonicalStateIndex();

  const isLoading =
    needsQuery.isLoading ||
    commandsQuery.isLoading ||
    gatesQuery.isLoading ||
    methodCommandsQuery.isLoading;
  const error =
    needsQuery.error ?? commandsQuery.error ?? gatesQuery.error ?? methodCommandsQuery.error;
  const ready = Boolean(needsQuery.data && commandsQuery.data && gatesQuery.data);

  const openNeeds = (needsQuery.data ?? []).filter(isOpenNeed);

  // Newest-first order is guaranteed by the query.
  const latestByNeed = new Map<string, WcmCommandRequest>();
  for (const command of commandsQuery.data ?? []) {
    const key = needKey(command.project_id, command.need_id);
    if (!latestByNeed.has(key)) latestByNeed.set(key, command);
  }

  const classified: ClassifiedNeed[] = ready
    ? openNeeds.map((need) => {
        const latest = latestByNeed.get(needKey(need.project_id, need.need_id)) ?? null;
        const active = latest && ACTIVE_COMMAND_STATUSES.includes(latest.status);
        return {
          need,
          latestCommand: latest,
          derived: active ? 'PENDING_SYSTEM' : 'NEEDS_STEFANO',
        };
      })
    : [];

  // Virtual needs: unmapped category+status pairs require a human classification.
  // They live only in the UI and are never written to wcm_project_needs.
  const unclassifiedNeeds: ClassifiedNeed[] = (docsQuery.data ?? [])
    .filter((doc) => resolveCanonicalState(doc, index) === 'UNKNOWN')
    .map((doc) => ({
      virtual: true,
      derived: 'NEEDS_STEFANO' as const,
      latestCommand: null,
      need: {
        id: `unclassified::${doc.project_id}::${doc.document_id}`,
        project_id: doc.project_id,
        need_id: `unclassified::${doc.document_id}`,
        title: `Stato da classificare · ${doc.title}`,
        need_type: 'STATE_CLASSIFICATION',
        status: 'OPEN',
        reason: `category=${doc.category ?? '—'} · status=${doc.status ?? '—'} non è mappato a uno stato canonico.`,
        action_requested:
          'Classifica lo stato del documento: conferma la proposta, scegli un altro stato canonico o proponi un nuovo stato.',
        related_document_ids: [doc.document_id],
        target_tab: 'documents',
        target_document_id: doc.document_id,
        sort_order: 0,
        source_path: null,
        source_sha: null,
        updated_at: new Date(0).toISOString(),
      } satisfies WcmProjectNeed,
    }));

  // Global Method Change Gates: explicit structured gates projected from
  // GitHub. An OPEN gate requires Stefano's authority. Virtual/UI-only: never
  // written to wcm_project_needs and never sent to the PROJECT command
  // surface. The dedicated global method command contract classifies an OPEN
  // gate with an active method command (SUBMITTED/CLAIMED/RECORDED) as
  // pending-system: it stays visible until the gate leaves OPEN, but no
  // further click is required.
  const latestMethodByGate = latestMethodCommandByGate(methodCommandsQuery.data ?? []);
  const gateNeeds: ClassifiedNeed[] = (gatesQuery.data ?? [])
    .filter(isOpenGate)
    .map((gate) => {
      const latestMethod = latestMethodByGate.get(gate.gate_id) ?? null;
      return {
        virtual: true,
        derived: gateNeedDerivedState(latestMethod),
        latestCommand: null,
        latestMethodCommand: latestMethod,
        need: methodGateToNeed(gate),
      };
    });

  const allClassified = [...gateNeeds, ...classified, ...unclassifiedNeeds];

  return {
    isLoading,
    error,
    ready,
    openNeeds,
    classified: allClassified,
    unclassifiedNeeds,
    gateNeeds,
    needsStefano: allClassified.filter((c) => c.derived === 'NEEDS_STEFANO'),
    pendingNeeds: allClassified.filter((c) => c.derived === 'PENDING_SYSTEM'),
    latestByNeed,
  };
};
