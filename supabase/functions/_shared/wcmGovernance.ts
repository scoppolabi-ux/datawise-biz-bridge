import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5'

export const GITHUB_ISSUER = 'https://token.actions.githubusercontent.com'
export const ALLOWED_REPO = 'scoppolabi-ux/WCM-LAB'
export const ALLOWED_REF = 'refs/heads/main'
export const COMMAND_AUDIENCE = 'wcm-command'

const JWKS = createRemoteJWKSet(new URL(`${GITHUB_ISSUER}/.well-known/jwks`))

/** Verifies a GitHub Actions OIDC token with the exact repo/ref boundary. */
export async function verifyGithubOidc(
  authHeader: string | null,
  audience: string,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const header = authHeader ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token) return { ok: false, status: 401, error: 'Missing bearer token' }

  let claims: Record<string, unknown>
  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer: GITHUB_ISSUER, audience })
    claims = payload as Record<string, unknown>
  } catch (_e) {
    return { ok: false, status: 401, error: 'Invalid OIDC token' }
  }
  if (claims.repository !== ALLOWED_REPO) {
    return { ok: false, status: 403, error: 'Repository not allowed' }
  }
  if (claims.ref !== ALLOWED_REF) return { ok: false, status: 403, error: 'Ref not allowed' }
  return { ok: true }
}

export const NEED_FINGERPRINT_FIELDS = [
  'project_id',
  'need_id',
  'title',
  'need_type',
  'status',
  'reason',
  'action_requested',
  'related_document_ids',
  'target_tab',
  'target_document_id',
  'source_path',
  'source_sha',
] as const

/**
 * Deterministic SHA-256 over the governance-relevant need fields.
 * Stable key ordering; null-normalised so cosmetic churn does not
 * invalidate an in-flight human command.
 */
export async function needFingerprint(need: Record<string, unknown>): Promise<string> {
  const canonical: Record<string, unknown> = {}
  for (const field of NEED_FINGERPRINT_FIELDS) {
    const value = need[field]
    if (Array.isArray(value)) {
      canonical[field] = [...value].map((v) => String(v)).sort()
    } else if (value === undefined || value === null || value === '') {
      canonical[field] = null
    } else {
      canonical[field] = typeof value === 'string' ? value : String(value)
    }
  }
  const bytes = new TextEncoder().encode(JSON.stringify(canonical))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const CLOSED_NEED_STATUSES = ['closed', 'resolved', 'done', 'cancelled', 'canceled']

export const isOpenNeed = (need: { status?: string | null }) =>
  !need.status || !CLOSED_NEED_STATUSES.includes(String(need.status).toLowerCase())
