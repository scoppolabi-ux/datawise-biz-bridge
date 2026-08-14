import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5'

const ISSUER = 'https://token.actions.githubusercontent.com'
const AUDIENCE = 'wcm-projector'
const ALLOWED_REPO = 'scoppolabi-ux/WCM-LAB'
const ALLOWED_REF = 'refs/heads/main'
const ALLOWED_PROJECT_ID = 'prima-di-noi'

const ALLOWED_FIELDS = [
  'project_name',
  'status',
  'phase',
  'summary',
  'current_focus',
  'next_action',
  'needs_stefano',
  'board_gate_reason',
  'board_gate_action_requested',
  'blocker',
  'heartbeat_cadence',
  'heartbeat_last_run_at',
  'heartbeat_last_outcome',
  'last_material_activity_at',
  'last_material_activity',
  'notes',
  'source',
] as const

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

  const projectId = body?.project_id
  if (projectId !== ALLOWED_PROJECT_ID) {
    return json({ error: `project_id must be '${ALLOWED_PROJECT_ID}'` }, 400)
  }

  const projection = body?.projection
  if (!projection || typeof projection !== 'object' || Array.isArray(projection)) {
    return json({ error: 'projection must be an object' }, 400)
  }

  const incoming = projection as Record<string, unknown>
  const unknownKeys = Object.keys(incoming).filter(
    (k) => !(ALLOWED_FIELDS as readonly string[]).includes(k),
  )
  if (unknownKeys.length > 0) {
    return json({ error: 'Unsupported projection fields', fields: unknownKeys }, 400)
  }

  const sourceStateSha = typeof body?.source_state_sha === 'string' ? body.source_state_sha : null
  const semanticFingerprint =
    typeof body?.semantic_fingerprint === 'string' ? body.semantic_fingerprint : null

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  const { data: current, error: readError } = await supabase
    .from('wcm_project_status')
    .select('*')
    .eq('project_id', ALLOWED_PROJECT_ID)
    .maybeSingle()

  if (readError) return json({ error: 'Read failed', detail: readError.message }, 500)
  if (!current) return json({ error: 'Project not found' }, 404)

  const updates: Record<string, unknown> = {}
  for (const field of ALLOWED_FIELDS) {
    if (!(field in incoming)) continue
    if (!sameValue(field, incoming[field], (current as Record<string, unknown>)[field])) {
      updates[field] = normalize(incoming[field])
    }
  }

  if (Object.keys(updates).length === 0) {
    return json({
      changed: false,
      project_id: ALLOWED_PROJECT_ID,
      source_state_sha: sourceStateSha,
      semantic_fingerprint: semanticFingerprint,
      row: current,
    })
  }

  const { data: updated, error: updateError } = await supabase
    .from('wcm_project_status')
    .update(updates)
    .eq('project_id', ALLOWED_PROJECT_ID)
    .select('*')
    .single()

  if (updateError) return json({ error: 'Update failed', detail: updateError.message }, 500)

  return json({
    changed: true,
    project_id: ALLOWED_PROJECT_ID,
    updated_fields: Object.keys(updates),
    source_state_sha: sourceStateSha,
    semantic_fingerprint: semanticFingerprint,
    row: updated,
  })
})
