import { describe, expect, it } from 'vitest';
import { parseKnowledgeCheckpoints, parseKnowledgeHealth } from './knowledge.ts';

// Fixtures mirror the CURRENT canonical shape of the PRIMA DI NOI files:
// projects/prima-di-noi/kb/knowledge-health/KNOWLEDGE_HEALTH.json and CHECKPOINTS.json
const CANONICAL_HEALTH = {
  schema_version: '1.0',
  project_id: 'prima-di-noi',
  health_status: 'healthy',
  knowledge_integrity_score: 87,
  score_method: 'wcm-kis-v1',
  checked_at: '2026-08-19T22:10:00Z',
  last_reconciliation_at: '2026-08-19T21:00:00Z',
  last_material_delta: '2026-08-19T20:30:00Z',
  last_material_delta_sha: 'a1b2c3d4e5f6',
  components: { coherence: 0.9, coverage: 0.84 },
  metrics: { active_synapses: 42, open_drifts: 1 },
  issues: [{ code: 'DRIFT', severity: 'low' }],
  source_path: 'projects/prima-di-noi/kb/knowledge-health/KNOWLEDGE_HEALTH.json',
  source_sha: 'deadbeef',
  notes: 'Reconciliation nominale.',
};

const CANONICAL_CHECKPOINTS = [
  {
    schema_version: '1.0',
    project_id: 'prima-di-noi',
    checkpoint_id: 'CKPT-2026-08-19',
    label: 'Checkpoint 19/08',
    occurred_at: '2026-08-19T22:10:00Z',
    health_status: 'HEALTHY',
    knowledge_integrity_score: 87,
    active_synapses: 42,
    new_synapses: 3,
    modified_synapses: 2,
    at_risk_synapses: 1,
    broken_synapses: 0,
    orphan_nodes: 4,
    open_drifts: 1,
    continuity_debt: 2,
    payoff_debt: 1,
    synapse_snapshot: { total: 42, by_type: { causal: 20 } },
    note: 'Crescita stabile.',
    source_path: 'projects/prima-di-noi/kb/knowledge-health/CHECKPOINTS.json',
    source_sha: 'cafebabe',
    sort_order: 1,
  },
];

describe('knowledge_health boundary', () => {
  it('normalizes the canonical file shape', () => {
    const parsed = parseKnowledgeHealth(CANONICAL_HEALTH, 'prima-di-noi');
    if ('error' in parsed) throw new Error(String(parsed.error));
    expect(parsed.row.project_id).toBe('prima-di-noi');
    expect(parsed.row.health_status).toBe('HEALTHY');
    // canonical alias mapped onto the existing column
    expect(parsed.row.last_material_delta_at).toBe('2026-08-19T20:30:00Z');
    // metadata accepted but not persisted, and notes untouched
    expect(parsed.row.notes).toBe('Reconciliation nominale.');
    expect(parsed.row).not.toHaveProperty('schema_version');
    expect(parsed.row).not.toHaveProperty('last_material_delta_sha');
    expect(parsed.metadata.last_material_delta_sha).toBe('a1b2c3d4e5f6');
    expect(parsed.metadata.schema_version).toBe('1.0');
  });

  it('does not overwrite an explicit last_material_delta_at', () => {
    const parsed = parseKnowledgeHealth(
      { ...CANONICAL_HEALTH, last_material_delta_at: '2026-08-18T00:00:00Z' },
      'prima-di-noi',
    );
    if ('error' in parsed) throw new Error(String(parsed.error));
    expect(parsed.row.last_material_delta_at).toBe('2026-08-18T00:00:00Z');
  });

  it('rejects a mismatched project_id', () => {
    const parsed = parseKnowledgeHealth(CANONICAL_HEALTH, 'altro-progetto');
    expect('error' in parsed).toBe(true);
  });

  it('still rejects genuinely unknown keys', () => {
    const parsed = parseKnowledgeHealth({ ...CANONICAL_HEALTH, wat: 1 }, 'prima-di-noi');
    expect(parsed).toMatchObject({ fields: ['wat'] });
  });
});

