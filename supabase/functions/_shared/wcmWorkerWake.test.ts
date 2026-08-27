import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { requestWorkerWake, resolveWakeToken } from './wcmWorkerWake.ts'

const noSleep = async () => {}
const env = (map: Record<string, string>) => (k: string) => map[k]
const res = (status: number) => new Response(status === 204 ? null : '{}', { status })

Deno.test('resolveWakeToken prefers WCM_GITHUB_TOKEN and reports only the name', () => {
  const r = resolveWakeToken(env({ WCM_GITHUB_TOKEN: 'a', WCM_GITHUB_PAT: 'b' }))
  assertEquals(r?.source, 'WCM_GITHUB_TOKEN')
})

Deno.test('resolveWakeToken falls back to alternative env vars', () => {
  assertEquals(resolveWakeToken(env({ WCM_GITHUB_PAT: 'b' }))?.source, 'WCM_GITHUB_PAT')
  assertEquals(resolveWakeToken(env({ WCM_GITHUB_TOKEN: '   ' })), null)
  assertEquals(resolveWakeToken(env({})), null)
})

Deno.test('missing token yields GITHUB_TOKEN_UNAVAILABLE and no request', async () => {
  let calls = 0
  const out = await requestWorkerWake({
    env: env({}),
    fetchImpl: async () => {
      calls++
      return res(204)
    },
    sleep: noSleep,
  })
  assertEquals(out, { wake_requested: false, reason: 'GITHUB_TOKEN_UNAVAILABLE', attempts: 0 })
  assertEquals(calls, 0)
})

Deno.test('workflow_dispatch 204 is accepted', async () => {
  const urls: string[] = []
  const out = await requestWorkerWake({
    env: env({ WCM_GITHUB_TOKEN: 't' }),
    fetchImpl: async (url) => {
      urls.push(url)
      return res(204)
    },
    sleep: noSleep,
  })
  assertEquals(out.wake_requested, true)
  assertEquals(out.mechanism, 'workflow_dispatch')
  assertEquals(out.http_status, 204)
  assertEquals(out.attempts, 1)
  assertEquals(urls.length, 1)
  assertEquals(urls[0].includes('wcm-command-executor.yml/dispatches'), true)
})

Deno.test('404 on workflow_dispatch falls back to repository_dispatch', async () => {
  const urls: string[] = []
  const out = await requestWorkerWake({
    env: env({ WCM_GITHUB_TOKEN: 't' }),
    fetchImpl: async (url) => {
      urls.push(url)
      return res(url.includes('workflows') ? 404 : 204)
    },
    sleep: noSleep,
  })
  assertEquals(out.wake_requested, true)
  assertEquals(out.mechanism, 'repository_dispatch')
  assertEquals(urls.length, 2)
})

Deno.test('5xx is retried then reported without throwing', async () => {
  let calls = 0
  const out = await requestWorkerWake({
    env: env({ WCM_GITHUB_TOKEN: 't' }),
    fetchImpl: async () => {
      calls++
      return res(500)
    },
    sleep: noSleep,
    maxAttempts: 2,
  })
  assertEquals(out.wake_requested, false)
  assertEquals(out.reason, 'DISPATCH_HTTP_500')
  assertEquals(calls, 4) // 2 attempts x 2 mechanisms
})

Deno.test('401 is surfaced as DISPATCH_UNAUTHORIZED without retry', async () => {
  let calls = 0
  const out = await requestWorkerWake({
    env: env({ WCM_GITHUB_TOKEN: 't' }),
    fetchImpl: async () => {
      calls++
      return res(401)
    },
    sleep: noSleep,
  })
  assertEquals(out.wake_requested, false)
  assertEquals(out.reason, 'DISPATCH_UNAUTHORIZED')
  assertEquals(calls, 2) // one per mechanism, no retry
})

Deno.test('network throw never propagates', async () => {
  const out = await requestWorkerWake({
    env: env({ WCM_GITHUB_TOKEN: 't' }),
    fetchImpl: async () => {
      throw new Error('boom')
    },
    sleep: noSleep,
    maxAttempts: 1,
  })
  assertEquals(out.wake_requested, false)
  assertEquals(out.reason, 'DISPATCH_REQUEST_FAILED')
})
