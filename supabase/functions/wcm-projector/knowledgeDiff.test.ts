import { describe, expect, it } from 'vitest';
import { rowNeedsUpsert, selectChangedCheckpoints, stableFieldEqual } from './knowledgeDiff.ts';

const HEALTH_ROW = {
  project_id: 'prima-di-noi',
  health_status: 'HEALTHY',
  knowledge_integrity_score: 87,
  checked_at: '2026-08-19T22:10:00Z',
  components: { coverage: 0.84, coherence: 0.9 },
  issues: [{ code: 'DRIFT', severity: 'low' }],
};

describe('stableFieldEqual', () => {
  it('compares JSON objects irrespective of key order', () => {
    expect(stableFieldEqual('components', { a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(stableFieldEqual('components', { a: 1 }, { a: 2 })).toBe(false);
  });

  it('compares timestamps by instant', () => {
    expect(stableFieldEqual('checked_at', '2026-08-19T22:10:00Z', '2026-08-19T22:10:00+00:00')).toBe(true);
  });

  it('treats null and empty string as equal absence', () => {
    expect(stableFieldEqual('notes', '   ', null)).toBe(true);
    expect(stableFieldEqual('notes', 'x', null)).toBe(false);
  });
});

describe('knowledge_health idempotence', () => {
  it('upserts when the row does not exist yet', () => {
    expect(rowNeedsUpsert(HEALTH_ROW, null)).toBe(true);
  });

  it('does not upsert when the second projection is identical', () => {
    const current = { ...HEALTH_ROW, id: 'uuid', updated_at: '2026-08-19T22:11:00Z' };
    expect(rowNeedsUpsert(HEALTH_ROW, current)).toBe(false);
  });

  it('ignores columns the projector does not project', () => {
    const current = { ...HEALTH_ROW, notes: 'db-only note' };
    expect(rowNeedsUpsert(HEALTH_ROW, current)).toBe(false);
  });

  it('upserts on a real delta', () => {
    expect(rowNeedsUpsert(HEALTH_ROW, { ...HEALTH_ROW, knowledge_integrity_score: 81 })).toBe(true);
  });
});

describe('knowledge_checkpoints idempotence (append/upsert-only)', () => {
  const c1 = { project_id: 'p', checkpoint_id: 'C1', label: 'L1', metrics: { a: 1 } };
  const c2 = { project_id: 'p', checkpoint_id: 'C2', label: 'L2', metrics: { b: 2 } };

  it('selects all checkpoints on first projection', () => {
    expect(selectChangedCheckpoints([c1, c2], [])).toHaveLength(2);
  });

  it('selects none when the same payload is projected twice', () => {
    expect(selectChangedCheckpoints([c1, c2], [c1, c2])).toEqual([]);
  });

  it('selects only new or changed checkpoints', () => {
    const changed = { ...c2, label: 'L2 bis' };
    expect(selectChangedCheckpoints([c1, changed], [c1, c2])).toEqual([changed]);
  });

  it('never removes existing checkpoints omitted by the payload', () => {
    expect(selectChangedCheckpoints([c1], [c1, c2])).toEqual([]);
  });
});
