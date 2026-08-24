import type { WcmMethodChangeGate } from '@/hooks/useWcmMethodLearning';
import type { WcmProjectNeed } from '@/hooks/useWcmProjects';
import {
  hasActiveMethodCommand,
  type WcmMethodCommandRequest,
} from '@/hooks/useWcmMethodCommands';

/**
 * Exact need_type for global Method Change Gates surfaced in the
 * Need Stefano aggregation. Kept distinct from every project need type and
 * from Board Gate semantics.
 */
export const WCM_CHANGE_GATE = 'WCM_CHANGE_GATE';

/** Stable virtual project scope for global method-plane items (UI-only). */
export const WCM_METHOD_SCOPE = 'wcm-method';

/** Deep link target for a global method gate: the WCM Learning page. */
export const WCM_GATE_TARGET_PATH = '/wcm/learning';

export const isMethodGateNeed = (need: WcmProjectNeed): boolean =>
  need.need_type === WCM_CHANGE_GATE;

/**
 * Human attention vs system-pending classification for an OPEN global gate.
 * An active method command (SUBMITTED/CLAIMED/RECORDED) means the authority
 * is already recorded and pending machine execution: no further click is
 * required, but the gate stays visible until it leaves OPEN.
 */
export const gateNeedDerivedState = (
  latestMethodCommand: WcmMethodCommandRequest | null | undefined,
): 'NEEDS_STEFANO' | 'PENDING_SYSTEM' =>
  hasActiveMethodCommand(latestMethodCommand) ? 'PENDING_SYSTEM' : 'NEEDS_STEFANO';

/**
 * Maps a global Method Change Gate onto the virtual-need shape used by the
 * Need Stefano aggregation. Virtual/UI-only, exactly like the unclassified
 * state needs: never written to wcm_project_needs, never routed to the
 * PROJECT command surface. The authority decision is recorded through the
 * dedicated global method command contract (wcm_method_command_requests);
 * GitHub remains the source of truth and consumes the command canonically.
 */
export const methodGateToNeed = (gate: WcmMethodChangeGate): WcmProjectNeed => ({
  id: `method-gate::${gate.gate_id}`,
  project_id: WCM_METHOD_SCOPE,
  need_id: gate.gate_id,
  title: gate.title,
  need_type: WCM_CHANGE_GATE,
  status: gate.status,
  reason: gate.learning_id
    ? `Change gate del metodo collegato a ${gate.learning_id}.`
    : 'Change gate globale del metodo WCM.',
  action_requested:
    'Autorità esplicita di Stefano richiesta sul WCM Change Gate. Il comando di autorità si registra dalla pagina WCM Learning; l’esecuzione canonica avviene su GitHub (sorgente di verità).',
  related_document_ids: [],
  target_tab: null,
  target_document_id: null,
  sort_order: gate.sort_order,
  source_path: gate.source_path,
  source_sha: gate.source_sha,
  updated_at: gate.updated_at,
});

/** Display label for the scope of a need (project vs global method plane). */
export const needScopeLabel = (
  need: WcmProjectNeed,
  projectName: string | undefined,
): string =>
  isMethodGateNeed(need) ? 'WCM · Metodo globale' : projectName ?? need.project_id;
