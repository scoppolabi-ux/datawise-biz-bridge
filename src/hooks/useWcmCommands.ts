import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type WcmCommandStatus =
  | 'SUBMITTED'
  | 'CLAIMED'
  | 'RECORDED'
  | 'STALE'
  | 'REJECTED'
  | 'FAILED';

export type WcmCommandRequest = {
  id: string;
  command_id: string;
  project_id: string;
  need_id: string;
  command_type: 'APPROVE_FREEZE' | 'REQUEST_CHANGES';
  target_document_id: string | null;
  target_version: string | null;
  expected_state_sha: string | null;
  expected_need_fingerprint: string | null;
  requested_by_email: string;
  requested_by_role: string;
  note: string | null;
  status: WcmCommandStatus;
  created_at: string;
  claimed_at: string | null;
  recorded_at: string | null;
  receipt_path: string | null;
  receipt_sha: string | null;
  failure_reason: string | null;
};

export const ACTIVE_COMMAND_STATUSES: WcmCommandStatus[] = ['SUBMITTED', 'CLAIMED', 'RECORDED'];

export const COMMAND_STATUS_LABELS: Record<WcmCommandStatus, string> = {
  SUBMITTED: 'Inviato',
  CLAIMED: 'In presa in carico',
  RECORDED: 'Autorità registrata su GitHub',
  STALE: 'Non più valido (stato cambiato)',
  REJECTED: 'Rifiutato',
  FAILED: 'Fallito',
};

/** Governance commands for one project — read-only, owner/admin via RLS. */
export const useWcmProjectCommands = (projectId: string | undefined) =>
  useQuery({
    queryKey: ['wcm-command-requests', projectId],
    enabled: Boolean(projectId),
    refetchInterval: 20_000,
    queryFn: async (): Promise<WcmCommandRequest[]> => {
      const { data, error } = await supabase
        .from('wcm_command_requests')
        .select('*')
        .eq('project_id', projectId!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as WcmCommandRequest[];
    },
  });

/** Derived observability only: no new authority, no DB status change. */
export const COMMAND_DELIVERY_DELAY_MS = 10 * 60 * 1000;

/**
 * True when a command is still SUBMITTED after the delivery threshold: it is
 * durably queued but the GitHub worker has not claimed it yet.
 */
export const isCommandDeliveryDelayed = (
  command: Pick<WcmCommandRequest, 'status' | 'created_at'> | null | undefined,
  now: number = Date.now(),
): boolean => {
  if (!command || command.status !== 'SUBMITTED') return false;
  const createdAt = new Date(command.created_at).getTime();
  if (!Number.isFinite(createdAt)) return false;
  return now - createdAt >= COMMAND_DELIVERY_DELAY_MS;
};

/** Non-sensitive server-side wake-up diagnostic returned by the submit function. */
export type WcmCommandDelivery = {
  wake_requested: boolean;
  reason?: string;
  mechanism?: 'workflow_dispatch' | 'repository_dispatch';
  http_status?: number;
  attempts?: number;
  token_source?: string;
};

export type SubmitCommandInput = {

  project_id: string;
  need_id: string;
  command_type: 'APPROVE_FREEZE' | 'REQUEST_CHANGES';
  target_document_id?: string | null;
  target_version?: string | null;
  note?: string | null;
};

/**
 * Submission goes exclusively through the authenticated edge function:
 * the browser never writes the read-model and never talks to GitHub.
 */
export const useSubmitWcmCommand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SubmitCommandInput) => {
      const { data, error } = await supabase.functions.invoke('wcm-command-submit', {
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
      return data as {
        command: WcmCommandRequest;
        delivery?: WcmCommandDelivery;
      };

    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wcm-command-requests', variables.project_id] });
    },
  });
};
