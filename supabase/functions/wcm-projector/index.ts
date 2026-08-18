import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5'

const ISSUER = 'https://token.actions.githubusercontent.com'
const AUDIENCE = 'wcm-projector'
const ALLOWED_REPO = 'scoppolabi-ux/WCM-LAB'
const ALLOWED_REF = 'refs/heads/main'
const PROJECT_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const STATUS_FIELDS = [
  'project_name',
  'short_description',
  'status',
  'phase',
  'summary',
  'current_focus',
  'next_action',
  'needs_stefano',
  'board_gate_reason',
  'board_gate_action_requested',
  'board_verdict',
  'board_narrative_mass',
  'board_review_summary',
  'progress_summary',
  'documents_to_read_count',
  'repo_url',
  'blocker',
  'heartbeat_cadence',
  'heartbeat_last_run_at',
  'heartbeat_last_outcome',
  'last_material_activity_at',
  'last_material_activity',
  'notes',
  'source',
] as const

// Board payload is folded into the status row (no extra table).
const BOARD_FIELDS: Record<string, string> = {
  needs_stefano: 'needs_stefano',
  reason: 'board_gate_reason',
  action_requested: 'board_gate_action_requested',
  verdict: 'board_verdict',
  narrative_mass: 'board_narrative_mass',
  review_summary: 'board_review_summary',
}

const DOCUMENT_FIELDS = [
  'document_id',
  'title',
  'category',
  'status',
  'version',
  'source_path',
  'source_url',
  'source_sha',
  'content_markdown',
  'requires_stefano',
  'distribution_ready',
  'sort_order',
] as const

const ACTIVITY_FIELDS = [
  'event_id',
  'occurred_at',
  'event_type',
  'title',
  'description',
  'source_path',
  'source_sha',
  'sort_order',
] as const

const ROADMAP_FIELDS = [
  'item_id',
  'label',
  'item_type',
  'status',
  'sequence',
  'parent_id',
  'related_document_id',
  'source_path',
  'notes',
] as const

const COLLECTIONS = {
  documents: {
    table: 'wcm_project_documents',
    key: 'document_id',
    fields: DOCUMENT_FIELDS as readonly string[],
    required: ['document_id', 'title'],
  },
  activity: {
    table: 'wcm_project_activity',
    key: 'event_id',
    fields: ACTIVITY_FIELDS as readonly string[],
    required: ['event_id', 'title'],
  },
  roadmap: {
    table: 'wcm_project_roadmap',
    key: 'item_id',
    fields: ROADMAP_FIELDS as readonly string[],
    required: ['item_id', 'label'],
  },
} as const

type CollectionName = keyof typeof COLLECTIONS

