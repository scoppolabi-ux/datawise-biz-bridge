/**
 * DEC-013 — pure diff helpers for deterministic/idempotent knowledge writes.
 *
 * Only the fields present in the normalized incoming row are compared: the
 * projector never asserts anything about columns it does not project.
 * Comparison is stable (deterministic key ordering for JSON values) and
 * fail-closed: anything not provably equal is treated as a real change.
 */

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value ?? null) ?? 'null'
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`
}

function norm(value: unknown): unknown {
  if (value === undefined || value === null) return null
  if (typeof value === 'string') {
    const t = value.trim()
    return t === '' ? null : t
  }
  return value
}

export function stableFieldEqual(field: string, incoming: unknown, current: unknown): boolean {
  const a = norm(incoming)
  const b = norm(current)
  if (a === null || b === null) return a === b
  if (typeof a === 'object' || typeof b === 'object') {
    return stableStringify(a) === stableStringify(b)
  }
  if (field.endsWith('_at')) {
    const ta = Date.parse(String(a))
    const tb = Date.parse(String(b))
    if (!Number.isNaN(ta) && !Number.isNaN(tb)) return ta === tb
  }
  if (typeof a === 'boolean' || typeof b === 'boolean') return Boolean(a) === Boolean(b)
  return String(a) === String(b)
}

/** True when the incoming row is new or differs on at least one projected field. */
export function rowNeedsUpsert(
  incoming: Record<string, unknown>,
  current: Record<string, unknown> | null | undefined,
): boolean {
  if (!current) return true
  return Object.keys(incoming).some(
    (field) => !stableFieldEqual(field, incoming[field], current[field]),
  )
}

/**
 * Append/upsert-only checkpoint selection: returns only the checkpoints that are
 * new or genuinely different. Existing checkpoints omitted by the payload are
 * never touched (history is never deleted).
 */
export function selectChangedCheckpoints(
  incoming: Record<string, unknown>[],
  existing: Record<string, unknown>[],
): Record<string, unknown>[] {
  const byId = new Map<string, Record<string, unknown>>()
  for (const row of existing) byId.set(String(row.checkpoint_id), row)
  return incoming.filter((row) => rowNeedsUpsert(row, byId.get(String(row.checkpoint_id))))
}
