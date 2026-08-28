import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5'
import { parseTechnicalIssues } from './normalize.ts'

/**
 * WCM Technical Issue Tracking V1 — project-scoped technical issue ledger.
 * GitHub main (scoppolabi-ux/WCM-LAB) is the source of truth; this function is
 * the ONLY writer. Ledger semantics: upsert only, never delete on omission.
 */

const ISSUER = 'https://token.actions.githubusercontent.com'
const AUDIENCE = 'wcm-technical-issue-projector'
const ALLOWED_REPO = 'scoppolabi-ux/WCM-LAB'
const ALLOWED_REF = 'refs/heads/main'

const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks`))

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

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

  let body: unknown
  try {
    body = await req.json()
  } catch (_e) {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const parsed = parseTechnicalIssues(body)
  if ('error' in parsed) return json(parsed, 400)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  if (parsed.rows.length > 0) {
    const { error } = await supabase
      .from('wcm_project_technical_issues')
      .upsert(parsed.rows, { onConflict: 'project_id,issue_id' })
    if (error) {
      return json({ error: 'Upsert technical issues failed', detail: error.message }, 500)
    }
  }

  return json({
    changed: parsed.rows.length > 0,
    project_id: parsed.projectId,
    upserted: parsed.rows.length,
  })
})
