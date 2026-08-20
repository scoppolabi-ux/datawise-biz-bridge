/**
 * Knowledge Health boundary normalization (V0.6 integration fix).
 *
 * GitHub main stays the source of truth. The canonical WCM files
 * (`kb/knowledge-health/KNOWLEDGE_HEALTH.json` and `CHECKPOINTS.json`) carry
 * canonical metadata and flat metric shapes that the DB read-model does not
 * store verbatim. This module maps the canonical shape deterministically onto
 * the existing columns WITHOUT weakening validation: genuinely unknown keys are
 * still rejected.
 */

export const HEALTH_STATUSES = ['HEALTHY', 'DEGRADED', 'STALE', 'CRITICAL', 'UNKNOWN']

export const KNOWLEDGE_HEALTH_FIELDS = [
  'health_status',
  'knowledge_integrity_score',
  'score_method',
  'checked_at',
  'last_reconciliation_at',
  'last_material_delta_at',
  'components',
  'metrics',
  'issues',
  'checkpoint',
  'source_path',
  'source_sha',
  'notes',
] as readonly string[]

/**
 * Canonical metadata keys accepted on knowledge_health but NOT persisted as-is.
 * - project_id: validated against the top-level project_id, then dropped.
 * - schema_version: accepted and ignored (contract versioning only).
 * - last_material_delta: transparently mapped to the existing
 *   `last_material_delta_at` column when that column is not provided explicitly.
 * - last_material_delta_sha: no dedicated column; returned as unpersisted
 *   metadata. It is NEVER folded into `notes`.
 */
export const KNOWLEDGE_HEALTH_META_KEYS = [
  'schema_version',
  'project_id',
  'last_material_delta',
  'last_material_delta_sha',
] as readonly string[]

export const KNOWLEDGE_CHECKPOINT_FIELDS = [
  'checkpoint_id',
  'label',
  'occurred_at',
  'health_status',
  'knowledge_integrity_score',
  'metrics',
  'note',
  'source_path',
  'source_sha',
  'sort_order',
] as readonly string[]

/**
 * Canonical CHECKPOINTS.json uses flat metric keys instead of a `metrics`
 * object. These are collected deterministically into the `metrics` JSONB column.
 */
export const KNOWLEDGE_CHECKPOINT_FLAT_METRIC_KEYS = [
  'active_synapses',
  'new_synapses',
  'new_synapses_since_checkpoint',
  'modified_synapses',
  'modified_synapses_since_checkpoint',
  'at_risk_synapses',
  'broken_synapses',
  'orphan_nodes',
  'open_drifts',
  'continuity_debt',
  'payoff_debt',
  'synapse_snapshot',
] as readonly string[]

/** Canonical metadata keys accepted on a checkpoint but not persisted. */
export const KNOWLEDGE_CHECKPOINT_META_KEYS = [
  'schema_version',
  'project_id',
] as readonly string[]

export function normalize(value: unknown): unknown {
  if (value === undefined || value === null) return null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
  }
  return value
}

export type ParseError = { error: string; [key: string]: unknown }

export type KnowledgeHealthParse = {
  row: Record<string, unknown>
  /** Canonical values accepted but not persisted (echoed in the response). */
  metadata: Record<string, unknown>
}

