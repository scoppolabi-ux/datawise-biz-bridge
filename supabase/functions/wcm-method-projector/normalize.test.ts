import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import {
  computeStaleKeys,
  parseLearningInbox,
  parseLearningLedger,
  parseMethodChangeGates,
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

// ---------------------------------------------------------- hardening V0.8.1

Deno.test('learning_ledger carries promoted_at from source, never inferred', () => {
  const parsed = parseLearningLedger({
    records: [
      {
        learning_id: 'LEARN-009',
        title: 'Promoted learning',
        status: 'PROMOTED',
        promoted_at: '2026-08-23T14:30:00Z',
      },
      {
        learning_id: 'LEARN-010',
        title: 'Candidate learning',
        status: 'CANDIDATE',
      },
    ],
  })
  assert(!('error' in parsed))
  if ('error' in parsed) return
  assertEquals(parsed.rows[0].promoted_at, '2026-08-23T14:30:00Z')
  // absent from source -> null, never derived from updated_at or anything else
  assertEquals(parsed.rows[1].promoted_at, null)
})

Deno.test('a VALIDATED learning produces NO gate fields (no gate inference)', () => {
  const parsed = parseLearningLedger({
    records: [
      {
        learning_id: 'WCM-LRN-004',
        title: 'Remote persistent writes need payload guards',
        status: 'VALIDATED',
        confidence: 'HIGH',
        generalizability: 'HIGH',
      },
    ],
  })
  assert(!('error' in parsed))
  if ('error' in parsed) return
  const row = parsed.rows[0]
  assertEquals(row.status, 'VALIDATED')
  // The row must not gain any gate/authority field from the VALIDATED status.
  for (const key of Object.keys(row)) {
    assert(!key.includes('gate'), `unexpected gate field: ${key}`)
    assert(!key.includes('authority'), `unexpected authority field: ${key}`)
  }
})

Deno.test('stale PENDING evidence converges to DUPLICATE via event_id upsert payload', () => {
  // Regression: evt-ecef7b114b080003 was stuck at PENDING in the read model
  // while GitHub already had it DUPLICATE linked to WCM-LRN-005.
  const parsed = parseLearningInbox({
    schema_version: 1,
    events: [
      {
        event_id: 'evt-ecef7b114b080003',
        detected_at: '2026-08-20T00:00:00Z',
        source_type: 'PROJECT_DELTA',
        summary: 'Duplicate of an existing learning',
        changed_paths: ['x.md'],
        review_status: 'DUPLICATE',
        reviewed_at: '2026-08-22T10:00:00Z',
        review_note: 'Already covered by WCM-LRN-005',
        linked_learning_ids: ['WCM-LRN-005'],
      },
    ],
  })
  assert(!('error' in parsed))
  if ('error' in parsed) return
  const row = parsed.rows[0]
  // Same stable key -> upsert updates the existing row in place.
  assertEquals(row.event_id, 'evt-ecef7b114b080003')
  assertEquals(row.review_status, 'DUPLICATE')
  assertEquals(row.linked_learning_ids, ['WCM-LRN-005'])
  assertEquals(row.reviewed_at, '2026-08-22T10:00:00Z')
  assertEquals(row.review_note, 'Already covered by WCM-LRN-005')
})

Deno.test('method_change_gates parses an explicit structured gate', () => {
  const parsed = parseMethodChangeGates({
    schema_version: 1,
    updated_at: '2026-08-24T09:00:00Z',
    gates: [
      {
        gate_id: 'WCM-GATE-001',
        learning_id: 'WCM-LRN-004',
        title: 'Promozione di WCM-LRN-004 alla baseline di metodo',
        status: 'OPEN',
        authority_required: 'stefano',
        procedure_refs: ['PROC-004'],
        impact_preview_refs: ['wcm/method/PROT-001.md', 'wcm/kb/learning/records/WCM-LRN-004.md'],
        opened_at: '2026-08-23T00:00:00Z',
        source_path: 'wcm/kb/learning/METHOD_CHANGE_GATES.json',
      },
    ],
  })
  assert(!('error' in parsed))
  if ('error' in parsed) return
  assertEquals(parsed.rows.length, 1)
  const gate = parsed.rows[0]
  assertEquals(gate.gate_id, 'WCM-GATE-001')
  assertEquals(gate.gate_type, 'WCM_CHANGE_GATE')
  assertEquals(gate.status, 'OPEN')
  assertEquals(gate.authority_required, 'stefano')
  assertEquals(gate.procedure_refs, ['PROC-004'])
  assertEquals((gate.impact_preview_refs as string[]).length, 2)
})

Deno.test('method_change_gates rejects unknown fields and wrong gate_type', () => {
  assert('error' in parseMethodChangeGates({ gates: [{ gate_id: 'G', title: 't', nope: 1 }] }))
  assert(
    'error' in
      parseMethodChangeGates({ gates: [{ gate_id: 'G', title: 't', gate_type: 'BOARD_GATE' }] }),
  )
  assert('error' in parseMethodChangeGates({ gates: [{ title: 'missing id' }] }))
})

Deno.test('computeStaleKeys flags read-model rows missing from the snapshot', () => {
  assertEquals(computeStaleKeys(['a', 'b', 'c'], ['a']), ['b', 'c'])
  assertEquals(computeStaleKeys(['a'], ['a', 'b']), [])
  assertEquals(computeStaleKeys([], ['a']), [])
})

Deno.test('learning_inbox accepts canonical review_window and classification_notes metadata', () => {
  const parsed = parseLearningInbox({
    schema_version: 1,
    updated_at: '2026-08-24T09:00:00Z',
    cursor_sha: 'deadbeef',
    review_window: { from_sha: 'aaa', to_sha: 'bbb', pending_after_review: 0 },
    classification_notes: { mode: 'PROJECT_DELTA', note: 'classificazione euristica' },
    events: [
      {
        event_id: 'evt-ecef7b114b080003',
        detected_at: '2026-08-22T09:00:00Z',
        source_sha: 'bbb',
        source_type: 'PROJECT_DELTA',
        summary: 'Delta già coperto',
        changed_paths: ['projects/prima-di-noi/x.md'],
        review_status: 'DUPLICATE',
        reviewed_at: '2026-08-22T10:00:00Z',
        review_note: 'Already covered by WCM-LRN-005',
        linked_learning_ids: ['WCM-LRN-005'],
      },
    ],
  })
  assert(!('error' in parsed))
  if ('error' in parsed) return
  assertEquals(parsed.rows.length, 1)
  assertEquals(parsed.rows[0].review_status, 'DUPLICATE')
  // Canonical metadata preserved as metadata only.
  assertEquals(
    (parsed.metadata.review_window as Record<string, unknown>).pending_after_review,
    0,
  )
  assertEquals(
    (parsed.metadata.classification_notes as Record<string, unknown>).mode,
    'PROJECT_DELTA',
  )
  // Never leaked into DB evidence columns.
  assertEquals('review_window' in parsed.rows[0], false)
  assertEquals('classification_notes' in parsed.rows[0], false)
})

Deno.test('learning_inbox accepts null/absent review_window and classification_notes', () => {
  const parsed = parseLearningInbox({
    cursor_sha: 'aaa',
    review_window: null,
    classification_notes: null,
    events: [],
  })
  assert(!('error' in parsed))
  if ('error' in parsed) return
  assertEquals(parsed.metadata.review_window, null)
  assertEquals(parsed.metadata.classification_notes, null)
})

Deno.test('learning_inbox still rejects truly unknown top-level keys and invalid metadata types', () => {
  assert('error' in parseLearningInbox({ events: [], totally_unknown: 1 }))
  assert('error' in parseLearningInbox({ events: [], review_window: 'not-an-object' }))
  assert('error' in parseLearningInbox({ events: [], classification_notes: ['nope'] }))
})
