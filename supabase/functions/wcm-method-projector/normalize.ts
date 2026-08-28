/**
 * WCM Learning V0.8 — boundary normalization for the GLOBAL method learning
 * read-model. GitHub main stays the source of truth; this module maps the
 * canonical `wcm/kb/learning/*.json` shapes deterministically onto DB columns.
 *
 * Strictness invariant: genuinely unknown keys are rejected (400). Canonical
 * metadata keys are accepted explicitly and either validated or dropped, never
 * silently folded into another column, and never invented.
 */

export type ParseError = { error: string; fields?: string[]; index?: number }

export const normalize = (value: unknown): unknown => {
  if (value === undefined) return null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
  }
  return value
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v)

const asJsonArray = (v: unknown): unknown[] | null => (Array.isArray(v) ? v : null)

// ---------------------------------------------------------------- health

export const METHOD_HEALTH_FIELDS = [
  'checked_at',
  'health_status',
  'method_integrity_score',
  'score_method',
  'last_material_method_delta_sha',
  'last_material_method_delta_at',
  'components',
  'metrics',
  'issues',
  'source_path',
  'source_sha',
] as readonly string[]

/** Accepted but not persisted verbatim. */
export const METHOD_HEALTH_META_KEYS = ['schema_version', 'system_id'] as readonly string[]

export function parseMethodHealth(
  input: unknown,
): { row: Record<string, unknown>; metadata: Record<string, unknown> } | ParseError {
  if (!isObject(input)) return { error: 'method_health must be an object' }

  const unknown = Object.keys(input).filter(
    (k) => !METHOD_HEALTH_FIELDS.includes(k) && !METHOD_HEALTH_META_KEYS.includes(k),
  )
  if (unknown.length > 0) return { error: 'Unsupported method_health fields', fields: unknown }

  if (input.system_id !== undefined && input.system_id !== null && input.system_id !== 'wcm') {
    return { error: 'method_health.system_id must be "wcm"' }
  }

  const row: Record<string, unknown> = { system_id: 'wcm' }
  for (const field of METHOD_HEALTH_FIELDS) {
    if (!(field in input)) continue
    const value = normalize(input[field])
    if (field === 'components' || field === 'metrics') {
      if (value !== null && !isObject(value)) return { error: `method_health.${field} must be an object` }
      row[field] = value ?? {}
    } else if (field === 'issues') {
      const arr = value === null ? [] : asJsonArray(value)
      if (arr === null) return { error: 'method_health.issues must be an array' }
      row[field] = arr
    } else if (field === 'method_integrity_score') {
      if (value !== null && typeof value !== 'number') {
        return { error: 'method_health.method_integrity_score must be a number' }
      }
      row[field] = value
    } else {
      row[field] = value
    }
  }
  if (row.health_status === undefined || row.health_status === null) row.health_status = 'UNKNOWN'

  const metadata: Record<string, unknown> = {}
  if ('schema_version' in input) metadata.schema_version = input.schema_version

  return { row, metadata }
}

// --------------------------------------------------------------- records

const RECORD_KEYS = [
  'learning_id',
  'title',
  'status',
  'record_path',
  'created_at',
  'last_reviewed_at',
  'promoted_at',
  'confidence',
  'generalizability',
  'origin_refs',
  'promoted_to',
  'revisit_trigger',
  'sort_order',
] as readonly string[]

