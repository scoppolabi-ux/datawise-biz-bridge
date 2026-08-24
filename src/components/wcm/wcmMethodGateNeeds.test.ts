import { describe, expect, it } from 'vitest';
import {
  isMethodGateNeed,
  methodGateToNeed,
  needScopeLabel,
  WCM_CHANGE_GATE,
  WCM_GATE_TARGET_PATH,
  WCM_METHOD_SCOPE,
} from './wcmMethodGateNeeds';
import { needTargetPath, type WcmProjectNeed } from '@/hooks/useWcmProjects';
import type { WcmMethodChangeGate } from '@/hooks/useWcmMethodLearning';

const gate: WcmMethodChangeGate = {
  id: 'uuid-1',
  gate_id: 'WCM-GATE-001',
  gate_type: 'WCM_CHANGE_GATE',
  learning_id: 'WCM-LRN-004',
  title: 'Promozione di WCM-LRN-004 alla baseline di metodo',
  status: 'OPEN',
  authority_required: 'stefano',
  procedure_refs: ['PROC-004'],
  impact_preview_refs: ['wcm/method/PROT-001.md'],
  opened_at: '2026-08-23T00:00:00Z',
  decided_at: null,
  decided_by: null,
  source_path: 'wcm/kb/learning/METHOD_CHANGE_GATES.json',
  source_sha: 'abc123',
  revision: 1,
  sort_order: 0,
  updated_at: '2026-08-24T09:00:00Z',
};

describe('methodGateToNeed (WCM_CHANGE_GATE integration)', () => {
  it('uses the exact need_type WCM_CHANGE_GATE', () => {
    expect(methodGateToNeed(gate).need_type).toBe('WCM_CHANGE_GATE');
    expect(WCM_CHANGE_GATE).toBe('WCM_CHANGE_GATE');
  });

  it('is virtual/UI-only with a stable logical id, never a project row', () => {
    const need = methodGateToNeed(gate);
    expect(need.id).toBe('method-gate::WCM-GATE-001');
    expect(need.need_id).toBe('WCM-GATE-001');
    expect(need.project_id).toBe(WCM_METHOD_SCOPE);
    expect(need.project_id).toBe('wcm-method');
  });

  it('preserves the exact gate status without interpretation', () => {
    expect(methodGateToNeed(gate).status).toBe('OPEN');
    expect(methodGateToNeed({ ...gate, status: 'EXECUTED' }).status).toBe('EXECUTED');
  });

  it('keeps the learning reference in the reason', () => {
    expect(methodGateToNeed(gate).reason).toContain('WCM-LRN-004');
  });
});

describe('gate need routing', () => {
  it('routes WCM_CHANGE_GATE needs to the WCM Learning page, not a project tab', () => {
    const need = methodGateToNeed(gate);
    expect(needTargetPath(need)).toBe(WCM_GATE_TARGET_PATH);
    expect(needTargetPath(need)).toBe('/wcm/learning');
  });

  it('does not touch project need routing (Board Gate unaffected)', () => {
    const projectNeed: WcmProjectNeed = {
      id: 'p1',
      project_id: 'prima-di-noi',
      need_id: 'NEED-1',
      title: 'Board gate',
      need_type: 'BOARD_GATE',
      status: 'OPEN',
      reason: null,
      action_requested: null,
      related_document_ids: [],
      target_tab: 'board',
      target_document_id: null,
      sort_order: 0,
      source_path: null,
      source_sha: null,
      updated_at: '2026-08-24T09:00:00Z',
    };
    expect(needTargetPath(projectNeed)).toBe('/wcm/prima-di-noi?tab=board&need=NEED-1');
  });
});

describe('needScopeLabel', () => {
  it('labels method gates as global method-plane items', () => {
    expect(needScopeLabel(methodGateToNeed(gate), undefined)).toBe('WCM · Metodo globale');
  });

  it('labels project needs with the project name', () => {
    const need = { ...methodGateToNeed(gate), need_type: 'BOARD_GATE' };
    expect(needScopeLabel(need, 'PRIMA DI NOI')).toBe('PRIMA DI NOI');
    expect(needScopeLabel(need, undefined)).toBe('wcm-method');
  });
});

describe('isMethodGateNeed', () => {
  it('detects gate needs exactly', () => {
    expect(isMethodGateNeed(methodGateToNeed(gate))).toBe(true);
    expect(isMethodGateNeed({ ...methodGateToNeed(gate), need_type: 'BOARD_GATE' })).toBe(false);
  });
});
