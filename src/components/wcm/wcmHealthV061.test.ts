import { describe, expect, it } from 'vitest';
import { buildHealthPlanes } from './wcmHealthPlanes';
import {
  componentScoreOf,
  SYNAPSE_METRICS,
  metricOf,
  splitIssues,
} from './wcmKnowledge';
import type { WcmProjectStatus } from '@/hooks/useWcmProjects';

const project = (over: Partial<WcmProjectStatus> = {}) =>
  ({
    project_id: 'prima-di-noi',
    status: 'waiting_board',
    heartbeat_last_run_at: '2026-08-20T10:00:00Z',
    heartbeat_last_outcome: 'blocked_board',
    ...over,
  }) as unknown as WcmProjectStatus;

const executionOf = (p: WcmProjectStatus) =>
  buildHealthPlanes({ project: p }).find((plane) => plane.key === 'execution')!;

describe('V0.6.1 Execution Health accuracy', () => {
  it('non classifica blocked_board come CRITICAL', () => {
    const plane = executionOf(project());
    expect(plane.status).toBe('HEALTHY');
    expect(plane.headline).toContain('Stop governato');
  });

  it('accetta varianti di case/hyphen per lo stop governato', () => {
    expect(executionOf(project({ heartbeat_last_outcome: 'BLOCKED-BOARD' })).status).toBe('HEALTHY');
  });

  it('non degrada uno stop governato per la presenza di un blocker', () => {
    const plane = executionOf(project({ blocker: 'Attesa decisione board' }));
    expect(plane.status).toBe('HEALTHY');
  });

  it('classifica CRITICAL solo i failure espliciti', () => {
    expect(executionOf(project({ heartbeat_last_outcome: 'FAILED' })).status).toBe('CRITICAL');
  });

  it('resta prudente su outcome sconosciuti', () => {
    expect(executionOf(project({ heartbeat_last_outcome: 'weird_state' })).status).toBe('DEGRADED');
    expect(
      executionOf(project({ heartbeat_last_run_at: null, heartbeat_last_outcome: null })).status,
    ).toBe('UNKNOWN');
  });

  it('espone la riga Runtime liveness non proiettata', () => {
    const plane = executionOf(project());
    expect(plane.lines.find((l) => l.label === 'Runtime liveness')?.value).toBe(
      'Non proiettata da Mission Control',
    );
  });
});

describe('V0.6.1 Knowledge readability', () => {
  it('legge lo score annidato nel componente', () => {
    const components = { state_consistency: { score: 100, status: 'CURRENT', reason: 'ok' } };
    expect(componentScoreOf(components, 'state_consistency')).toEqual({
      score: 100,
      status: 'CURRENT',
      reason: 'ok',
    });
  });

  it('resta compatibile con valori numerici diretti', () => {
    expect(componentScoreOf({ orphan_control: 80 }, 'orphan_control')?.score).toBe(80);
  });

  it('supporta l alias modified_synapses_since_checkpoint', () => {
    const metric = SYNAPSE_METRICS.find((m) => m.label === 'Modificate dal checkpoint')!;
    expect(metricOf({ modified_synapses_since_checkpoint: 5 }, ...metric.keys)).toBe(5);
  });

  it('separa issue aperti e risolti in modo case-insensitive', () => {
    const { openIssues, resolvedIssues } = splitIssues([
      { id: 'KH-001', status: 'open' },
      { id: 'KH-AUTO-STATE-CONSISTENCY', status: 'resolved' },
      { id: 'KH-002', status: 'OPEN' },
      { id: 'KH-X', status: 'Closed' },
    ]);
    expect(openIssues.map((i) => i.id)).toEqual(['KH-001', 'KH-002']);
    expect(resolvedIssues).toHaveLength(2);
  });
});
