/**
 * Best-effort wake-up of the GitHub "WCM Command Executor" worker.
 *
 * Contract (unchanged authority semantics): this NEVER mutates the durable
 * command, never rolls back a SUBMITTED insert and never returns a token or
 * any secret-derived value to the caller. It only reports whether GitHub
 * accepted the dispatch, plus a non-sensitive diagnostic reason.
 */

export const WCM_REPO = 'scoppolabi-ux/WCM-LAB'
export const WCM_WORKFLOW_FILE = 'wcm-command-executor.yml'
export const WCM_REF = 'main'
export const WCM_REPOSITORY_DISPATCH_EVENT = 'wcm-command-submitted'

/** Env var names accepted for the worker token, in priority order. */
export const WAKE_TOKEN_ENV_KEYS = [
  'WCM_GITHUB_TOKEN',
  'WCM_GITHUB_PAT',
  'GITHUB_DISPATCH_TOKEN',
] as const

export type WakeMechanism = 'workflow_dispatch' | 'repository_dispatch'

export type WakeResult = {
  wake_requested: boolean
  /** Non-sensitive diagnostic code. */
  reason?: string
  mechanism?: WakeMechanism
  http_status?: number
  attempts: number
  /** Which env var supplied the token (name only, never the value). */
  token_source?: string
}

export type FetchLike = (input: string, init: RequestInit) => Promise<Response>

/** Reads the first configured token env var. Returns the name, never the value. */
export const resolveWakeToken = (
  env: (key: string) => string | undefined,
): { token: string; source: string } | null => {
  for (const key of WAKE_TOKEN_ENV_KEYS) {
    const value = (env(key) ?? '').trim()
    if (value) return { token: value, source: key }
  }
  return null
}

const ghHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
  'User-Agent': 'wcm-mission-control',
})

/** Statuses where retrying the same mechanism can plausibly succeed. */
const isRetryable = (status: number) => status === 429 || status >= 500

export type WakeOptions = {
  env?: (key: string) => string | undefined
  fetchImpl?: FetchLike
  /** Total attempts per mechanism (default 2). */
  maxAttempts?: number
  sleep?: (ms: number) => Promise<void>
  log?: (message: string) => void
}

/**
 * Attempts `workflow_dispatch`; if the workflow file is not reachable
 * (404 / 403 / 422) falls back to `repository_dispatch`, which the executor
 * workflow can also listen to. Any failure is swallowed into a WakeResult.
 */
export const requestWorkerWake = async (options: WakeOptions = {}): Promise<WakeResult> => {
  const env = options.env ?? ((k: string) => Deno.env.get(k) ?? undefined)
  const fetchImpl = options.fetchImpl ?? (globalThis.fetch as unknown as FetchLike)
  const maxAttempts = Math.max(1, options.maxAttempts ?? 2)
  const sleep = options.sleep ?? ((ms: number) => new Promise((r) => setTimeout(r, ms)))
  const log = options.log ?? ((m: string) => console.log(m))

  const resolved = resolveWakeToken(env)
  if (!resolved) {
    log('wcm-wake: no dispatch token configured')
    return { wake_requested: false, reason: 'GITHUB_TOKEN_UNAVAILABLE', attempts: 0 }
  }

  const targets: { mechanism: WakeMechanism; url: string; body: unknown }[] = [
    {
      mechanism: 'workflow_dispatch',
      url:
        `https://api.github.com/repos/${WCM_REPO}/actions/workflows/${WCM_WORKFLOW_FILE}/dispatches`,
      body: { ref: WCM_REF },
    },
    {
      mechanism: 'repository_dispatch',
      url: `https://api.github.com/repos/${WCM_REPO}/dispatches`,
      body: { event_type: WCM_REPOSITORY_DISPATCH_EVENT },
    },
  ]

  let attempts = 0
  let lastStatus: number | undefined
  let lastReason = 'DISPATCH_REQUEST_FAILED'

  for (const target of targets) {
    for (let i = 0; i < maxAttempts; i++) {
      attempts++
      try {
        const res = await fetchImpl(target.url, {
          method: 'POST',
          headers: ghHeaders(resolved.token),
          body: JSON.stringify(target.body),
        })
        if (res.ok || res.status === 204) {
          log(`wcm-wake: accepted via ${target.mechanism} (${res.status})`)
          return {
            wake_requested: true,
            mechanism: target.mechanism,
            http_status: res.status,
            attempts,
            token_source: resolved.source,
          }
        }
        lastStatus = res.status
        lastReason = res.status === 401
          ? 'DISPATCH_UNAUTHORIZED'
          : res.status === 403
          ? 'DISPATCH_FORBIDDEN'
          : `DISPATCH_HTTP_${res.status}`
        log(`wcm-wake: ${target.mechanism} rejected with ${res.status}`)
        if (!isRetryable(res.status)) break
        await sleep(250 * (i + 1))
      } catch (_e) {
        lastReason = 'DISPATCH_REQUEST_FAILED'
        lastStatus = undefined
        log(`wcm-wake: ${target.mechanism} request failed`)
        if (i + 1 < maxAttempts) await sleep(250 * (i + 1))
      }
    }
  }

  return {
    wake_requested: false,
    reason: lastReason,
    http_status: lastStatus,
    attempts,
    token_source: resolved.source,
  }
}
