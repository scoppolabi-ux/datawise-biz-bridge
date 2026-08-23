// DEC-014 — deterministic operational overrides derived from the runtime
// execution state. No fuzzy/semantic inference: exact enum matching only.

// Board metadata keys accepted on `body.board` but NOT persisted (no column).
export const BOARD_METADATA_KEYS = [
  'target_document_id',
  'need_id',
  'workflow_instance_id',
] as const

// Metadata keys accepted on `needs[]` items but NOT persisted (no column).
// The renderer emits them for the command surface; the read-model ignores them.
export const NEED_METADATA_KEYS = ['command_options', 'workflow_instance_id'] as const

export type CollectionItemPartition =
  | { error: 'Unsupported fields'; fields: string[] }
  | { persisted: Record<string, unknown>; metadata: Record<string, unknown> }

// Splits a collection item into persisted fields and accepted-but-unpersisted metadata.
// Any key that is neither a known field nor declared metadata is rejected.
export function partitionCollectionItem(
  item: Record<string, unknown>,
  fields: readonly string[],
  metadataKeys: readonly string[],
): CollectionItemPartition {
  const unknown = Object.keys(item).filter(
    (k) => !fields.includes(k) && !metadataKeys.includes(k),
  )
  if (unknown.length > 0) return { error: 'Unsupported fields', fields: unknown }

  const persisted: Record<string, unknown> = {}
  const metadata: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(item)) {
    if (metadataKeys.includes(k)) metadata[k] = v
    else persisted[k] = v
  }
  return { persisted, metadata }
}



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

export type BoardPartition =
  | { error: string; fields: string[] }
  | { fields: Record<string, unknown>; metadata: Record<string, unknown> }

// Splits a board block into persisted fields and accepted-but-unpersisted metadata.
export function partitionBoardBlock(
  block: Record<string, unknown>,
  boardFields: Record<string, string>,
): BoardPartition {
  const metadataKeys = BOARD_METADATA_KEYS as readonly string[]
  const unknown = Object.keys(block).filter(
    (k) => !(k in boardFields) && !metadataKeys.includes(k),
  )
  if (unknown.length > 0) return { error: 'Unsupported board fields', fields: unknown }

  const fields: Record<string, unknown> = {}
  const metadata: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(block)) {
    if (metadataKeys.includes(k)) metadata[k] = v
    else fields[boardFields[k]] = v
  }
  return { fields, metadata }
}
