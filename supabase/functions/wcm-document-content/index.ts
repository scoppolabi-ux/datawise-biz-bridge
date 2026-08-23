import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  githubContentsUrl,
  validateSourcePath,
  WCM_REPO_NAME,
  WCM_REPO_OWNER,
  WCM_REPO_REF,
} from '../_shared/wcmSourcePath.ts'

const ALLOWED_ROLES = ['owner', 'admin']

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

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

  // --- AuthZ: owner/admin only (same surface as the rest of WCM) ---
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

  const projectId = typeof body.project_id === 'string' ? body.project_id.trim() : ''
  const requestedPath = body.source_path

  const validation = validateSourcePath(projectId, requestedPath)
  if (!validation.ok) return json({ error: validation.error, code: validation.code }, 400)

  // --- Fail-closed: il path deve corrispondere a un documento del read model ---
  const { data: doc, error: docError } = await admin
    .from('wcm_project_documents')
    .select('document_id, source_path')
    .eq('project_id', projectId)
    .eq('source_path', validation.path)
    .maybeSingle()
  if (docError) return json({ error: 'Document lookup failed' }, 500)
  if (!doc) {
    return json(
      { error: 'source_path non presente nel read model del progetto', code: 'UNKNOWN_DOCUMENT' },
      404,
    )
  }

  const ghToken = Deno.env.get('WCM_GITHUB_TOKEN') ?? ''
  if (!ghToken) {
    return json(
      {
        error:
          'Token GitHub non configurato: aggiungi il segreto WCM_GITHUB_TOKEN per leggere il repository sorgente.',
        code: 'GITHUB_TOKEN_MISSING',
      },
      503,
    )
  }

  const url = githubContentsUrl(validation.path)
  let ghResponse: Response
  try {
    ghResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: 'application/vnd.github.raw',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'wcm-mission-control',
      },
    })
  } catch (_e) {
    return json({ error: 'Impossibile contattare GitHub', code: 'GITHUB_UNREACHABLE' }, 502)
  }

  if (!ghResponse.ok) {
    const detail = (await ghResponse.text()).slice(0, 300)
    return json(
      {
        error: `Lettura del sorgente GitHub fallita (HTTP ${ghResponse.status})`,
        code: 'GITHUB_FETCH_FAILED',
        github_status: ghResponse.status,
        detail,
      },
      502,
    )
  }

  const content = await ghResponse.text()
  if (content.trim() === '') {
    return json({ error: 'Il file sorgente è vuoto', code: 'EMPTY_SOURCE' }, 502)
  }

  return json({
    project_id: projectId,
    document_id: doc.document_id,
    source_path: validation.path,
    repo: `${WCM_REPO_OWNER}/${WCM_REPO_NAME}`,
    ref: WCM_REPO_REF,
    content_markdown: content,
  })
})
