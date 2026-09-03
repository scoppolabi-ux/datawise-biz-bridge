/**
 * Writer Memory — collection opzionale, project-scoped, sola osservazione.
 *
 * GitHub/WCM main resta source of truth: qui si fa solo validazione esatta
 * (whitelist campi, enum status, confinamento source_path) e mapping in righe
 * del read-model. Nessuna derivazione da Activity o Markdown.
 */

export const WRITER_MEMORY_STATUSES = ['ACTIVE', 'SUPERSEDED', 'CLOSED'] as const
export type WriterMemoryStatus = (typeof WRITER_MEMORY_STATUSES)[number]

export const WRITER_MEMORY_FIELDS = [
  'memory_id',
  'scope',
  'category',
  'guidance',
  'origin_type',
  'origin_ref',
  'origin_context',
  'status',
  'source_path',
  'source_sha',
  'sort_order',
  // accettato ma ignorato: il project_id è sempre imposto server-side
  'project_id',
] as const

const REQUIRED = ['memory_id', 'scope', 'guidance', 'status'] as const

const str = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export type WriterMemoryParse =
  | { error: string; index?: number; [key: string]: unknown }
  | { row: Record<string, unknown> }

export const parseWriterMemoryItem = (
  item: unknown,
  projectId: string,
  sortOrder = 0,
): WriterMemoryParse => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return { error: 'writer_memory item must be an object' }
  }
  const obj = item as Record<string, unknown>

  const unknownFields = Object.keys(obj).filter(
    (k) => !(WRITER_MEMORY_FIELDS as readonly string[]).includes(k),
  )
  if (unknownFields.length > 0) {
    return { error: 'Unsupported writer_memory fields', fields: unknownFields }
  }

  for (const field of REQUIRED) {
    if (str(obj[field]) === null) {
      return { error: `writer_memory.${field} is required` }
    }
  }

  const status = str(obj.status) as string
  if (!(WRITER_MEMORY_STATUSES as readonly string[]).includes(status)) {
    return { error: 'writer_memory.status is not a valid state', status }
  }

  const sourcePath = str(obj.source_path)
  if (sourcePath !== null) {
    const prefix = `projects/${projectId}/`
    if (!sourcePath.startsWith(prefix) || sourcePath.includes('..')) {
      return { error: 'writer_memory.source_path is not allowed', path: sourcePath }
    }
  }

  const rawSort = obj.sort_order
  if (rawSort !== undefined && rawSort !== null && !Number.isInteger(rawSort)) {
    return { error: 'writer_memory.sort_order must be an integer' }
  }

  return {
    row: {
      project_id: projectId,
      memory_id: str(obj.memory_id),
      scope: str(obj.scope),
      category: str(obj.category),
      guidance: str(obj.guidance),
      origin_type: str(obj.origin_type),
      origin_ref: str(obj.origin_ref),
      origin_context: str(obj.origin_context),
      status,
      source_path: sourcePath,
      source_sha: str(obj.source_sha),
      sort_order: Number.isInteger(rawSort) ? (rawSort as number) : sortOrder,
    },
  }
}

/** Snapshot current-facing: gli item SUPERSEDED restano finché la source li mantiene. */
export const parseWriterMemory = (
  raw: unknown,
  projectId: string,
): Record<string, unknown>[] | { error: string; index?: number; [key: string]: unknown } => {
  if (!Array.isArray(raw)) return { error: 'writer_memory must be an array' }
  const rows: Record<string, unknown>[] = []
  const seen = new Set<string>()
  for (const [index, item] of raw.entries()) {
    const parsed = parseWriterMemoryItem(item, projectId, index)
    if ('error' in parsed) return { ...parsed, index }
    const key = String(parsed.row.memory_id)
    if (seen.has(key)) return { error: 'writer_memory.memory_id is duplicated', index, memory_id: key }
    seen.add(key)
    rows.push(parsed.row)
  }
  return rows
}
