import type { WcmCommandType } from '@/hooks/useWcmCommands';

export type CommandSurfaceMode = 'BOARD_GATE' | 'WRITER_MEMORY_AUTHORITY' | null;

export const WRITER_MEMORY_AUTHORITY_COMMAND: WcmCommandType =
  'APPROVE_WRITER_MEMORY_AUTHORITY_ITEM';

/**
 * Which command surface (if any) a need exposes.
 * Board Gate keeps its historical two-command surface; Writer Memory Authority
 * exposes exactly one command (Approva) with no note and no target document.
 */
export const commandSurfaceMode = (need: { need_type?: string | null }): CommandSurfaceMode => {
  const type = String(need.need_type ?? '').trim().toUpperCase();
  if (type === 'BOARD_GATE') return 'BOARD_GATE';
  if (type === 'WRITER_MEMORY_AUTHORITY') return 'WRITER_MEMORY_AUTHORITY';
  return null;
};

/** Human-facing labels for the surface, per mode. */
export const commandSurfaceLabels = (mode: Exclude<CommandSurfaceMode, null>) =>
  mode === 'BOARD_GATE'
    ? { surface: 'Command Surface · Board Gate', approve: 'Approva + Freeze' }
    : { surface: 'Command Surface · Writer Memory Authority', approve: 'Approva' };
