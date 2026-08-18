import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

/**
 * One-shot, self-disabling bootstrap of the single WCM owner account.
 * It only ever targets the hardcoded owner address and becomes a no-op
 * as soon as an owner role row exists. No password is ever invented or
 * returned: the owner sets it through the emailed recovery link.
 */
const OWNER_EMAIL = 'stefano1975.coppola@gmail.com'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  const redirectTo = (() => {
    try {
      const body = new URL(req.url).searchParams.get('redirect_to')
      return body ?? 'https://datawise-biz-bridge.lovable.app/wcm'
    } catch (_e) {
      return 'https://datawise-biz-bridge.lovable.app/wcm'
    }
  })()

  const { data: existingOwners } = await admin
    .from('user_roles')
    .select('user_id')
    .eq('role', 'owner')
    .limit(1)

  if (existingOwners && existingOwners.length > 0) {
    return json({ bootstrapped: false, reason: 'OWNER_ALREADY_EXISTS' })
  }

  // Locate or create the auth user without setting a usable password.
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
  let user = list?.users?.find((u) => u.email?.toLowerCase() === OWNER_EMAIL)

  let invited = false
  let inviteError: string | null = null

  if (!user) {
    const { data: inviteData, error } = await admin.auth.admin.inviteUserByEmail(OWNER_EMAIL, {
      redirectTo,
    })
    if (!error && inviteData?.user) {
      user = inviteData.user
      invited = true
    } else {
      inviteError = error?.message ?? 'invite failed'
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email: OWNER_EMAIL,
        email_confirm: true,
        password: crypto.randomUUID() + crypto.randomUUID(),
      })
      if (createError || !created?.user) {
        return json({ error: 'Cannot create owner user', detail: createError?.message }, 500)
      }
      user = created.user
    }
  }

  const { error: roleError } = await admin
    .from('user_roles')
    .upsert({ user_id: user.id, role: 'owner' }, { onConflict: 'user_id,role' })
  if (roleError) return json({ error: 'Cannot assign owner role', detail: roleError.message }, 500)

  let recoverySent = false
  let recoveryError: string | null = null
  if (!invited) {
    const { error } = await admin.auth.resetPasswordForEmail(OWNER_EMAIL, { redirectTo })
    recoverySent = !error
    recoveryError = error?.message ?? null
  }

  return json({
    bootstrapped: true,
    email: OWNER_EMAIL,
    invited,
    invite_error: inviteError,
    recovery_sent: recoverySent,
    recovery_error: recoveryError,
  })
})
