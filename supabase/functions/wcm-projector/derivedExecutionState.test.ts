import { describe, expect, it } from 'vitest';
import {
  BOARD_METADATA_KEYS,
  parseDerivedExecutionState,
  partitionBoardBlock,
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

const BOARD_FIELDS: Record<string, string> = {
  needs_stefano: 'needs_stefano',
  reason: 'board_gate_reason',
  action_requested: 'board_gate_action_requested',
  verdict: 'board_verdict',
  narrative_mass: 'board_narrative_mass',
  review_summary: 'board_review_summary',
};

describe('DEC-014 · board block partition', () => {
  it('accetta le chiavi metadata operative senza rifiutare il payload', () => {
    const result = partitionBoardBlock(
      {
        needs_stefano: true,
        reason: 'BOARD_GATE_OPENED',
        action_requested: 'APPROVE_FREEZE',
        target_document_id: 'chapter-07-v0-2',
        need_id: 'chapter-07-v0-2-board-decision',
        workflow_instance_id: 'WF-007',
      },
      BOARD_FIELDS,
    );
    expect(result).toEqual({
      fields: {
        needs_stefano: true,
        board_gate_reason: 'BOARD_GATE_OPENED',
        board_gate_action_requested: 'APPROVE_FREEZE',
      },
      metadata: {
        target_document_id: 'chapter-07-v0-2',
        need_id: 'chapter-07-v0-2-board-decision',
        workflow_instance_id: 'WF-007',
      },
    });
  });

  it('rifiuta ancora le chiavi board davvero sconosciute', () => {
    expect(partitionBoardBlock({ mistero: 1 }, BOARD_FIELDS)).toEqual({
      error: 'Unsupported board fields',
      fields: ['mistero'],
    });
  });
});

describe('DEC-014 · scenario WAITING_AUTHORITY completo', () => {
  it('board metadata + derived state producono lo stato normalizzato atteso', () => {
    const board = partitionBoardBlock(
      {
        needs_stefano: true,
        reason: 'BOARD_GATE_OPENED',
        action_requested: 'APPROVE_FREEZE',
        target_document_id: 'chapter-07-v0-2',
        need_id: 'chapter-07-v0-2-board-decision',
        workflow_instance_id: 'WF-007',
      },
      BOARD_FIELDS,
    );
    if ('error' in board) throw new Error('board block rifiutato');

    const derived = parseDerivedExecutionState({
      execution_status: 'WAITING_AUTHORITY',
      next_transition: 'BOARD_DECISION',
    });
    if ('error' in derived) throw new Error('derived state rifiutato');

    const incoming = {
      // snapshot stale proveniente da projection
      status: 'active_resume_required',
      phase: 'EDITORIAL_SYNTHESIS',
      needs_stefano: false,
      ...board.fields,
      ...derived.overrides,
    };

    expect(incoming.status).toBe('waiting_board');
    expect(incoming.phase).toBe('BOARD_DECISION');
    expect(incoming.needs_stefano).toBe(true);
    expect(incoming.board_gate_action_requested).toBe('APPROVE_FREEZE');
  });
});
