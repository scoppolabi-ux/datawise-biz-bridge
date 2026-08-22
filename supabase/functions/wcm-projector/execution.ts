/**
 * DEC-012 + DEC-013 — Session-Independent Workflow Execution and
 * Deterministic Operational State Pipeline.
 *
 * Execution workflows are an OBSERVATION read-model. GitHub runtime JSON is
 * the execution master. This module performs exact validation/mapping only:
 * no fuzzy normalization, no string-to-boolean coercion, no JSON-in-string
 * recovery for structured fields.
 */

export const EXECUTION_WORKFLOW_STATUSES = [
  'ACTIVE',
  'INTERRUPTED_RESUMABLE',
  'WAITING_AUTHORITY',
  'BLOCKED',
  'COMPLETED',
  'CANCELLED',
] as const

export type ExecutionWorkflowStatus = (typeof EXECUTION_WORKFLOW_STATUSES)[number]

const JSON_ARRAY_FIELDS = ['authority_refs', 'interruption_evidence', 'completed_step_ids'] as const

const exactOptionalString = (
  obj: Record<string, unknown>,
  key: string,
): { value: string | null } | { error: string } => {
  const value = obj[key]
  if (value === undefined || value === null) return { value: null }
  if (typeof value !== 'string') return { error: `${key} must be a string or null` }
  if (value.trim() === '') return { value: null }
  return { value }
}

const exactArray = (value: unknown, field: string): unknown[] | { error: string } => {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) return { error: `${field} must be an array` }
  return value
}

const exactObject = (
  value: unknown,
  field: string,
): Record<string, unknown> | null | { error: string } => {
  if (value === undefined || value === null) return null
  if (typeof value !== 'object' || Array.isArray(value)) {
    return { error: `${field} must be an object or null` }
  }
  return value as Record<string, unknown>
}

/** source_path boundary: runtime workflow files only, inside the project. */
export const isValidWorkflowSourcePath = (path: string, projectId: string): boolean =>
  path.startsWith(`projects/${projectId}/runtime/workflows/`) &&
  !path.includes('..') &&
  path.endsWith('.json')

export type ExecutionWorkflowParse =
  | { error: string; index?: number; [key: string]: unknown }
  | { row: Record<string, unknown> }

/**
 * Exact validation of a single projected workflow record.
 * project_id is enforced by the backend and never trusted from input.
 */
export function parseExecutionWorkflow(
  input: unknown,
  projectId: string,
  index = 0,
): ExecutionWorkflowParse {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: `execution_workflows[${index}] must be an object`, index }
  }
  const obj = input as Record<string, unknown>

  const requiredStrings = ['workflow_instance_id', 'workflow', 'status', 'true_stop_condition'] as const
  const required: Record<string, string> = {}
  for (const key of requiredStrings) {
    const value = obj[key]
    if (typeof value !== 'string' || value.trim() === '') {
      return { error: `execution_workflows[${index}].${key} is required and must be a string`, index }
    }
    required[key] = value
  }

  const status = required.status
  if (!(EXECUTION_WORKFLOW_STATUSES as readonly string[]).includes(status)) {
    return { error: `execution_workflows[${index}].status is not a valid exact enum value`, index, status }
  }

  if (typeof obj.resume_required !== 'boolean') {
    return { error: `execution_workflows[${index}].resume_required is required and must be boolean`, index }
  }

  const optionalKeys = [
    'scope',
    'last_completed_transition',
    'next_transition',
    'started_at',
    'last_checkpoint_at',
    'interruption_type',
    'interruption_reason',
    'source_path',
    'source_sha',
  ] as const
  const optional: Record<string, string | null> = {}
  for (const key of optionalKeys) {
    const parsed = exactOptionalString(obj, key)
    if ('error' in parsed) {
      return { error: `execution_workflows[${index}].${parsed.error}`, index }
    }
    optional[key] = parsed.value
  }

  const sourcePath = optional.source_path
  if (sourcePath !== null && !isValidWorkflowSourcePath(sourcePath, projectId)) {
    return {
      error: `execution_workflows[${index}].source_path is not allowed`,
      index,
      path: sourcePath,
    }
  }

  const completionGate = exactObject(obj.completion_gate, 'completion_gate')
  if (completionGate && 'error' in completionGate) {
    return { error: `execution_workflows[${index}].${completionGate.error}`, index }
  }

  if (status === 'COMPLETED' && completionGate && 'closure_allowed' in completionGate) {
    if (completionGate.closure_allowed !== true) {
      return {
        error: `execution_workflows[${index}] is COMPLETED but completion_gate.closure_allowed is not true`,
        index,
      }
    }
  }

  const row: Record<string, unknown> = {
    project_id: projectId,
    workflow_instance_id: required.workflow_instance_id,
    workflow: required.workflow,
    status,
    scope: optional.scope,
    last_completed_transition: optional.last_completed_transition,
    next_transition: optional.next_transition,
    true_stop_condition: required.true_stop_condition,
    started_at: optional.started_at,
    last_checkpoint_at: optional.last_checkpoint_at,
    resume_required: obj.resume_required,
    interruption_type: optional.interruption_type,
    interruption_reason: optional.interruption_reason,
    completion_gate: completionGate,
    source_path: sourcePath,
    source_sha: optional.source_sha,
    sort_order: obj.sort_order === undefined || obj.sort_order === null
      ? index
      : (typeof obj.sort_order === 'number' && Number.isFinite(obj.sort_order)
        ? obj.sort_order
        : NaN),
  }

  if (Number.isNaN(row.sort_order)) {
    return { error: `execution_workflows[${index}].sort_order must be a finite number`, index }
  }

  for (const field of JSON_ARRAY_FIELDS) {
    const parsed = exactArray(obj[field], field)
    if (!Array.isArray(parsed)) {
      return { error: `execution_workflows[${index}].${parsed.error}`, index }
    }
    row[field] = parsed
  }

  return { row }
}

export function parseExecutionWorkflows(
  input: unknown,
  projectId: string,
): { error: string; [key: string]: unknown } | Record<string, unknown>[] {
  if (!Array.isArray(input)) return { error: 'execution_workflows must be an array' }
  const rows: Record<string, unknown>[] = []
  const seen = new Set<string>()
  for (const [index, item] of input.entries()) {
    const parsed = parseExecutionWorkflow(item, projectId, index)
    if ('error' in parsed) return parsed
    const key = String(parsed.row.workflow_instance_id)
    if (seen.has(key)) {
      return { error: `execution_workflows[${index}].workflow_instance_id is duplicated`, index }
    }
    seen.add(key)
    rows.push(parsed.row)
  }
  return rows
}
