import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { COMMAND_AUDIENCE, verifyGithubOidc } from '../_shared/wcmGovernance.ts'

const OUTCOMES = ['RECORDED', 'STALE', 'FAILED'] as const

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const auth = await verifyGithubOidc(req.headers.get('Authorization'), COMMAND_AUDIENCE)
  if (!auth.ok) return json({ error: auth.error }, auth.status)

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
    .from('wcm_command_requests')
    .select('*')
    .eq('command_id', commandId)
    .maybeSingle()
  if (readError) return json({ error: 'Read failed', detail: readError.message }, 500)
  if (!current) return json({ error: 'Command not found' }, 404)

  // Idempotent retry: already in the requested terminal state.
  if (current.status === outcome) return json({ command: current, changed: false })

  if (!['SUBMITTED', 'CLAIMED'].includes(current.status)) {
    return json(
      { error: 'Command is already resolved', code: 'ALREADY_RESOLVED', status: current.status },
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
    .from('wcm_command_requests')
    .update(updates)
    .eq('command_id', commandId)
    .in('status', ['SUBMITTED', 'CLAIMED'])
    .select('*')
    .maybeSingle()
  if (updateError) return json({ error: 'Update failed', detail: updateError.message }, 500)
  if (!updated) return json({ error: 'Command state changed concurrently' }, 409)

  return json({ command: updated, changed: true })
})
