import { describe, expect, it } from 'vitest';
import {
  BOARD_METADATA_KEYS,
  parseDerivedExecutionState,
  partitionBoardBlock,
  mergeBoardFields,
  NEED_METADATA_KEYS,
  partitionCollectionItem,
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

describe('Writer Memory Authority · mergeBoardFields needs_stefano', () => {
  it('board.needs_stefano=false non azzera projection.needs_stefano=true', () => {
    const incoming: Record<string, unknown> = { needs_stefano: true };
    mergeBoardFields(incoming, { needs_stefano: false, board_gate_reason: null });
    expect(incoming.needs_stefano).toBe(true);
    expect(incoming.board_gate_reason).toBeNull();
  });

  it('Board Gate aperto: board.needs_stefano=true resta true', () => {
    const incoming: Record<string, unknown> = { needs_stefano: true };
    mergeBoardFields(incoming, { needs_stefano: true });
    expect(incoming.needs_stefano).toBe(true);
  });

  it('board.needs_stefano=true può rinforzare una projection senza flag', () => {
    const incoming: Record<string, unknown> = {};
    mergeBoardFields(incoming, { needs_stefano: true });
    expect(incoming.needs_stefano).toBe(true);
  });

  it('gli altri campi board continuano a sovrascrivere la projection', () => {
    const incoming: Record<string, unknown> = { board_verdict: 'stale' };
    mergeBoardFields(incoming, { board_verdict: 'APPROVED' });
    expect(incoming.board_verdict).toBe('APPROVED');
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

const NEED_FIELDS = [
  'need_id',
  'title',
  'need_type',
  'status',
  'reason',
  'action_requested',
  'related_document_ids',
  'target_tab',
  'target_document_id',
  'sort_order',
  'source_path',
  'source_sha',
];

describe('DEC-014 · needs metadata di command surface', () => {
  const boardGateNeed = {
    need_id: 'chapter-07-v0-2-board-decision',
    title: 'Board Gate Capitolo 7 V0.2',
    need_type: 'BOARD_GATE',
    status: 'OPEN',
    reason: 'BOARD_GATE_OPENED',
    action_requested: 'APPROVE_FREEZE',
    related_document_ids: ['chapter-07-v0-2'],
    target_tab: 'board',
    target_document_id: 'chapter-07-v0-2',
    sort_order: 1,
    source_path: 'projects/prima-di-noi/state/needs.json',
    source_sha: 'abc123',
    command_options: ['APPROVE_FREEZE', 'REQUEST_CHANGES'],
    workflow_instance_id: 'WF-007',
  };

  it('accetta command_options e workflow_instance_id ed esclude i metadata dalla riga', () => {
    const result = partitionCollectionItem(boardGateNeed, NEED_FIELDS, NEED_METADATA_KEYS);
    if ('error' in result) throw new Error('need rifiutato');
    expect(result.metadata).toEqual({
      command_options: ['APPROVE_FREEZE', 'REQUEST_CHANGES'],
      workflow_instance_id: 'WF-007',
    });
    expect(Object.keys(result.persisted).sort()).toEqual(
      [
        'action_requested',
        'need_id',
        'need_type',
        'reason',
        'related_document_ids',
        'sort_order',
        'source_path',
        'source_sha',
        'status',
        'target_document_id',
        'target_tab',
        'title',
      ],
    );
    // target invariant preserved: Board Gate still points at the candidate.
    expect(result.persisted.target_document_id).toBe('chapter-07-v0-2');
  });

  it('rifiuta ancora una chiave need davvero sconosciuta', () => {
    expect(
      partitionCollectionItem(
        { ...boardGateNeed, chiave_ignota: true },
        NEED_FIELDS,
        NEED_METADATA_KEYS,
      ),
    ).toEqual({ error: 'Unsupported fields', fields: ['chiave_ignota'] });
  });

  it('non applica i metadata dei needs alle altre collection', () => {
    expect(
      partitionCollectionItem({ document_id: 'x', command_options: [] }, ['document_id'], []),
    ).toEqual({ error: 'Unsupported fields', fields: ['command_options'] });
  });
});
