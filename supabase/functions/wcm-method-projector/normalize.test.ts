import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import {
  parseLearningInbox,
  parseLearningLedger,
  parseMethodHealth,
  parseMethodRelationships,
} from './normalize.ts'

Deno.test('method_health accepts canonical shape', () => {
  const parsed = parseMethodHealth({
    schema_version: 1,
    checked_at: '2026-08-19T10:00:00Z',
    health_status: 'DEGRADED',
    method_integrity_score: 72,
    score_method: 'v1',
    last_material_method_delta_sha: 'abc123',
    last_material_method_delta_at: '2026-08-18T09:00:00Z',
    components: { coverage: 0.8 },
    metrics: { learning_records: 5, promoted_learning: 2, pending_evidence: 1 },
    issues: ['broken synapse'],
  })
  assert(!('error' in parsed))
  if ('error' in parsed) return
  assertEquals(parsed.row.system_id, 'wcm')
  assertEquals(parsed.row.method_integrity_score, 72)
  assertEquals(parsed.metadata.schema_version, 1)
})

Deno.test('method_health rejects unknown fields', () => {
  const parsed = parseMethodHealth({ health_status: 'HEALTHY', nope: 1 })
  assert('error' in parsed)
})

Deno.test('learning_ledger normalizes records', () => {
  const parsed = parseLearningLedger({
    schema_version: 1,
    updated_at: '2026-08-19T10:00:00Z',
    authority: 'stefano',
    records: [
      {
        learning_id: 'LEARN-001',
        title: 'Boundary strictness pays off',
        status: 'PROMOTED',
        record_path: 'wcm/kb/learning/records/LEARN-001.md',
        created_at: '2026-08-01T00:00:00Z',
        last_reviewed_at: '2026-08-15T00:00:00Z',
        confidence: 'HIGH',
        generalizability: 'METHOD_WIDE',
        origin_refs: ['projects/prima-di-noi/...'],
        promoted_to: ['wcm/method/DEC-007.md'],
        revisit_trigger: 'next material delta',
      },
    ],
  })
  assert(!('error' in parsed))
  if ('error' in parsed) return
  assertEquals(parsed.rows.length, 1)
  assertEquals(parsed.rows[0].origin_created_at, '2026-08-01T00:00:00Z')
  assertEquals(parsed.rows[0].sort_order, 0)
})

Deno.test('learning_inbox keeps reviewed events', () => {
  const parsed = parseLearningInbox({
    schema_version: 1,
    updated_at: '2026-08-19T10:00:00Z',
    cursor_sha: 'deadbeef',
    events: [
      {
        event_id: 'EV-1',
        detected_at: '2026-08-18T00:00:00Z',
        source_sha: 'aaa',
        source_committed_at: '2026-08-17T00:00:00Z',
        source_type: 'PROJECT_DELTA',
        summary: 'Nuovo delta',
        changed_paths: ['a.md'],
        review_status: 'REVIEWED',
        reviewed_at: '2026-08-18T12:00:00Z',
        review_note: 'ok',
        linked_learning_ids: ['LEARN-001'],
        repair_evidence_sha: 'bbb',
      },
    ],
  })
  assert(!('error' in parsed))
  if ('error' in parsed) return
  assertEquals(parsed.rows[0].review_status, 'REVIEWED')
  assertEquals(parsed.metadata.cursor_sha, 'deadbeef')
})

Deno.test('method_relationships maps source/relation/target', () => {
  const parsed = parseMethodRelationships({
    schema_version: 1,
    updated_at: '2026-08-19T10:00:00Z',
    relation_vocabulary: ['SUPPORTS'],
    relations: [
      {
        relation_id: 'REL-1',
        source: 'LEARN-001',
        relation: 'SUPPORTS',
        target: 'DEC-007',
        status: 'OPEN',
        rationale: 'because',
        evidence_refs: ['EV-1'],
        last_verified_at: '2026-08-18T00:00:00Z',
      },
    ],
  })
  assert(!('error' in parsed))
  if ('error' in parsed) return
  assertEquals(parsed.rows[0].source_node, 'LEARN-001')
  assertEquals(parsed.rows[0].relation_type, 'SUPPORTS')
  assertEquals(parsed.rows[0].target_node, 'DEC-007')
})

Deno.test('relations reject unknown keys', () => {
  const parsed = parseMethodRelationships({ relations: [{ relation_id: 'R', weird: true }] })
  assert('error' in parsed)
})
