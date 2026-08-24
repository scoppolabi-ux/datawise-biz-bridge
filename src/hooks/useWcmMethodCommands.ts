import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * GLOBAL WCM Method Change Gate — authority command read-model hooks.
 *
 * Domain boundary: completely separate from project Board Gate commands
 * (wcm_command_requests / useWcmCommands). A method command only records
 * authenticated authority on a global gate; it never promotes a learning,
 * never mutates the gate read-model and never writes GitHub.
 */

export type WcmMethodCommandStatus =
  | 'SUBMITTED'
  | 'CLAIMED'
  | 'RECORDED'
  | 'STALE'
  | 'REJECTED'
  | 'FAILED';

export type WcmMethodCommandType =
  | 'APPROVE_CHANGE_GATE'
  | 'REQUEST_CHANGES'
  | 'REJECT_CHANGE_GATE';

export type WcmMethodCommandRequest = {
  id: string;
  command_id: string;
  gate_id: string;
  command_type: WcmMethodCommandType;
  expected_gate_revision: number;
  requested_by_user_id: string;
  requested_by_email: string;
  requested_by_role: string;
  note: string | null;
  status: WcmMethodCommandStatus;
  created_at: string;
  claimed_at: string | null;
  recorded_at: string | null;
  receipt_path: string | null;
  receipt_sha: string | null;
  failure_reason: string | null;
};

export const ACTIVE_METHOD_COMMAND_STATUSES: WcmMethodCommandStatus[] = [
  'SUBMITTED',
  'CLAIMED',
  'RECORDED',
];

export const METHOD_COMMAND_STATUS_LABELS: Record<WcmMethodCommandStatus, string> = {
  SUBMITTED: 'Inviato',
  CLAIMED: 'In presa in carico',
  RECORDED: 'Autorità registrata su GitHub',
  STALE: 'Non più valido (gate cambiato)',
  REJECTED: 'Rifiutato',
  FAILED: 'Fallito',
};

export const METHOD_COMMAND_TYPE_LABELS: Record<WcmMethodCommandType, string> = {
  APPROVE_CHANGE_GATE: 'Approva Change Gate',
  REQUEST_CHANGES: 'Richiedi modifiche',
  REJECT_CHANGE_GATE: 'Rifiuta Change Gate',
};

/** Exact command types that require a non-empty note. */
export const NOTE_REQUIRED_METHOD_COMMANDS: WcmMethodCommandType[] = [
  'REQUEST_CHANGES',
  'REJECT_CHANGE_GATE',
];

export const methodCommandRequiresNote = (type: WcmMethodCommandType): boolean =>
  NOTE_REQUIRED_METHOD_COMMANDS.includes(type);

/** All global method commands (owner/admin RLS, read-only). */
export const useWcmMethodCommands = () =>
  useQuery({
    queryKey: ['wcm-method-command-requests'],
    refetchInterval: 20_000,
    queryFn: async (): Promise<WcmMethodCommandRequest[]> => {
      const { data, error } = await supabase
        .from('wcm_method_command_requests' as never)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as WcmMethodCommandRequest[];
    },
  });

/**
 * Latest command per gate (queries are newest-first). Pure helper, exported
 * for tests and for the Need Stefano aggregation.
 */
export const latestMethodCommandByGate = (
  commands: WcmMethodCommandRequest[],
): Map<string, WcmMethodCommandRequest> => {
  const map = new Map<string, WcmMethodCommandRequest>();
  for (const command of commands) {
    if (!map.has(command.gate_id)) map.set(command.gate_id, command);
  }
  return map;
};

/** True when the gate has an active (in-flight or recorded) method command. */
export const hasActiveMethodCommand = (
  command: WcmMethodCommandRequest | null | undefined,
): boolean => Boolean(command && ACTIVE_METHOD_COMMAND_STATUSES.includes(command.status));

export type SubmitMethodCommandInput = {
  gate_id: string;
  command_type: WcmMethodCommandType;
  note?: string | null;
};

/**
 * Submission goes exclusively through the authenticated edge function:
 * the browser never writes the read-model and never talks to GitHub.
 */
export const useSubmitWcmMethodCommand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SubmitMethodCommandInput) => {
      const { data, error } = await supabase.functions.invoke('wcm-method-command-submit', {
        body: input,
      });
      if (error) {
        let message = 'Invio del comando non riuscito.';
        const context = (error as { context?: Response }).context;
        if (context && typeof context.json === 'function') {
          try {
            const payload = await context.json();
            if (payload?.error) message = String(payload.error);
          } catch (_e) {
            /* keep default message */
          }
        }
        throw new Error(message);
      }
      return data as { command: WcmMethodCommandRequest };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wcm-method-command-requests'] });
    },
  });
};
