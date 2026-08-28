import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { parseTechnicalIssues, validateIssueSourcePath } from './normalize.ts'

const issue = (over: Record<string, unknown> = {}) => ({
  schema_version: '1.0',
  issue_id: 'WCM-ISSUE-20260828-AB12CD34EF',
  project_id: 'prima-di-noi',
  issue_type: 'TECHNICAL_CONSISTENCY',
  title: 'Workflow state inconsistente',
  status: 'OPEN',
  blocking: true,
  detected_by: 'wcm-workflow-validator',
  detected_at: '2026-08-28T10:00:00Z',
  error_code: 'WF_STATE_MISMATCH',
  detail: 'next_transition non coerente con completed_step_ids',
  source_path: 'projects/prima-di-noi/runtime/workflows/board-gate.json',
  source_sha: 'a'.repeat(40),
  opened_at: '2026-08-28T10:00:00Z',
  closed_at: null,
  closed_by: null,
  resolution_note: null,
  ...over,
})

const payload = (issues: unknown[]) => ({
  schema_version: '1.0',
  project_id: 'prima-di-noi',
  issues,
})

Deno.test('accepts a valid OPEN issue', () => {
  const parsed = parseTechnicalIssues(payload([issue()]))
  assert(!('error' in parsed))
  assertEquals(parsed.projectId, 'prima-di-noi')
  assertEquals(parsed.rows.length, 1)
  assertEquals(parsed.rows[0].status, 'OPEN')
  assertEquals(parsed.rows[0].closed_at, null)
})

Deno.test('accepts the CLOSED lifecycle with closure metadata', () => {
  const parsed = parseTechnicalIssues(
    payload([
      issue({
        status: 'CLOSED',
        closed_at: '2026-08-29T09:00:00Z',
        closed_by: 'wcm-executor',
        resolution_note: 'Workflow rigenerato',
      }),
    ]),
  )
  assert(!('error' in parsed))
  assertEquals(parsed.rows[0].closed_by, 'wcm-executor')
  assertEquals(parsed.rows[0].resolution_note, 'Workflow rigenerato')
})

Deno.test('rejects CLOSED without closed_at and OPEN with closed_at', () => {
  assert('error' in parseTechnicalIssues(payload([issue({ status: 'CLOSED' })])))
  assert(
    'error' in
      parseTechnicalIssues(payload([issue({ closed_at: '2026-08-29T09:00:00Z' })])),
  )
})

Deno.test('rejects malformed issue_id', () => {
  assert('error' in parseTechnicalIssues(payload([issue({ issue_id: 'ISSUE-1' })])))
  assert(
    'error' in parseTechnicalIssues(payload([issue({ issue_id: 'WCM-ISSUE-2026-ABCDEFGHIJ' })])),
  )
})

Deno.test('rejects unknown status and unknown fields', () => {
  assert('error' in parseTechnicalIssues(payload([issue({ status: 'RESOLVED' })])))
  assert('error' in parseTechnicalIssues(payload([issue({ severity: 'high' })])))
  assert(
    'error' in
      parseTechnicalIssues({ schema_version: '1.0', project_id: 'x', issues: [], extra: 1 }),
  )
})

Deno.test('rejects bad schema_version, sha and duplicates', () => {
  assert('error' in parseTechnicalIssues(payload([issue({ schema_version: '2.0' })])))
  assert('error' in parseTechnicalIssues(payload([issue({ source_sha: 'ABC' })])))
  assert('error' in parseTechnicalIssues(payload([issue(), issue()])))
})

Deno.test('validates project scope of source_path', () => {
  assertEquals(
    validateIssueSourcePath('prima-di-noi', 'projects/prima-di-noi/runtime/workflows/a.json'),
    'projects/prima-di-noi/runtime/workflows/a.json',
  )
  assertEquals(validateIssueSourcePath('prima-di-noi', 'projects/other/runtime/workflows/a.json'), null)
  assertEquals(validateIssueSourcePath('prima-di-noi', 'projects/prima-di-noi/runtime/a.json'), null)
  assertEquals(
    validateIssueSourcePath('prima-di-noi', 'projects/prima-di-noi/runtime/workflows/a.md'),
    null,
  )
  assertEquals(
    validateIssueSourcePath('prima-di-noi', 'projects/prima-di-noi/runtime/workflows/../x.json'),
    null,
  )
  assertEquals(
    validateIssueSourcePath('prima-di-noi', 'https://evil/projects/prima-di-noi/runtime/workflows/a.json'),
    null,
  )
})

Deno.test('rejects issue.project_id mismatch', () => {
  assert('error' in parseTechnicalIssues(payload([issue({ project_id: 'altro' })])))
})