export function parseKnowledgeHealth(
  input: unknown,
  projectId: string,
): KnowledgeHealthParse | ParseError {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'knowledge_health must be an object' }
  }
  const obj = input as Record<string, unknown>

  const unknown = Object.keys(obj).filter(
    (k) => !KNOWLEDGE_HEALTH_FIELDS.includes(k) && !KNOWLEDGE_HEALTH_META_KEYS.includes(k),
  )
  if (unknown.length > 0) {
    return { error: 'Unsupported knowledge_health fields', fields: unknown }
  }

  const declaredProject = normalize(obj.project_id)
  if (declaredProject !== null && String(declaredProject) !== projectId) {
    return {
      error: 'knowledge_health.project_id does not match project_id',
      value: declaredProject,
    }
  }

  const status = normalize(obj.health_status)
  if (status !== null && !HEALTH_STATUSES.includes(String(status).toUpperCase())) {
    return { error: 'Unsupported knowledge_health.health_status', value: status }
  }

  const row: Record<string, unknown> = { project_id: projectId }
  for (const field of KNOWLEDGE_HEALTH_FIELDS) {
    if (field in obj) row[field] = normalize(obj[field])
  }
  row.health_status = status ? String(status).toUpperCase() : 'UNKNOWN'

  // Canonical alias: only fills the column when it was not projected explicitly.
  const canonicalDelta = normalize(obj.last_material_delta)
  if (canonicalDelta !== null && (row.last_material_delta_at ?? null) === null) {
    row.last_material_delta_at = canonicalDelta
  }

  const metadata: Record<string, unknown> = {}
  if ('schema_version' in obj) metadata.schema_version = normalize(obj.schema_version)
  if (canonicalDelta !== null) metadata.last_material_delta = canonicalDelta
  const deltaSha = normalize(obj.last_material_delta_sha)
  if (deltaSha !== null) metadata.last_material_delta_sha = deltaSha

  return { row, metadata }
}

export function parseKnowledgeCheckpoints(
  input: unknown,
  projectId: string,
): Record<string, unknown>[] | ParseError {
  if (!Array.isArray(input)) return { error: 'knowledge_checkpoints must be an array' }

  const rows: Record<string, unknown>[] = []
  for (const [index, item] of input.entries()) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { error: `knowledge_checkpoints[${index}] must be an object` }
    }
    const obj = item as Record<string, unknown>

    const unknown = Object.keys(obj).filter(
      (k) =>
        !KNOWLEDGE_CHECKPOINT_FIELDS.includes(k) &&
        !KNOWLEDGE_CHECKPOINT_FLAT_METRIC_KEYS.includes(k) &&
        !KNOWLEDGE_CHECKPOINT_META_KEYS.includes(k),
    )
    if (unknown.length > 0) {
      return { error: 'Unsupported knowledge_checkpoints fields', index, fields: unknown }
    }

    const declaredProject = normalize(obj.project_id)
    if (declaredProject !== null && String(declaredProject) !== projectId) {
      return {
        error: `knowledge_checkpoints[${index}].project_id does not match project_id`,
        value: declaredProject,
      }
    }

    for (const required of ['checkpoint_id', 'label']) {
      if (normalize(obj[required]) === null) {
        return { error: `knowledge_checkpoints[${index}].${required} is required` }
      }
    }

    const status = normalize(obj.health_status)
    if (status !== null && !HEALTH_STATUSES.includes(String(status).toUpperCase())) {
      return {
        error: `Unsupported knowledge_checkpoints[${index}].health_status`,
        value: status,
      }
    }

    const row: Record<string, unknown> = { project_id: projectId }
    for (const field of KNOWLEDGE_CHECKPOINT_FIELDS) {
      if (field in obj) row[field] = normalize(obj[field])
    }

    // Flat canonical metrics are folded into the metrics JSONB column.
    // An explicit transport-shaped `metrics` object always wins per key.
    const flat: Record<string, unknown> = {}
    for (const key of KNOWLEDGE_CHECKPOINT_FLAT_METRIC_KEYS) {
      if (key in obj) flat[key] = normalize(obj[key])
    }
    const provided =
      row.metrics && typeof row.metrics === 'object' && !Array.isArray(row.metrics)
        ? (row.metrics as Record<string, unknown>)
        : null
    if (Object.keys(flat).length > 0 || provided) {
      row.metrics = { ...flat, ...(provided ?? {}) }
    }

    if (typeof row.health_status === 'string') {
      row.health_status = row.health_status.toUpperCase()
    }
    rows.push(row)
  }
  return rows
}
