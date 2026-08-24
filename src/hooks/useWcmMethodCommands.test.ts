import { describe, expect, it } from 'vitest';
import {
  ACTIVE_METHOD_COMMAND_STATUSES,
  hasActiveMethodCommand,
  latestMethodCommandByGate,
  METHOD_COMMAND_TYPE_LABELS,
  methodCommandRequiresNote,
  type WcmMethodCommandRequest,
} from './useWcmMethodCommands';

const cmd = (
  overrides: Partial<WcmMethodCommandRequest>,
): WcmMethodCommandRequest => ({
  id: 'uuid-1',
  command_id: 'cmd-1',
  gate_id: 'WCM-GATE-001',
  command_type: 'APPROVE_CHANGE_GATE',
  expected_gate_revision: 1,
  requested_by_user_id: 'user-1',
  requested_by_email: 'stefano@example.com',
  requested_by_role: 'owner',
  note: null,
  status: 'SUBMITTED',
  created_at: '2026-08-24T10:00:00Z',
  claimed_at: null,
  recorded_at: null,
  receipt_path: null,
  receipt_sha: null,
  failure_reason: null,
  ...overrides,
});

describe('method command type mapping', () => {
  it('maps exactly the three canonical command types to Italian labels', () => {
    expect(METHOD_COMMAND_TYPE_LABELS.APPROVE_CHANGE_GATE).toBe('Approva Change Gate');
    expect(METHOD_COMMAND_TYPE_LABELS.REQUEST_CHANGES).toBe('Richiedi modifiche');
    expect(METHOD_COMMAND_TYPE_LABELS.REJECT_CHANGE_GATE).toBe('Rifiuta Change Gate');
    expect(Object.keys(METHOD_COMMAND_TYPE_LABELS).sort()).toEqual([
      'APPROVE_CHANGE_GATE',
      'REJECT_CHANGE_GATE',
      'REQUEST_CHANGES',
    ]);
  });
});

describe('note rules', () => {
  it('requires a note for REQUEST_CHANGES and REJECT_CHANGE_GATE only', () => {
    expect(methodCommandRequiresNote('REQUEST_CHANGES')).toBe(true);
    expect(methodCommandRequiresNote('REJECT_CHANGE_GATE')).toBe(true);
    expect(methodCommandRequiresNote('APPROVE_CHANGE_GATE')).toBe(false);
  });
});

describe('active command detection', () => {
  it('treats SUBMITTED/CLAIMED/RECORDED as active', () => {
    for (const status of ACTIVE_METHOD_COMMAND_STATUSES) {
      expect(hasActiveMethodCommand(cmd({ status }))).toBe(true);
    }
  });

  it('treats terminal STALE/REJECTED/FAILED as inactive', () => {
    for (const status of ['STALE', 'REJECTED', 'FAILED'] as const) {
      expect(hasActiveMethodCommand(cmd({ status }))).toBe(false);
    }
    expect(hasActiveMethodCommand(null)).toBe(false);
    expect(hasActiveMethodCommand(undefined)).toBe(false);
  });
});

describe('latestMethodCommandByGate', () => {
  it('keeps the newest command per gate (input is newest-first)', () => {
    const newest = cmd({ command_id: 'cmd-new', created_at: '2026-08-24T12:00:00Z' });
    const oldest = cmd({ command_id: 'cmd-old', created_at: '2026-08-24T10:00:00Z' });
    const other = cmd({ command_id: 'cmd-other', gate_id: 'WCM-GATE-002' });
    const map = latestMethodCommandByGate([newest, oldest, other]);
    expect(map.get('WCM-GATE-001')?.command_id).toBe('cmd-new');
    expect(map.get('WCM-GATE-002')?.command_id).toBe('cmd-other');
  });

  it('returns an empty map for no commands', () => {
    expect(latestMethodCommandByGate([]).size).toBe(0);
  });
});
