import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5'

/**
 * GLOBAL WCM Method Change Gate — command claim endpoint for the WCM-LAB
 * GitHub Actions consumer. OIDC-only (audience `wcm-method-command`, repo
 * scoppolabi-ux/WCM-LAB, ref refs/heads/main). Claims the oldest SUBMITTED
 * method command atomically; never mutates gates or the read-model.
 *
 * Separate domain from the project command surface (wcm-command-pull):
 * this function ONLY touches wcm_method_command_requests.
 */

const ISSUER = 'https://token.actions.githubusercontent.com'
const AUDIENCE = 'wcm-method-command'
const ALLOWED_REPO = 'scoppolabi-ux/WCM-LAB'
const ALLOWED_REF = 'refs/heads/main'
const CLAIM_TIMEOUT_MS = 15 * 60 * 1000

const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks`))

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

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

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  const staleClaimBefore = new Date(Date.now() - CLAIM_TIMEOUT_MS).toISOString()

  // Oldest SUBMITTED, or a CLAIMED command abandoned by a previous run.
  const { data: candidates, error: listError } = await admin
    .from('wcm_method_command_requests')
    .select('*')
    .in('status', ['SUBMITTED', 'CLAIMED'])
    .order('created_at', { ascending: true })
    .limit(20)
  if (listError) return json({ error: 'Read failed', detail: listError.message }, 500)

  const executable = (candidates ?? []).find(
    (c) =>
      c.status === 'SUBMITTED' ||
      (c.status === 'CLAIMED' && (!c.claimed_at || c.claimed_at < staleClaimBefore)),
  )
  if (!executable) return json({ command: null })

  // --- Atomic claim: guarded update, only one runner wins ---
  const claimQuery = admin
    .from('wcm_method_command_requests')
    .update({ status: 'CLAIMED', claimed_at: new Date().toISOString() })
    .eq('id', executable.id)
    .eq('status', executable.status)

  const { data: claimed, error: claimError } =
    executable.status === 'CLAIMED'
      ? await claimQuery.lt('claimed_at', staleClaimBefore).select('*').maybeSingle()
      : await claimQuery.select('*').maybeSingle()

  if (claimError) return json({ error: 'Claim failed', detail: claimError.message }, 500)
  if (!claimed) return json({ command: null })

  // --- Concurrency re-validation against the current gate read-model ---
  const markStale = async (reason: string) => {
    await admin
      .from('wcm_method_command_requests')
      .update({ status: 'STALE', failure_reason: reason })
      .eq('id', claimed.id)
    return json({ command: null, stale_command_id: claimed.command_id, reason })
  }

  const { data: gate } = await admin
    .from('wcm_method_change_gates')
    .select('status, revision')
    .eq('gate_id', claimed.gate_id)
    .maybeSingle()

  if (!gate) return await markStale('GATE_NOT_FOUND')
  if (String(gate.status ?? '').toUpperCase() !== 'OPEN') return await markStale('GATE_NOT_OPEN')
  if (gate.revision !== claimed.expected_gate_revision) {
    return await markStale('GATE_REVISION_CHANGED')
  }

  return json({
    command: {
      command_id: claimed.command_id,
      gate_id: claimed.gate_id,
      command_type: claimed.command_type,
      expected_gate_revision: claimed.expected_gate_revision,
      requested_by_user_id: claimed.requested_by_user_id,
      requested_by_email: claimed.requested_by_email,
      requested_by_role: claimed.requested_by_role,
      note: claimed.note,
      created_at: claimed.created_at,
      claimed_at: claimed.claimed_at,
    },
  })
})