describe('knowledge_checkpoints boundary', () => {
  it('folds flat canonical metrics into metrics JSONB', () => {
    const rows = parseKnowledgeCheckpoints(CANONICAL_CHECKPOINTS, 'prima-di-noi');
    if (!Array.isArray(rows)) throw new Error(String(rows.error));
    const row = rows[0];
    expect(row.checkpoint_id).toBe('CKPT-2026-08-19');
    expect(row.label).toBe('Checkpoint 19/08');
    expect(row.occurred_at).toBe('2026-08-19T22:10:00Z');
    expect(row.health_status).toBe('HEALTHY');
    expect(row.knowledge_integrity_score).toBe(87);
    expect(row.note).toBe('Crescita stabile.');
    expect(row.metrics).toEqual({
      active_synapses: 42,
      new_synapses: 3,
      modified_synapses: 2,
      at_risk_synapses: 1,
      broken_synapses: 0,
      orphan_nodes: 4,
      open_drifts: 1,
      continuity_debt: 2,
      payoff_debt: 1,
      synapse_snapshot: { total: 42, by_type: { causal: 20 } },
    });
    expect(row).not.toHaveProperty('active_synapses');
  });

  it('accepts the already-normalized transport shape', () => {
    const rows = parseKnowledgeCheckpoints(
      [{ checkpoint_id: 'C1', label: 'L', metrics: { active_synapses: 7 } }],
      'prima-di-noi',
    );
    if (!Array.isArray(rows)) throw new Error(String(rows.error));
    expect(rows[0].metrics).toEqual({ active_synapses: 7 });
  });

  it('accepts the *_since_checkpoint metric aliases', () => {
    const rows = parseKnowledgeCheckpoints(
      [
        {
          checkpoint_id: 'C1',
          label: 'L',
          new_synapses_since_checkpoint: 5,
          modified_synapses_since_checkpoint: 2,
        },
      ],
      'prima-di-noi',
    );
    if (!Array.isArray(rows)) throw new Error(String(rows.error));
    expect(rows[0].metrics).toEqual({
      new_synapses_since_checkpoint: 5,
      modified_synapses_since_checkpoint: 2,
    });
  });

  it('still rejects unknown checkpoint keys', () => {
    const rows = parseKnowledgeCheckpoints(
      [{ checkpoint_id: 'C1', label: 'L', bogus_metric: 1 }],
      'prima-di-noi',
    );
    expect(rows).toMatchObject({ fields: ['bogus_metric'] });
  });
});

// V0.7 — Steward Activity (observation-only) must round-trip through the boundary,
// while legacy payloads without these fields keep working unchanged.
const STEWARD_EVENT = {
  activity_id: 'STW-2026-08-20-01',
  occurred_at: '2026-08-20T05:00:00Z',
  trigger: 'schedule',
  run_id: '123456789',
  run_url: 'https://github.com/scoppolabi-ux/WCM-LAB/actions/runs/123456789',
  source_sha: 'abc123',
  engine: 'knowledge-steward-v1',
  authority: 'MECHANICAL_ONLY',
  classification: 'MECHANICAL_REPAIRED',
  pre_health_status: 'DEGRADED',
  pre_score: 81,
  repairs_attempted: ['RELINK_ORPHAN'],
  repairs_applied: ['RELINK_ORPHAN'],
  files_changed: ['projects/prima-di-noi/kb/graph/NODES.json'],
  escalations: [],
  post_health_status: 'HEALTHY',
  post_score: 87,
  alert_disposition: 'NONE',
};

describe('steward activity boundary (V0.7)', () => {
  it('accepts legacy payloads without steward fields', () => {
    const parsed = parseKnowledgeHealth(CANONICAL_HEALTH, 'prima-di-noi');
    if ('error' in parsed) throw new Error(String(parsed.error));
    expect(parsed.row).not.toHaveProperty('steward_activity');
    expect(parsed.row).not.toHaveProperty('steward_activity_history');
  });

  it('persists steward_activity and steward_activity_history', () => {
    const parsed = parseKnowledgeHealth(
      {
        ...CANONICAL_HEALTH,
        steward_activity: STEWARD_EVENT,
        steward_activity_history: [STEWARD_EVENT],
      },
      'prima-di-noi',
    );
    if ('error' in parsed) throw new Error(String(parsed.error));
    expect(parsed.row.steward_activity).toEqual(STEWARD_EVENT);
    expect(parsed.row.steward_activity_history).toEqual([STEWARD_EVENT]);
  });

  it('keeps rejecting unknown keys alongside steward fields', () => {
    const parsed = parseKnowledgeHealth(
      { ...CANONICAL_HEALTH, steward_activity: STEWARD_EVENT, steward_wat: 1 },
      'prima-di-noi',
    );
    expect(parsed).toMatchObject({ fields: ['steward_wat'] });
  });
});
