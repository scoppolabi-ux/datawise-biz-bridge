import { describe, expect, it } from 'vitest';
import {
  isBoardCandidateCategory,
  requestsApproveFreeze,
  validateBoardGateTargets,
} from './wcmBoardGate';

const candidate = { document_id: 'cand-1', category: 'BOARD_CANDIDATE' };
const report = { document_id: 'rep-1', category: 'BOARD_REPORT' };

const need = (over: Record<string, unknown> = {}) => ({
  need_id: 'n1',
  need_type: 'BOARD_GATE',
  status: 'open',
  action_requested: 'APPROVE_FREEZE',
  related_document_ids: ['cand-1', 'rep-1'],
  target_document_id: 'cand-1',
  ...over,
});

describe('wcmBoardGate', () => {
  it('accepts a candidate target', () => {
    expect(validateBoardGateTargets([need()], [candidate, report])).toBeNull();
  });

  it('rejects a board report target', () => {
    const res = validateBoardGateTargets([need({ target_document_id: 'rep-1' })], [candidate, report]);
    expect(res?.code).toBe('INVALID_APPROVE_TARGET');
  });

  it('rejects a missing target', () => {
    const res = validateBoardGateTargets([need({ target_document_id: null })], [candidate]);
    expect(res?.code).toBe('INVALID_APPROVE_TARGET');
  });

  it('rejects an unrelated target', () => {
    const res = validateBoardGateTargets(
      [need({ target_document_id: 'other', related_document_ids: ['cand-1'] })],
      [candidate, { document_id: 'other', category: 'BOARD_CANDIDATE' }],
    );
    expect(res?.code).toBe('INVALID_APPROVE_TARGET');
  });

  it('rejects a target absent from the documents payload', () => {
    const res = validateBoardGateTargets([need()], [report]);
    expect(res?.code).toBe('INVALID_APPROVE_TARGET');
  });

  it('ignores closed needs and non board gates', () => {
    expect(
      validateBoardGateTargets([need({ status: 'closed', target_document_id: 'rep-1' })], [report]),
    ).toBeNull();
    expect(
      validateBoardGateTargets(
        [need({ need_type: 'REVIEW', target_document_id: 'rep-1' })],
        [report],
      ),
    ).toBeNull();
  });

  it('ignores needs without an approve+freeze action', () => {
    expect(
      validateBoardGateTargets(
        [need({ action_requested: 'REQUEST_CHANGES', target_document_id: 'rep-1' })],
        [report],
      ),
    ).toBeNull();
  });

  it('recognises APPROVE + FREEZE phrasing and category casing', () => {
    expect(requestsApproveFreeze({ action_requested: 'Approve + Freeze' })).toBe(true);
    expect(isBoardCandidateCategory('board_candidate')).toBe(true);
    expect(isBoardCandidateCategory('BOARD_REPORT')).toBe(false);
  });
});