/** learning_ledger accepts either the canonical file object or a bare array. */
export function parseLearningLedger(
  input: unknown,
): { rows: Record<string, unknown>[]; metadata: Record<string, unknown> } | ParseError {
  let records: unknown
  const metadata: Record<string, unknown> = {}

  if (Array.isArray(input)) {
    records = input
  } else if (isObject(input)) {
    const unknown = Object.keys(input).filter(
      (k) => !['schema_version', 'updated_at', 'authority', 'records'].includes(k),
    )
    if (unknown.length > 0) return { error: 'Unsupported learning_ledger fields', fields: unknown }
    metadata.schema_version = input.schema_version ?? null
    metadata.updated_at = input.updated_at ?? null
    metadata.authority = input.authority ?? null
    records = input.records ?? []
  } else {
    return { error: 'learning_ledger must be an object or an array' }
  }

  if (!Array.isArray(records)) return { error: 'learning_ledger.records must be an array' }

  const rows: Record<string, unknown>[] = []
  for (const [index, item] of records.entries()) {
    if (!isObject(item)) return { error: 'learning_ledger.records item must be an object', index }
    const unknown = Object.keys(item).filter((k) => !RECORD_KEYS.includes(k))
    if (unknown.length > 0) {
      return { error: 'Unsupported learning record fields', index, fields: unknown }
    }
    if (normalize(item.learning_id) === null) {
      return { error: 'learning_ledger.records item requires learning_id', index }
    }
    if (normalize(item.title) === null) {
      return { error: 'learning_ledger.records item requires title', index }
    }
    const originRefs = item.origin_refs === undefined ? [] : asJsonArray(item.origin_refs)
    if (originRefs === null) return { error: 'origin_refs must be an array', index }
    const promotedTo = item.promoted_to === undefined ? [] : asJsonArray(item.promoted_to)
    if (promotedTo === null) return { error: 'promoted_to must be an array', index }

    rows.push({
      learning_id: normalize(item.learning_id),
      title: normalize(item.title),
      status: normalize(item.status),
      record_path: normalize(item.record_path),
      // Canonical `created_at` is the learning's own creation instant; it is kept
      // in a dedicated column so it never collides with the row bookkeeping one.
      origin_created_at: normalize(item.created_at),
      last_reviewed_at: normalize(item.last_reviewed_at),
      // Semantic promotion instant: supplied by the GitHub source, never
      // inferred from row bookkeeping (updated_at) on this side.
      promoted_at: normalize(item.promoted_at),
      confidence: normalize(item.confidence),
      generalizability: normalize(item.generalizability),
      origin_refs: originRefs,
      promoted_to: promotedTo,
      revisit_trigger: normalize(item.revisit_trigger),
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : index,
    })
  }
  return { rows, metadata }
}

// -------------------------------------------------------------- evidence

const EVIDENCE_KEYS = [
  'event_id',
  'detected_at',
  'source_sha',
  'source_ref',
  'source_committed_at',
  'source_type',
  'summary',
  'changed_paths',
  'review_status',
  'reviewed_at',
  'review_note',
  'linked_learning_ids',
  'repair_evidence_sha',
  'sort_order',
] as readonly string[]

export function parseLearningInbox(
  input: unknown,
): { rows: Record<string, unknown>[]; metadata: Record<string, unknown> } | ParseError {
  let events: unknown
  const metadata: Record<string, unknown> = {}

  if (Array.isArray(input)) {
    events = input
  } else if (isObject(input)) {
    const unknown = Object.keys(input).filter(
      (k) =>
        ![
          'schema_version',
          'updated_at',
          'cursor_sha',
          'review_window',
          'classification_notes',
          'events',
        ].includes(k),
    )
    if (unknown.length > 0) return { error: 'Unsupported learning_inbox fields', fields: unknown }
    for (const key of ['review_window', 'classification_notes'] as const) {
      const value = input[key]
      if (value !== undefined && value !== null && !isObject(value)) {
        return { error: `learning_inbox.${key} must be an object or null` }
      }
      // Canonical source metadata: preserved as metadata only, never a DB column.
      metadata[key] = value ?? null
    }
    metadata.schema_version = input.schema_version ?? null
    metadata.updated_at = input.updated_at ?? null
    metadata.cursor_sha = input.cursor_sha ?? null
    events = input.events ?? []
  } else {
    return { error: 'learning_inbox must be an object or an array' }
  }

  if (!Array.isArray(events)) return { error: 'learning_inbox.events must be an array' }

  const rows: Record<string, unknown>[] = []
  for (const [index, item] of events.entries()) {
    if (!isObject(item)) return { error: 'learning_inbox.events item must be an object', index }
    const unknown = Object.keys(item).filter((k) => !EVIDENCE_KEYS.includes(k))
    if (unknown.length > 0) {
      return { error: 'Unsupported evidence fields', index, fields: unknown }
    }
    if (normalize(item.event_id) === null) {
      return { error: 'learning_inbox.events item requires event_id', index }
    }
    const changedPaths = item.changed_paths === undefined ? [] : asJsonArray(item.changed_paths)
    if (changedPaths === null) return { error: 'changed_paths must be an array', index }
    const linked =
      item.linked_learning_ids === undefined ? [] : asJsonArray(item.linked_learning_ids)
    if (linked === null) return { error: 'linked_learning_ids must be an array', index }

    rows.push({
      event_id: normalize(item.event_id),
      detected_at: normalize(item.detected_at),
      source_sha: normalize(item.source_sha),
      // Canonical source ref (e.g. `commit-prefix:...`): mapped exactly from
      // source with trim/null normalization only, never inferred.
      source_ref: normalize(item.source_ref),
      source_committed_at: normalize(item.source_committed_at),
      source_type: normalize(item.source_type),
      summary: normalize(item.summary),
      changed_paths: changedPaths,
      review_status: normalize(item.review_status),
      reviewed_at: normalize(item.reviewed_at),
      review_note: normalize(item.review_note),
      linked_learning_ids: linked,
      repair_evidence_sha: normalize(item.repair_evidence_sha),
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : index,
    })
  }
  return { rows, metadata }
}

