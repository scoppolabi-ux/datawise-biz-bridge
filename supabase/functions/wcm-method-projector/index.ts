import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5'
import {
  computeStaleKeys,
  parseLearningInbox,
  parseLearningLedger,
  parseMethodChangeGates,
  parseMethodHealth,
  parseMethodRelationships,
} from './normalize.ts'

/**
 * WCM Learning V0.8 — GLOBAL method learning projector (observation only).
 * GitHub main (scoppolabi-ux/WCM-LAB) remains the source of truth. This
 * function is the ONLY writer of the global learning read-model.
 */

const ISSUER = 'https://token.actions.githubusercontent.com'
const AUDIENCE = 'wcm-method-projector'
const ALLOWED_REPO = 'scoppolabi-ux/WCM-LAB'
const ALLOWED_REF = 'refs/heads/main'

const TOP_LEVEL_KEYS = [
  'method_health',
  'learning_ledger',
  'learning_inbox',
  'method_relationships',
  'method_change_gates',
  // optional source metadata
  'source_sha',
  'source_ref',
  'source_repo',
  'source_run_id',
  'source_run_url',
  'generated_at',
]

const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks`))

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // --- AuthN: GitHub Actions OIDC ---
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

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch (_e) {
    return json({ error: 'Invalid JSON body' }, 400)
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ error: 'Body must be an object' }, 400)
  }

  const unknownTop = Object.keys(body).filter((k) => !TOP_LEVEL_KEYS.includes(k))
  if (unknownTop.length > 0) {
    return json({ error: 'Unsupported top-level fields', fields: unknownTop }, 400)
  }

  const sourceSha = typeof body.source_sha === 'string' ? body.source_sha : null

  let healthRow: Record<string, unknown> | null = null
  let healthMetadata: Record<string, unknown> = {}
  if (body.method_health !== undefined && body.method_health !== null) {
    const parsed = parseMethodHealth(body.method_health)
    if ('error' in parsed) return json(parsed, 400)
    healthRow = parsed.row
    healthMetadata = parsed.metadata
    if (healthRow.source_sha == null && sourceSha) healthRow.source_sha = sourceSha
    if (healthRow.source_path == null) {
      healthRow.source_path = 'wcm/kb/learning/METHOD_KNOWLEDGE_HEALTH.json'
    }
  }

  let recordRows: Record<string, unknown>[] | null = null
  if (body.learning_ledger !== undefined && body.learning_ledger !== null) {
    const parsed = parseLearningLedger(body.learning_ledger)
    if ('error' in parsed) return json(parsed, 400)
    recordRows = parsed.rows
  }

  let evidenceRows: Record<string, unknown>[] | null = null
  if (body.learning_inbox !== undefined && body.learning_inbox !== null) {
    const parsed = parseLearningInbox(body.learning_inbox)
    if ('error' in parsed) return json(parsed, 400)
    evidenceRows = parsed.rows
  }

  let relationRows: Record<string, unknown>[] | null = null
  if (body.method_relationships !== undefined && body.method_relationships !== null) {
    const parsed = parseMethodRelationships(body.method_relationships)
    if ('error' in parsed) return json(parsed, 400)
    relationRows = parsed.rows
  }

  let gateRows: Record<string, unknown>[] | null = null
  if (body.method_change_gates !== undefined && body.method_change_gates !== null) {
    const parsed = parseMethodChangeGates(body.method_change_gates)
    if ('error' in parsed) return json(parsed, 400)
    gateRows = parsed.rows
    // Provenance only: when a gate row carries no source_sha, inherit the
    // top-level GitHub snapshot SHA. This is NEVER a concurrency authority —
    // optimistic concurrency uses the explicit integer `revision` only.
    if (sourceSha) {
      for (const row of gateRows) {
        if (row.source_sha == null) row.source_sha = sourceSha
      }
    }
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  let healthUpserted = false
  if (healthRow) {
    const { error } = await supabase
      .from('wcm_method_learning_health')
      .upsert(healthRow, { onConflict: 'system_id' })
    if (error) return json({ error: 'Upsert method_health failed', detail: error.message }, 500)
    healthUpserted = true
  }

  // Full authoritative snapshot semantics for every collection: GitHub main is
  // the source of truth, so the read-model must CONVERGE. Upserts update rows
  // keyed by their stable logical id (e.g. an evidence event whose review
  // moved PENDING -> DUPLICATE is updated in place), and rows absent from the
  // snapshot are removed. Nothing stays stale.
  const upsertSnapshot = async (
    table: string,
    key: string,
    rows: Record<string, unknown>[],
    snapshot: boolean,
  ) => {
    if (rows.length > 0) {
      const { error } = await supabase.from(table).upsert(rows, { onConflict: key })
      if (error) throw new Error(`Upsert ${table} failed: ${error.message}`)
    }
    let deleted = 0
    if (snapshot) {
      const keep = rows.map((r) => String(r[key]))
      const { data: existing, error: exErr } = await supabase.from(table).select(key)
      if (exErr) throw new Error(`Read ${table} failed: ${exErr.message}`)
      const stale = computeStaleKeys(
        (existing ?? []).map((r) => String((r as Record<string, unknown>)[key])),
        keep,
      )
      if (stale.length > 0) {
        const { error: delErr } = await supabase.from(table).delete().in(key, stale)
        if (delErr) throw new Error(`Delete ${table} failed: ${delErr.message}`)
        deleted = stale.length
      }
    }
    return { upserted: rows.length, deleted }
  }

  const counts: Record<string, { upserted: number; deleted: number }> = {}
  try {
    if (recordRows) {
      counts.learning_records = await upsertSnapshot(
        'wcm_method_learning_records',
        'learning_id',
        recordRows,
        true,
      )
    }
    if (evidenceRows) {
      counts.learning_evidence = await upsertSnapshot(
        'wcm_method_learning_evidence',
        'event_id',
        evidenceRows,
        true,
      )
    }
    if (relationRows) {
      counts.method_relations = await upsertSnapshot(
        'wcm_method_learning_relations',
        'relation_id',
        relationRows,
        true,
      )
    }
    if (gateRows) {
      counts.method_change_gates = await upsertSnapshot(
        'wcm_method_change_gates',
        'gate_id',
        gateRows,
        true,
      )
    }
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }

  const changed =
    healthUpserted ||
    Object.values(counts).some((c) => c.upserted > 0 || c.deleted > 0)

  return json({
    changed,
    method_health: healthUpserted,
    counts,
    source_sha: sourceSha,
    // Canonical metadata accepted but intentionally not persisted verbatim.
    method_health_metadata: healthMetadata,
  })
})
