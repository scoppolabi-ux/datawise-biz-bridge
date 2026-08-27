import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { isOpenNeed, needFingerprint } from '../_shared/wcmGovernance.ts'
import { isBoardCandidateCategory } from '../_shared/wcmBoardGate.ts'
import { requestWorkerWake } from '../_shared/wcmWorkerWake.ts'



const COMMAND_TYPES = ['APPROVE_FREEZE', 'REQUEST_CHANGES'] as const
const ALLOWED_ROLES = ['owner', 'admin']

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

  // --- AuthZ: owner/admin only ---
  const { data: roles, error: roleError } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
  if (roleError) return json({ error: 'Role lookup failed' }, 500)
  const role = (roles ?? []).map((r) => String(r.role)).find((r) => ALLOWED_ROLES.includes(r))
  if (!role) return json({ error: 'Forbidden', code: 'ROLE_REQUIRED' }, 403)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch (_e) {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const projectId = str(body.project_id)
  const needId = str(body.need_id)
  const commandType = str(body.command_type)
  const targetDocumentId = str(body.target_document_id) || null
  let targetVersion = str(body.target_version) || null
  const note = str(body.note) || null

  if (!projectId || !needId) return json({ error: 'project_id and need_id are required' }, 400)
  if (!(COMMAND_TYPES as readonly string[]).includes(commandType)) {
    return json({ error: 'Unsupported command_type' }, 400)
  }
  if (commandType === 'REQUEST_CHANGES' && !note) {
    return json({ error: 'REQUEST_CHANGES requires a non-empty note', code: 'NOTE_REQUIRED' }, 400)
  }
  if (note && note.length > 4000) return json({ error: 'note is too long' }, 400)

  // --- Current read-model state (service role) ---
  const { data: project, error: projectError } = await admin
    .from('wcm_project_status')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle()
  if (projectError) return json({ error: 'Project lookup failed' }, 500)
  if (!project) return json({ error: 'Project not found', code: 'PROJECT_NOT_FOUND' }, 404)

  if (!project.source_state_sha) {
    return json(
      {
        error: 'La proiezione corrente non espone uno state SHA: autorità non accettabile.',
        code: 'PROJECTION_NOT_READY',
      },
      409,
    )
  }

  const { data: need, error: needError } = await admin
    .from('wcm_project_needs')
    .select('*')
    .eq('project_id', projectId)
    .eq('need_id', needId)
    .maybeSingle()
  if (needError) return json({ error: 'Need lookup failed' }, 500)
  if (!need) return json({ error: 'Need not found', code: 'NEED_NOT_FOUND' }, 404)
  if (!isOpenNeed(need)) return json({ error: 'Need is not open', code: 'NEED_NOT_OPEN' }, 409)

  if (commandType === 'APPROVE_FREEZE') {
    const type = String(need.need_type ?? '').toUpperCase()
    if (type !== 'BOARD_GATE') {
      return json(
        { error: 'APPROVE_FREEZE richiede un Board Gate aperto', code: 'NOT_A_BOARD_GATE' },
        409,
      )
    }
    if (!targetDocumentId) {
      return json(
        {
          error:
            'APPROVE_FREEZE richiede un documento Candidate (category=BOARD_CANDIDATE) come target: nessun target indicato.',
          code: 'INVALID_APPROVE_TARGET',
        },
        400,
      )
    }
  }

  if (targetDocumentId) {
    const related: string[] = (need.related_document_ids ?? []) as string[]
    const isRelated = related.includes(targetDocumentId) || need.target_document_id === targetDocumentId
    if (!isRelated) {
      return json(
        { error: 'target_document_id is not related to this need', code: 'TARGET_NOT_RELATED' },
        400,
      )
    }
    const { data: doc, error: docError } = await admin
      .from('wcm_project_documents')
      .select('document_id, version, category, status')
      .eq('project_id', projectId)
      .eq('document_id', targetDocumentId)
      .maybeSingle()
    if (docError) return json({ error: 'Document lookup failed' }, 500)
    if (!doc) return json({ error: 'Target document not found', code: 'TARGET_NOT_FOUND' }, 404)

    if (commandType === 'APPROVE_FREEZE') {
      if (!isBoardCandidateCategory(doc.category)) {
        return json(
          {
            error:
              `Il target di APPROVE_FREEZE deve essere la Candidate congelabile (category=BOARD_CANDIDATE), non "${String(doc.category ?? 'sconosciuta')}". Il Board Report resta leggibile ma non è un target di autorità.`,
            code: 'INVALID_APPROVE_TARGET',
          },
          409,
        )
      }
      const docVersion = doc.version ?? null
      if (targetVersion && String(targetVersion) !== String(docVersion ?? '')) {
        return json(
          {
            error:
              `La versione indicata (${targetVersion}) non corrisponde alla versione corrente del documento (${docVersion ?? 'assente'}).`,
            code: 'INVALID_APPROVE_TARGET',
          },
          409,
        )
      }
    }

    if (!targetVersion) targetVersion = doc.version ?? null
  }


  const fingerprint = await needFingerprint(need as Record<string, unknown>)

  const insertRow = {
    command_id: crypto.randomUUID(),
    project_id: projectId,
    need_id: needId,
    command_type: commandType,
    target_document_id: targetDocumentId,
    target_version: targetVersion,
    expected_state_sha: project.source_state_sha,
    expected_need_fingerprint: fingerprint,
    requested_by_user_id: user.id,
    requested_by_email: user.email ?? '',
    requested_by_role: role,
    note,
    status: 'SUBMITTED',
  }

  const { data: inserted, error: insertError } = await admin
    .from('wcm_command_requests')
    .insert(insertRow)
    .select('*')
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      return json(
        {
          error: 'Esiste già un comando attivo per questo need.',
          code: 'ACTIVE_COMMAND_EXISTS',
        },
        409,
      )
    }
    return json({ error: 'Insert failed', detail: insertError.message }, 500)
  }

  // --- Best-effort worker wake-up (never affects the durable SUBMITTED command) ---
  // The browser never talks to GitHub. A failure here is non-fatal: the durable
  // queue stays the source of truth and the GitHub watchdog will recover it.
  let delivery
  try {
    delivery = await requestWorkerWake({
      log: (m) => console.log(`${m} command_id=${insertRow.command_id}`),
    })
  } catch (_e) {
    // Defensive: requestWorkerWake already swallows errors.
    delivery = { wake_requested: false, reason: 'DISPATCH_REQUEST_FAILED', attempts: 0 }
  }

  // Mission Control records authority only: no read-model or GitHub mutation here.
  return json({ command: inserted, delivery }, 201)
})