// ------------------------------------------------------------- relations

const RELATION_KEYS = [
  'relation_id',
  'source',
  'relation',
  'target',
  'status',
  'rationale',
  'evidence_refs',
  'last_verified_at',
  'sort_order',
] as readonly string[]

export function parseMethodRelationships(
  input: unknown,
): { rows: Record<string, unknown>[]; metadata: Record<string, unknown> } | ParseError {
  let relations: unknown
  const metadata: Record<string, unknown> = {}

  if (Array.isArray(input)) {
    relations = input
  } else if (isObject(input)) {
    const unknown = Object.keys(input).filter(
      (k) => !['schema_version', 'updated_at', 'relation_vocabulary', 'relations'].includes(k),
    )
    if (unknown.length > 0) {
      return { error: 'Unsupported method_relationships fields', fields: unknown }
    }
    metadata.schema_version = input.schema_version ?? null
    metadata.updated_at = input.updated_at ?? null
    metadata.relation_vocabulary = input.relation_vocabulary ?? null
    relations = input.relations ?? []
  } else {
    return { error: 'method_relationships must be an object or an array' }
  }

  if (!Array.isArray(relations)) return { error: 'method_relationships.relations must be an array' }

  const rows: Record<string, unknown>[] = []
  for (const [index, item] of relations.entries()) {
    if (!isObject(item)) return { error: 'method_relationships.relations item must be an object', index }
    const unknown = Object.keys(item).filter((k) => !RELATION_KEYS.includes(k))
    if (unknown.length > 0) return { error: 'Unsupported relation fields', index, fields: unknown }
    if (normalize(item.relation_id) === null) {
      return { error: 'method_relationships.relations item requires relation_id', index }
    }
    const evidenceRefs = item.evidence_refs === undefined ? [] : asJsonArray(item.evidence_refs)
    if (evidenceRefs === null) return { error: 'evidence_refs must be an array', index }

    rows.push({
      relation_id: normalize(item.relation_id),
      source_node: normalize(item.source),
      relation_type: normalize(item.relation),
      target_node: normalize(item.target),
      status: normalize(item.status),
      rationale: normalize(item.rationale),
      evidence_refs: evidenceRefs,
      last_verified_at: normalize(item.last_verified_at),
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : index,
    })
  }
  return { rows, metadata }
}

// ------------------------------------------------------------------ gates

/**
 * Global Method Change Gates (e.g. promotion of a VALIDATED learning that
 * canonically requires PROC-004 + explicit Stefano authority).
 *
 * Gates are EXPLICIT structured objects supplied by the GitHub source. This
 * layer never infers a gate from a learning status such as VALIDATED.
 */
const GATE_KEYS = [
  'gate_id',
  'gate_type',
  'learning_id',
  'title',
  'status',
  'authority_required',
  'procedure_refs',
  'impact_preview_refs',
  'opened_at',
  'decided_at',
  'decided_by',
  'source_path',
  'source_sha',
  'revision',
  'sort_order',
  // Authority decision metadata, recorded by the canonical GitHub authority
  // recorder after an authority command. Optional, exact keys only.
  'decision_command_id',
  'decision_command_type',
  'decision_note',
  'authority_receipt_path',
] as readonly string[]

/**
 * Explicit integer gate revision, the ONLY optimistic-concurrency authority
 * for method change gate commands. Must be a positive integer >= 1; absent
 * means the legacy pre-revision baseline, defaulted to 1.
 */
const parseGateRevision = (value: unknown): number | null => {
  if (value === undefined || value === null) return 1
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) return null
  return value
}

/**
 * Exact allowed lifecycle for GLOBAL method change gates. Absent status
 * defaults to OPEN (legacy baseline); any supplied status outside this set
 * fails closed. No fuzzy interpretation.
 *
 * AUTHORITY_APPROVED means the authority decision has been RECORDED by the
 * GitHub authority recorder — it does NOT mean the baseline is already
 * modified (that is EXECUTED).
 */
