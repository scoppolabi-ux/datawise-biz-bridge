import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5'

/**
 * GLOBAL WCM Method Change Gate — command outcome recording for the WCM-LAB
 * GitHub Actions consumer. OIDC-only (audience `wcm-method-command`, repo
 * scoppolabi-ux/WCM-LAB, ref refs/heads/main). Transitions a CLAIMED command
 * to an exact terminal outcome; never mutates gates or the read-model.
 *
 * Separate domain from the project command surface (wcm-command-complete):
 * this function ONLY touches wcm_method_command_requests.
 */

const ISSUER = 'https://token.actions.githubusercontent.com'
const AUDIENCE = 'wcm-method-command'
const ALLOWED_REPO = 'scoppolabi-ux/WCM-LAB'
const ALLOWED_REF = 'refs/heads/main'
const OUTCOMES = ['RECORDED', 'STALE', 'FAILED'] as const

const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks`))

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // --- AuthN: GitHub Actions OIDC, exact audience/repo/ref ---
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

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch (_e) {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const commandId = str(body.command_id)
  const outcome = str(body.outcome).toUpperCase()
  if (!commandId) return json({ error: 'command_id is required' }, 400)
  if (!(OUTCOMES as readonly string[]).includes(outcome)) {
    return json({ error: 'outcome must be RECORDED, STALE or FAILED' }, 400)
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  const { data: current, error: readError } = await admin
    .from('wcm_method_command_requests')
    .select('*')
    .eq('command_id', commandId)
    .maybeSingle()
  if (readError) return json({ error: 'Read failed', detail: readError.message }, 500)
  if (!current) return json({ error: 'Command not found' }, 404)

  // Idempotent retry: already in the requested terminal state.
  if (current.status === outcome) return json({ command: current, changed: false })

  // Fail closed: only a CLAIMED command may be resolved by the consumer.
  if (current.status !== 'CLAIMED') {
    return json(
      { error: 'Command is not in CLAIMED state', code: 'NOT_CLAIMED', status: current.status },
      409,
    )
  }

  const updates: Record<string, unknown> = { status: outcome }
  if (outcome === 'RECORDED') {
    updates.recorded_at = new Date().toISOString()
    updates.receipt_path = str(body.receipt_path) || null
    updates.receipt_sha = str(body.receipt_sha) || null
    updates.failure_reason = null
  } else {
    updates.failure_reason = str(body.failure_reason) || outcome
  }

  const { data: updated, error: updateError } = await admin
    .from('wcm_method_command_requests')
    .update(updates)
    .eq('command_id', commandId)
    .eq('status', 'CLAIMED')
    .select('*')
    .maybeSingle()
  if (updateError) return json({ error: 'Update failed', detail: updateError.message }, 500)
  if (!updated) return json({ error: 'Command state changed concurrently' }, 409)

  return json({ command: updated, changed: true })
})
