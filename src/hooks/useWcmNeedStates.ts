import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  ACTIVE_COMMAND_STATUSES,
  type WcmCommandRequest,
} from '@/hooks/useWcmCommands';
import { isOpenNeed, useWcmNeeds, type WcmProjectNeed } from '@/hooks/useWcmProjects';

export type DerivedNeedState = 'NEEDS_STEFANO' | 'PENDING_SYSTEM';

export type ClassifiedNeed = {
  need: WcmProjectNeed;
  derived: DerivedNeedState;
  latestCommand: WcmCommandRequest | null;
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

export const needKey = (projectId: string, needId: string) => `${projectId}::${needId}`;

/** Human-attention badge label for a classified need. */
export const derivedBadge = (item: ClassifiedNeed) => {
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

  const isLoading = needsQuery.isLoading || commandsQuery.isLoading;
  const error = needsQuery.error ?? commandsQuery.error;
  const ready = Boolean(needsQuery.data && commandsQuery.data);

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

  return {
    isLoading,
    error,
    ready,
    openNeeds,
    classified,
    needsStefano: classified.filter((c) => c.derived === 'NEEDS_STEFANO'),
    pendingNeeds: classified.filter((c) => c.derived === 'PENDING_SYSTEM'),
    latestByNeed,
  };
};
