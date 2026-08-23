// DEC-014 — deterministic operational overrides derived from the runtime
// execution state. No fuzzy/semantic inference: exact enum matching only.

// Board metadata keys accepted on `body.board` but NOT persisted (no column).
export const BOARD_METADATA_KEYS = [
  'target_document_id',
  'need_id',
  'workflow_instance_id',
] as const

// Exact execution_status → canonical project status.
export const EXECUTION_STATUS_TO_PROJECT_STATUS: Record<string, string> = {
  WAITING_AUTHORITY: 'waiting_board',
  INTERRUPTED_RESUMABLE: 'active_resume_required',
  ACTIVE: 'working',
  BLOCKED: 'blocked',
}

export type DerivedParseResult =
  | { error: string }
  | { overrides: Record<string, unknown> }

function exactString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

export function parseDerivedExecutionState(raw: unknown): DerivedParseResult {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: 'derived_execution_state must be an object' }
  }
  const d = raw as Record<string, unknown>
  const overrides: Record<string, unknown> = {}

  const executionStatus = exactString(d.execution_status)
  if (executionStatus === null) return { overrides }

  const mapped = EXECUTION_STATUS_TO_PROJECT_STATUS[executionStatus]
  // Unknown enum values are ignored (never guessed).
  if (!mapped) return { overrides }

  overrides.status = mapped

  if (executionStatus === 'WAITING_AUTHORITY') {
    overrides.needs_stefano = true
    const nextTransition = exactString(d.next_transition)
    if (nextTransition !== null) overrides.phase = nextTransition
  }

  return { overrides }
}
