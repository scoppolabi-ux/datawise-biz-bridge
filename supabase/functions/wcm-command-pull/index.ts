import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  COMMAND_AUDIENCE,
  isOpenNeed,
  needFingerprint,
  verifyGithubOidc,
} from '../_shared/wcmGovernance.ts'

const CLAIM_TIMEOUT_MS = 15 * 60 * 1000

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const auth = await verifyGithubOidc(req.headers.get('Authorization'), COMMAND_AUDIENCE)
  if (!auth.ok) return json({ error: auth.error }, auth.status)

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  const staleClaimBefore = new Date(Date.now() - CLAIM_TIMEOUT_MS).toISOString()

  // Oldest SUBMITTED, or a CLAIMED command abandoned by a previous run.
  const { data: candidates, error: listError } = await admin
    .from('wcm_command_requests')
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

  // --- Atomic claim: only one runner wins ---
  const claimQuery = admin
    .from('wcm_command_requests')
    .update({ status: 'CLAIMED', claimed_at: new Date().toISOString() })
    .eq('id', executable.id)
    .eq('status', executable.status)

  const { data: claimed, error: claimError } =
    executable.status === 'CLAIMED'
      ? await claimQuery.lt('claimed_at', staleClaimBefore).select('*').maybeSingle()
      : await claimQuery.select('*').maybeSingle()

  if (claimError) return json({ error: 'Claim failed', detail: claimError.message }, 500)
  if (!claimed) return json({ command: null })

  // --- Concurrency re-validation against the current read-model ---
  const markStale = async (reason: string) => {
    await admin
      .from('wcm_command_requests')
      .update({ status: 'STALE', failure_reason: reason })
      .eq('id', claimed.id)
    return json({ command: null, stale_command_id: claimed.command_id, reason })
  }

  const { data: project } = await admin
    .from('wcm_project_status')
    .select('source_state_sha')
    .eq('project_id', claimed.project_id)
    .maybeSingle()

  if (!project?.source_state_sha) return await markStale('PROJECTION_NOT_READY')
  if (project.source_state_sha !== claimed.expected_state_sha) {
    return await markStale('STATE_SHA_CHANGED')
  }

  const { data: need } = await admin
    .from('wcm_project_needs')
    .select('*')
    .eq('project_id', claimed.project_id)
    .eq('need_id', claimed.need_id)
    .maybeSingle()

  if (!need || !isOpenNeed(need)) return await markStale('NEED_NOT_OPEN')

  const fingerprint = await needFingerprint(need as Record<string, unknown>)
  if (fingerprint !== claimed.expected_need_fingerprint) {
    return await markStale('NEED_FINGERPRINT_CHANGED')
  }

  return json({
    command: {
      command_id: claimed.command_id,
      project_id: claimed.project_id,
      need_id: claimed.need_id,
      command_type: claimed.command_type,
      target_document_id: claimed.target_document_id,
      target_version: claimed.target_version,
      expected_state_sha: claimed.expected_state_sha,
      expected_need_fingerprint: claimed.expected_need_fingerprint,
      requested_by_user_id: claimed.requested_by_user_id,
      requested_by_email: claimed.requested_by_email,
      requested_by_role: claimed.requested_by_role,
      note: claimed.note,
      created_at: claimed.created_at,
      claimed_at: claimed.claimed_at,
    },
  })
})
