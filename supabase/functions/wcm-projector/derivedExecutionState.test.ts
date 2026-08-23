import { describe, expect, it } from 'vitest';
import {
  BOARD_METADATA_KEYS,
  parseDerivedExecutionState,
} from './derivedExecutionState.ts';

describe('DEC-014 · derived_execution_state', () => {
  it('rifiuta valori non oggetto', () => {
    expect(parseDerivedExecutionState('x')).toEqual({
      error: 'derived_execution_state must be an object',
    });
    expect(parseDerivedExecutionState([])).toHaveProperty('error');
  });

  it('WAITING_AUTHORITY forza waiting_board + needs_stefano + phase=next_transition', () => {
    const parsed = parseDerivedExecutionState({
      execution_status: 'WAITING_AUTHORITY',
      next_transition: 'BOARD_DECISION',
    });
    expect(parsed).toEqual({
      overrides: {
        status: 'waiting_board',
        needs_stefano: true,
        phase: 'BOARD_DECISION',
      },
    });
  });

  it('WAITING_AUTHORITY senza next_transition non tocca phase', () => {
    const parsed = parseDerivedExecutionState({
      execution_status: 'WAITING_AUTHORITY',
      next_transition: '  ',
    }) as { overrides: Record<string, unknown> };
    expect(parsed.overrides).toEqual({ status: 'waiting_board', needs_stefano: true });
  });

  it('mappa gli altri enum esatti', () => {
    const s = (v: string) =>
      (parseDerivedExecutionState({ execution_status: v }) as { overrides: Record<string, unknown> })
        .overrides.status;
    expect(s('INTERRUPTED_RESUMABLE')).toBe('active_resume_required');
    expect(s('ACTIVE')).toBe('working');
    expect(s('BLOCKED')).toBe('blocked');
  });

  it('enum sconosciuti o assenti non producono override', () => {
    expect(parseDerivedExecutionState({ execution_status: 'boh' })).toEqual({ overrides: {} });
    expect(parseDerivedExecutionState({})).toEqual({ overrides: {} });
    // nessuna inferenza da sottostringhe
    expect(parseDerivedExecutionState({ execution_status: 'waiting_authority' })).toEqual({
      overrides: {},
    });
  });

  it('espone le chiavi metadata di board accettate', () => {
    expect([...BOARD_METADATA_KEYS]).toEqual([
      'target_document_id',
      'need_id',
      'workflow_instance_id',
    ]);
  });
});
