import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

/**
 * GLOBAL WCM Method Change Gate — authority command submission.
 *
 * Domain boundary: this function NEVER touches wcm_command_requests, project
 * Board Gates, project workflows or the project command surface. It only
 * records an authenticated authority command on a GLOBAL method change gate.
 * A submission never promotes a learning, never mutates the gate read-model
 * and never writes GitHub: GitHub main stays the source of truth and will
 * consume the command canonically.
 */

const COMMAND_TYPES = ['APPROVE_CHANGE_GATE', 'REQUEST_CHANGES', 'REJECT_CHANGE_GATE'] as const
const NOTE_REQUIRED_TYPES = ['REQUEST_CHANGES', 'REJECT_CHANGE_GATE'] as const

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // --- AuthN: real Supabase user session ---
  const authHeader = req.headers.get('Authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
  const token = authHeader.slice(7).trim()

  const anonClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { auth: { persistSession: false } },
  )
  const { data: userData, error: userError } = await anonClient.auth.getUser(token)
  const user = userData?.user
  if (userError || !user) return json({ error: 'Unauthorized' }, 401)

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  // --- AuthZ: resolve roles (owner/admin surface) ---
  const { data: roles, error: roleError } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
  if (roleError) return json({ error: 'Role lookup failed' }, 500)
  const userRoles = (roles ?? []).map((r) => String(r.role))

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch (_e) {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const gateId = str(body.gate_id)
  const commandType = str(body.command_type)
  const note = str(body.note) || null

  if (!gateId) return json({ error: 'gate_id is required' }, 400)
  if (!(COMMAND_TYPES as readonly string[]).includes(commandType)) {
    return json({ error: 'Unsupported command_type' }, 400)
  }
  if ((NOTE_REQUIRED_TYPES as readonly string[]).includes(commandType) && !note) {
    return json(
      { error: `${commandType} requires a non-empty note`, code: 'NOTE_REQUIRED' },
      400,
    )
  }
  if (note && note.length > 4000) return json({ error: 'note is too long' }, 400)

  // --- Current gate read-model state (service role) ---
  const { data: gate, error: gateError } = await admin
    .from('wcm_method_change_gates')
    .select('*')
    .eq('gate_id', gateId)
    .maybeSingle()
  if (gateError) return json({ error: 'Gate lookup failed' }, 500)
  if (!gate) return json({ error: 'Gate not found', code: 'GATE_NOT_FOUND' }, 404)

  if (String(gate.status ?? '').toUpperCase() !== 'OPEN') {
    return json({ error: 'Gate is not open', code: 'GATE_NOT_OPEN' }, 409)
  }

  const revision = gate.revision
  if (typeof revision !== 'number' || !Number.isInteger(revision) || revision < 1) {
    return json(
      { error: 'Gate revision is not a positive integer', code: 'REVISION_INVALID' },
      409,
    )
  }

  // --- Authority contract: exact, fail closed ---
  // Current canonical contract: authority_required = STEFANO_OWNER -> owner only.
  // Any other explicit authority_required value is NOT silently allowed: it
  // fails closed until a dedicated contract is implemented.
  const authorityRequired = str(gate.authority_required).toUpperCase()
  if (authorityRequired !== 'STEFANO_OWNER') {
    return json(
      {
        error: 'Autorità richiesta non supportata da questo contratto.',
        code: 'AUTHORITY_CONTRACT_UNSUPPORTED',
        authority_required: gate.authority_required,
      },
      409,
    )
  }
  if (!userRoles.includes('owner')) {
    return json(
      { error: 'Forbidden', code: 'ROLE_REQUIRED', required_role: 'owner' },
      403,
    )
  }

  const insertRow = {
    command_id: crypto.randomUUID(),
    gate_id: gateId,
    command_type: commandType,
    expected_gate_revision: revision,
    requested_by_user_id: user.id,
    requested_by_email: user.email ?? '',
    requested_by_role: 'owner',
    note,
    status: 'SUBMITTED',
  }

  const { data: inserted, error: insertError } = await admin
    .from('wcm_method_command_requests')
    .insert(insertRow)
    .select('*')
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      return json(
        {
          error: 'Esiste già un comando attivo per questo gate.',
          code: 'ACTIVE_COMMAND_EXISTS',
        },
        409,
      )
    }
    return json({ error: 'Insert failed', detail: insertError.message }, 500)
  }

  // Mission Control records authority only: no gate/read-model/GitHub mutation.
  return json({ command: inserted }, 201)
})