const GATE_STATUSES = [
  'OPEN',
  'AUTHORITY_APPROVED',
  'CHANGES_REQUESTED',
  'REJECTED',
  'EXECUTED',
] as readonly string[]

const parseGateStatus = (value: unknown): string | null => {
  const status = normalize(value)
  if (status === null || status === undefined) return 'OPEN'
  const s = status as string
  return GATE_STATUSES.includes(s) ? s : null
}

/**
 * Exact allowed authority command types recorded on a gate decision.
 * Null/absent is valid (no decision yet); any other non-null value fails
 * closed.
 */
const DECISION_COMMAND_TYPES = [
  'APPROVE_CHANGE_GATE',
  'REQUEST_CHANGES',
  'REJECT_CHANGE_GATE',
] as readonly string[]

const parseDecisionCommandType = (value: unknown): string | null | undefined => {
  const normalized = normalize(value)
  if (normalized === null || normalized === undefined) return null
  const s = normalized as string
  return DECISION_COMMAND_TYPES.includes(s) ? s : undefined
}

export function parseMethodChangeGates(
  input: unknown,
): { rows: Record<string, unknown>[]; metadata: Record<string, unknown> } | ParseError {
  let gates: unknown
  const metadata: Record<string, unknown> = {}

  if (Array.isArray(input)) {
    gates = input
  } else if (isObject(input)) {
    const unknown = Object.keys(input).filter(
      (k) => !['schema_version', 'updated_at', 'gates'].includes(k),
    )
    if (unknown.length > 0) {
      return { error: 'Unsupported method_change_gates fields', fields: unknown }
    }
    metadata.schema_version = input.schema_version ?? null
    metadata.updated_at = input.updated_at ?? null
    gates = input.gates ?? []
  } else {
    return { error: 'method_change_gates must be an object or an array' }
  }

  if (!Array.isArray(gates)) return { error: 'method_change_gates.gates must be an array' }

  const rows: Record<string, unknown>[] = []
  for (const [index, item] of gates.entries()) {
    if (!isObject(item)) {
      return { error: 'method_change_gates.gates item must be an object', index }
    }
    const unknown = Object.keys(item).filter((k) => !GATE_KEYS.includes(k))
    if (unknown.length > 0) return { error: 'Unsupported gate fields', index, fields: unknown }
    if (normalize(item.gate_id) === null) {
      return { error: 'method_change_gates.gates item requires gate_id', index }
    }
    if (normalize(item.title) === null) {
      return { error: 'method_change_gates.gates item requires title', index }
    }
    const gateType = normalize(item.gate_type) ?? 'WCM_CHANGE_GATE'
    if (gateType !== 'WCM_CHANGE_GATE') {
      return { error: 'gate_type must be WCM_CHANGE_GATE', index }
    }
    const procedureRefs = item.procedure_refs === undefined ? [] : asJsonArray(item.procedure_refs)
    if (procedureRefs === null) return { error: 'procedure_refs must be an array', index }
    const impactRefs =
      item.impact_preview_refs === undefined ? [] : asJsonArray(item.impact_preview_refs)
    if (impactRefs === null) return { error: 'impact_preview_refs must be an array', index }
    const revision = parseGateRevision(item.revision)
    if (revision === null) {
      return { error: 'revision must be a positive integer >= 1', index }
    }
    const status = parseGateStatus(item.status)
    if (status === null) {
      return { error: 'status must be one of OPEN, AUTHORITY_APPROVED, CHANGES_REQUESTED, REJECTED, EXECUTED', index }
    }
    const decisionCommandType = parseDecisionCommandType(item.decision_command_type)
    if (decisionCommandType === undefined) {
      return {
        error: 'decision_command_type must be one of APPROVE_CHANGE_GATE, REQUEST_CHANGES, REJECT_CHANGE_GATE or null',
        index,
      }
    }

    rows.push({
      gate_id: normalize(item.gate_id),
      gate_type: gateType,
      learning_id: normalize(item.learning_id),
      title: normalize(item.title),
      status,
      authority_required: normalize(item.authority_required),
      procedure_refs: procedureRefs,
      impact_preview_refs: impactRefs,
      opened_at: normalize(item.opened_at),
      decided_at: normalize(item.decided_at),
      decided_by: normalize(item.decided_by),
      source_path: normalize(item.source_path),
      source_sha: normalize(item.source_sha),
      revision,
      decision_command_id: normalize(item.decision_command_id),
      decision_command_type: decisionCommandType,
      decision_note: normalize(item.decision_note),
      authority_receipt_path: normalize(item.authority_receipt_path),
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : index,
    })
  }
  return { rows, metadata }
}