const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks`))

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

function normalize(value: unknown): unknown {
  if (value === undefined || value === null) return null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
  }
  return value
}

// Timestamps may be expressed differently but mean the same instant.
function sameValue(field: string, incoming: unknown, current: unknown): boolean {
  const a = normalize(incoming)
  const b = normalize(current)
  if (a === null || b === null) return a === b
  if (field.endsWith('_at')) {
    const ta = Date.parse(String(a))
    const tb = Date.parse(String(b))
    if (!Number.isNaN(ta) && !Number.isNaN(tb)) return ta === tb
  }
  if (typeof a === 'boolean' || typeof b === 'boolean') return Boolean(a) === Boolean(b)
  return String(a) === String(b)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // --- AuthN: GitHub Actions OIDC ---
  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!token) return json({ error: 'Missing bearer token' }, 401)

  let claims: Record<string, unknown>
  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer: ISSUER, audience: AUDIENCE })
    claims = payload as Record<string, unknown>
  } catch (_e) {
    return json({ error: 'Invalid OIDC token' }, 401)
  }

  if (claims.repository !== ALLOWED_REPO) return json({ error: 'Repository not allowed' }, 403)
  if (claims.ref !== ALLOWED_REF) return json({ error: 'Ref not allowed' }, 403)

  // --- Body ---
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch (_e) {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const projectId = typeof body?.project_id === 'string' ? body.project_id.trim() : ''
  if (!PROJECT_ID_RE.test(projectId)) {
    return json({ error: 'project_id must be a slug matching ^[a-z0-9]+(?:-[a-z0-9]+)*$' }, 400)
  }


  const sourceStateSha = typeof body?.source_state_sha === 'string' ? body.source_state_sha : null
  const semanticFingerprint =
    typeof body?.semantic_fingerprint === 'string' ? body.semantic_fingerprint : null

  // --- Status projection (+ board block folded in) ---
  const incoming: Record<string, unknown> = {}

  if (body.projection !== undefined) {
    const projection = body.projection
    if (!projection || typeof projection !== 'object' || Array.isArray(projection)) {
      return json({ error: 'projection must be an object' }, 400)
    }
    const p = projection as Record<string, unknown>
    const unknownKeys = Object.keys(p).filter(
      (k) => !(STATUS_FIELDS as readonly string[]).includes(k),
    )
    if (unknownKeys.length > 0) {
      return json({ error: 'Unsupported projection fields', fields: unknownKeys }, 400)
    }
    Object.assign(incoming, p)
  }

  if (body.board !== undefined) {
    const board = body.board
    if (!board || typeof board !== 'object' || Array.isArray(board)) {
      return json({ error: 'board must be an object' }, 400)
    }
    const b = board as Record<string, unknown>
    const unknownBoard = Object.keys(b).filter((k) => !(k in BOARD_FIELDS))
    if (unknownBoard.length > 0) {
      return json({ error: 'Unsupported board fields', fields: unknownBoard }, 400)
    }
    for (const [k, v] of Object.entries(b)) incoming[BOARD_FIELDS[k]] = v
  }

  // --- Collections validation ---
  const collectionPayloads: Partial<
    Record<CollectionName, { rows: Record<string, unknown>[]; snapshot: boolean }>
  > = {}

  for (const name of Object.keys(COLLECTIONS) as CollectionName[]) {
    if (body[name] === undefined) continue
    const raw = body[name]
    if (!Array.isArray(raw)) return json({ error: `${name} must be an array` }, 400)

    const cfg = COLLECTIONS[name]
    const rows: Record<string, unknown>[] = []
    for (const [index, item] of raw.entries()) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return json({ error: `${name}[${index}] must be an object` }, 400)
      }
      const obj = item as Record<string, unknown>
      const unknown = Object.keys(obj).filter((k) => !cfg.fields.includes(k))
      if (unknown.length > 0) {
        return json({ error: `Unsupported ${name} fields`, index, fields: unknown }, 400)
      }
      for (const req of cfg.required) {
        if (normalize(obj[req]) === null) {
          return json({ error: `${name}[${index}].${req} is required` }, 400)
        }
      }
      const sourcePath = normalize(obj.source_path)
      if (typeof sourcePath === 'string') {
        const prefix = `projects/${projectId}/`
        if (
          !sourcePath.startsWith(prefix) ||
          sourcePath.includes('..') ||
          (name === 'documents' && !sourcePath.endsWith('.md'))
        ) {
          return json({ error: `${name}[${index}].source_path is not allowed`, path: sourcePath }, 400)
        }
      }
      const row: Record<string, unknown> = { project_id: projectId }
      for (const field of cfg.fields) {
        if (field in obj) row[field] = normalize(obj[field])
      }
      rows.push(row)

    }

    // A collection is a full snapshot unless explicitly declared partial.
    const partialFlag = (body[`${name}_partial`] ?? body.partial) === true
    collectionPayloads[name] = { rows, snapshot: !partialFlag }
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  const { data: current, error: readError } = await supabase
    .from('wcm_project_status')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle()

  if (readError) return json({ error: 'Read failed', detail: readError.message }, 500)

  let statusRow: Record<string, unknown>
  const updates: Record<string, unknown> = {}
  let created = false

  if (!current) {
    // Read-model creation: the project appears in the projection but not yet in
    // the read-model. This is not canonical project admission.
    for (const required of ['project_name', 'status', 'short_description']) {
      if (normalize(incoming[required]) === null) {
        return json(
          { error: `New project requires a non-empty projection.${required}` },
          400,
        )
      }
    }
    const insertRow: Record<string, unknown> = { project_id: projectId }
    for (const field of STATUS_FIELDS) {
      if (field in incoming) insertRow[field] = normalize(incoming[field])
    }
    if (insertRow.needs_stefano === undefined || insertRow.needs_stefano === null) {
      insertRow.needs_stefano = false
    }
    if (
      insertRow.documents_to_read_count === undefined ||
      insertRow.documents_to_read_count === null
    ) {
      insertRow.documents_to_read_count = 0
    }
    const { data: inserted, error: insertError } = await supabase
      .from('wcm_project_status')
      .insert(insertRow)
      .select('*')
      .single()
    if (insertError) return json({ error: 'Insert failed', detail: insertError.message }, 500)
    statusRow = inserted as Record<string, unknown>
    created = true
  } else {
    // --- Status diff ---
    for (const field of STATUS_FIELDS) {
      if (!(field in incoming)) continue
      if (!sameValue(field, incoming[field], (current as Record<string, unknown>)[field])) {
        updates[field] = normalize(incoming[field])
      }
    }

    statusRow = current as Record<string, unknown>
    if (Object.keys(updates).length > 0) {
      const { data: updated, error: updateError } = await supabase
        .from('wcm_project_status')
        .update(updates)
        .eq('project_id', projectId)
        .select('*')
        .single()
      if (updateError) return json({ error: 'Update failed', detail: updateError.message }, 500)
      statusRow = updated as Record<string, unknown>
    }
  }


  // --- Collections upsert (idempotent, scoped to this project) ---
  const collectionResults: Record<
    string,
    { upserted: number; changed: number; deleted: number }
  > = {}

  for (const name of Object.keys(collectionPayloads) as CollectionName[]) {
    const cfg = COLLECTIONS[name]
    const { rows, snapshot } = collectionPayloads[name]!

    const { data: existing, error: exErr } = await supabase
      .from(cfg.table)
      .select('*')
      .eq('project_id', projectId)
    if (exErr) return json({ error: `Read ${name} failed`, detail: exErr.message }, 500)

    const byKey = new Map<string, Record<string, unknown>>()
    for (const row of (existing ?? []) as Record<string, unknown>[]) {
      byKey.set(String(row[cfg.key]), row)
    }

    const toUpsert = rows.filter((row) => {
      const prev = byKey.get(String(row[cfg.key]))
      if (!prev) return true
      return cfg.fields.some((field) => field in row && !sameValue(field, row[field], prev[field]))
    })

    if (toUpsert.length > 0) {
      const { error: upErr } = await supabase
        .from(cfg.table)
        .upsert(toUpsert, { onConflict: `project_id,${cfg.key}` })
      if (upErr) return json({ error: `Upsert ${name} failed`, detail: upErr.message }, 500)
    }

    let deleted = 0
    if (snapshot) {
      const keep = new Set(rows.map((row) => String(row[cfg.key])))
      const stale = [...byKey.keys()].filter((k) => !keep.has(k))
      if (stale.length > 0) {
        const { error: delErr } = await supabase
          .from(cfg.table)
          .delete()
          .eq('project_id', projectId)
          .in(cfg.key, stale)
        if (delErr) return json({ error: `Delete ${name} failed`, detail: delErr.message }, 500)
        deleted = stale.length
      }
    }

    collectionResults[name] = {
      upserted: toUpsert.length,
      changed: toUpsert.length,
      deleted,
    }
  }

  const collectionsChanged = Object.values(collectionResults).some(
    (r) => r.changed > 0 || r.deleted > 0,
  )
  const changed = created || Object.keys(updates).length > 0 || collectionsChanged

  return json({
    changed,
    created,
    project_id: projectId,
    updated_fields: Object.keys(updates),

    collections: collectionResults,
    source_state_sha: sourceStateSha,
    semantic_fingerprint: semanticFingerprint,
    row: statusRow,
  })
})
