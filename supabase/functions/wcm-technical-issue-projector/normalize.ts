/**
 * WCM Technical Issue Tracking V1 — deterministic, fail-closed parsing of the
 * technical issue ledger projected from GitHub main (scoppolabi-ux/WCM-LAB).
 *
 * Ledger semantics: issues are NEVER deleted by omission. Only upserts.
 */

export type ParseError = { error: string; fields?: string[] }

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

export const SCHEMA_VERSION = '1.0'
export const ISSUE_TYPES = ['TECHNICAL_CONSISTENCY'] as const
export const ISSUE_STATUSES = ['OPEN', 'CLOSED'] as const

export const ISSUE_KEYS = [
  'schema_version',
  'issue_id',
  'project_id',
  'issue_type',
  'title',
  'status',
  'blocking',
  'detected_by',
  'detected_at',
  'error_code',
  'detail',
  'source_path',
  'source_sha',
  'opened_at',
  'closed_at',
  'closed_by',
  'resolution_note',
] as const

export const TOP_LEVEL_KEYS = ['schema_version', 'project_id', 'issues'] as const

const PROJECT_ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/
const ISSUE_ID_RE = /^WCM-ISSUE-\d{8}-[A-Za-z0-9]{10}$/
const SHA_RE = /^[0-9a-f]{40}$/

const requiredString = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() !== '' ? v.trim() : null

const optionalString = (v: unknown): string | null | undefined => {
  if (v === null || v === undefined) return null
  if (typeof v === 'string') return v.trim() === '' ? null : v.trim()
  return undefined
}

const isoTimestamp = (v: unknown): string | null => {
  const s = requiredString(v)
  if (!s) return null
  const t = Date.parse(s)
  return Number.isNaN(t) ? null : s
}

/** `projects/<project_id>/runtime/workflows/*.json`, fail closed. */
export const validateIssueSourcePath = (projectId: string, raw: unknown): string | null => {
  const path = requiredString(raw)
  if (!path) return null
  if (path.includes('..') || path.includes('//') || path.includes('\\')) return null
  if (path.startsWith('/') || /[\s?#%:]/.test(path)) return null
  const prefix = `projects/${projectId}/runtime/workflows/`
  if (!path.startsWith(prefix)) return null
  const file = path.slice(prefix.length)
  if (!file.endsWith('.json')) return null
  if (!/^[A-Za-z0-9._-]+$/.test(file)) return null
  return path
}

export function parseTechnicalIssues(
  input: unknown,
): { projectId: string; rows: Record<string, unknown>[] } | ParseError {
  if (!isObject(input)) return { error: 'Body must be an object' }

  const unknownTop = Object.keys(input).filter(
    (k) => !(TOP_LEVEL_KEYS as readonly string[]).includes(k),
  )
  if (unknownTop.length > 0) {
    return { error: 'Unsupported top-level fields', fields: unknownTop }
  }

  if (input.schema_version !== SCHEMA_VERSION) {
    return { error: `schema_version must be ${SCHEMA_VERSION}` }
  }

  const projectId = requiredString(input.project_id)
  if (!projectId || !PROJECT_ID_RE.test(projectId)) return { error: 'Invalid project_id' }

  if (!Array.isArray(input.issues)) return { error: 'issues must be an array' }

  const rows: Record<string, unknown>[] = []
  const seen = new Set<string>()

  for (const raw of input.issues) {
    if (!isObject(raw)) return { error: 'Each issue must be an object' }

    const unknown = Object.keys(raw).filter(
      (k) => !(ISSUE_KEYS as readonly string[]).includes(k),
    )
    if (unknown.length > 0) return { error: 'Unsupported issue fields', fields: unknown }

    if (raw.schema_version !== SCHEMA_VERSION) {
      return { error: `issue.schema_version must be ${SCHEMA_VERSION}` }
    }

    const issueId = requiredString(raw.issue_id)
    if (!issueId || !ISSUE_ID_RE.test(issueId)) {
      return { error: 'Invalid issue_id', fields: [String(raw.issue_id ?? '')] }
    }
    if (seen.has(issueId)) return { error: 'Duplicate issue_id', fields: [issueId] }
    seen.add(issueId)

    if (requiredString(raw.project_id) !== projectId) {
      return { error: 'issue.project_id must match top-level project_id', fields: [issueId] }
    }

    const issueType = requiredString(raw.issue_type)
    if (!issueType || !(ISSUE_TYPES as readonly string[]).includes(issueType)) {
      return { error: 'Invalid issue_type', fields: [issueId] }
    }

    const status = requiredString(raw.status)
    if (!status || !(ISSUE_STATUSES as readonly string[]).includes(status)) {
      return { error: 'Invalid status', fields: [issueId] }
    }

    if (typeof raw.blocking !== 'boolean') {
      return { error: 'blocking must be a boolean', fields: [issueId] }
    }

    const title = requiredString(raw.title)
    const detectedBy = requiredString(raw.detected_by)
    const errorCode = requiredString(raw.error_code)
    const detail = requiredString(raw.detail)
    if (!title || !detectedBy || !errorCode || !detail) {
      return { error: 'Missing required issue text fields', fields: [issueId] }
    }

    const detectedAt = isoTimestamp(raw.detected_at)
    const openedAt = isoTimestamp(raw.opened_at)
    if (!detectedAt || !openedAt) {
      return { error: 'Invalid detected_at/opened_at', fields: [issueId] }
    }

    const sourcePath = validateIssueSourcePath(projectId, raw.source_path)
    if (!sourcePath) return { error: 'Invalid source_path', fields: [issueId] }

    const sourceSha = requiredString(raw.source_sha)
    if (!sourceSha || !SHA_RE.test(sourceSha)) {
      return { error: 'Invalid source_sha', fields: [issueId] }
    }

    const closedByRaw = optionalString(raw.closed_by)
    const resolutionRaw = optionalString(raw.resolution_note)
    if (closedByRaw === undefined || resolutionRaw === undefined) {
      return { error: 'Invalid closed_by/resolution_note', fields: [issueId] }
    }

    let closedAt: string | null = null
    if (raw.closed_at !== null && raw.closed_at !== undefined) {
      closedAt = isoTimestamp(raw.closed_at)
      if (!closedAt) return { error: 'Invalid closed_at', fields: [issueId] }
    }

    if (status === 'CLOSED' && !closedAt) {
      return { error: 'CLOSED issue requires closed_at', fields: [issueId] }
    }
    if (status === 'OPEN' && closedAt) {
      return { error: 'OPEN issue must not carry closed_at', fields: [issueId] }
    }

    rows.push({
      project_id: projectId,
      issue_id: issueId,
      issue_type: issueType,
      title,
      status,
      blocking: raw.blocking,
      detected_by: detectedBy,
      detected_at: detectedAt,
      error_code: errorCode,
      detail,
      source_path: sourcePath,
      source_sha: sourceSha,
      opened_at: openedAt,
      closed_at: closedAt,
      closed_by: closedByRaw,
      resolution_note: resolutionRaw,
      updated_at: new Date().toISOString(),
    })
  }

  return { projectId, rows }
}