// -------------------------------------------------- system maintenance log

/**
 * GLOBAL WCM System Maintenance Log (`wcm/runtime/WCM_MAINTENANCE_LOG.json`).
 *
 * Scope is WCM_SYSTEM: this is NOT project-scoped and never touches
 * wcm_project_activity. Deterministic, fail-closed, no semantic inference:
 * the status is stored exactly as declared by the source.
 */
const MAINTENANCE_ENTRY_KEYS = [
  'event_id',
  'occurred_on',
  'event_type',
  'title',
  'description',
  'technical_label',
  'status',
  'authority',
  'manifest_path',
  'source_path',
  'source_sha',
  'sort_order',
] as readonly string[]

const MAINTENANCE_TOP_KEYS = [
  'schema_version',
  'scope',
  'language_policy',
  'source_path',
  'source_sha',
  'entries',
] as readonly string[]

/** Exactly `YYYY-MM-DD`, or null. */
const parseOccurredOn = (value: unknown): string | null | undefined => {
  const normalized = normalize(value)
  if (normalized === null) return null
  if (typeof normalized !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return undefined
  return normalized
}

export function parseMaintenanceLog(
  input: unknown,
): { rows: Record<string, unknown>[]; metadata: Record<string, unknown> } | ParseError {
  if (!isObject(input)) return { error: 'maintenance_log must be an object' }

  const unknownTop = Object.keys(input).filter((k) => !MAINTENANCE_TOP_KEYS.includes(k))
  if (unknownTop.length > 0) {
    return { error: 'Unsupported maintenance_log fields', fields: unknownTop }
  }

  const scope = normalize(input.scope)
  if (scope !== null && scope !== 'WCM_SYSTEM') {
    return { error: 'maintenance_log.scope must be WCM_SYSTEM' }
  }

  const entries = input.entries === undefined ? [] : input.entries
  if (!Array.isArray(entries)) return { error: 'maintenance_log.entries must be an array' }

  const metadata: Record<string, unknown> = {
    schema_version: normalize(input.schema_version),
    language_policy: normalize(input.language_policy),
  }
  const logSourcePath = normalize(input.source_path) ?? 'wcm/runtime/WCM_MAINTENANCE_LOG.json'
  const logSourceSha = normalize(input.source_sha)

  const rows: Record<string, unknown>[] = []
  const seen = new Set<string>()
  for (const [index, item] of entries.entries()) {
    if (!isObject(item)) return { error: 'maintenance_log.entries item must be an object', index }
    const unknown = Object.keys(item).filter((k) => !MAINTENANCE_ENTRY_KEYS.includes(k))
    if (unknown.length > 0) {
      return { error: 'Unsupported maintenance_log entry fields', index, fields: unknown }
    }
    const eventId = normalize(item.event_id)
    if (eventId === null) {
      return { error: 'maintenance_log.entries item requires event_id', index }
    }
    if (seen.has(eventId as string)) {
      return { error: 'maintenance_log.entries contains a duplicate event_id', index }
    }
    seen.add(eventId as string)
    if (normalize(item.title) === null) {
      return { error: 'maintenance_log.entries item requires title', index }
    }
    const occurredOn = parseOccurredOn(item.occurred_on)
    if (occurredOn === undefined) {
      return { error: 'maintenance_log.entries occurred_on must be a YYYY-MM-DD date', index }
    }

    rows.push({
      event_id: eventId,
      occurred_on: occurredOn,
      event_type: normalize(item.event_type),
      title: normalize(item.title),
      description: normalize(item.description),
      technical_label: normalize(item.technical_label),
      status: normalize(item.status),
      authority: normalize(item.authority),
      manifest_path: normalize(item.manifest_path),
      scope: 'WCM_SYSTEM',
      schema_version: metadata.schema_version,
      language_policy: metadata.language_policy,
      source_path: normalize(item.source_path) ?? logSourcePath,
      source_sha: normalize(item.source_sha) ?? logSourceSha,
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : index,
    })
  }

  return { rows, metadata }
}

// -------------------------------------------------------------- snapshots


/** Ids present in the read-model but absent from the authoritative snapshot. */
export const computeStaleKeys = (existing: string[], keep: string[]): string[] =>
  existing.filter((k) => !keep.includes(k))
