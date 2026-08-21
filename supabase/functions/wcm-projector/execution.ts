/**
 * DEC-012 — Session-Independent Workflow Execution.
 *
 * Execution workflows are an OBSERVATION read-model: GitHub main stays the
 * source of truth and Mission Control never resumes, cancels or completes a
 * workflow. This module only validates/normalizes the projected payload.
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

const JSON_ARRAY_FIELDS = ['authority_refs', 'interruption_evidence', 'completed_step_ids']

const asJsonArray = (value: unknown): unknown[] | null => {
  if (value === undefined || value === null) return null
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parsed
    } catch (_e) {
      // fall through: a bare string is a single-element list
    }
    return [trimmed]
  }
  return [value]
}

const asJsonObject = (value: unknown): Record<string, unknown> | null => {
  if (value === undefined || value === null) return null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') return null
    try {
      const parsed = JSON.parse(trimmed)
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : null
    } catch (_e) {
      return null
    }
  }
  if (typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>
  return null
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
 * Validates a single projected workflow record and returns the DB row.
 * The project_id is always enforced by the backend, never trusted from input.
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
  const str = (key: string): string | null => {
    const value = obj[key]
    if (typeof value !== 'string') return value === undefined || value === null ? null : String(value)
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
  }

  for (const required of ['workflow_instance_id', 'workflow', 'status', 'true_stop_condition']) {
    if (str(required) === null) {
      return { error: `execution_workflows[${index}].${required} is required`, index }
    }
  }

  const status = String(str('status')).toUpperCase().replace(/[\s-]+/g, '_')
  if (!(EXECUTION_WORKFLOW_STATUSES as readonly string[]).includes(status)) {
    return { error: `execution_workflows[${index}].status is not a valid enum value`, index, status }
  }

  const sourcePath = str('source_path')
  if (sourcePath !== null && !isValidWorkflowSourcePath(sourcePath, projectId)) {
    return {
      error: `execution_workflows[${index}].source_path is not allowed`,
      index,
      path: sourcePath,
    }
  }

  const row: Record<string, unknown> = {
    project_id: projectId,
    workflow_instance_id: str('workflow_instance_id'),
    workflow: str('workflow'),
    status,
    scope: str('scope'),
    last_completed_transition: str('last_completed_transition'),
    next_transition: str('next_transition'),
    true_stop_condition: str('true_stop_condition'),
    started_at: str('started_at'),
    last_checkpoint_at: str('last_checkpoint_at'),
    resume_required: obj.resume_required === true || obj.resume_required === 'true',
    interruption_type: str('interruption_type'),
    interruption_reason: str('interruption_reason'),
    completion_gate: asJsonObject(obj.completion_gate),
    source_path: sourcePath,
    source_sha: str('source_sha'),
    sort_order: Number.isFinite(Number(obj.sort_order)) ? Number(obj.sort_order) : index,
  }

  for (const field of JSON_ARRAY_FIELDS) {
    row[field] = asJsonArray(obj[field]) ?? []
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
