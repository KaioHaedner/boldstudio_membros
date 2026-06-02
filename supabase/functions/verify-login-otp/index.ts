// Edge Function: valida o codigo OTP digitado pelo usuario no /2fa.
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const MAX_ATTEMPTS = 5

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const jwt = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
    if (!jwt) return json({ error: 'missing token' }, 401)

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE)
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt)
    if (userErr || !userData.user) return json({ error: 'unauthorized' }, 401)
    const user = userData.user

    const { code } = await req.json().catch(() => ({ code: '' }))
    if (!code || String(code).length !== 6) return json({ success: false, error: 'invalid_format' })

    const { data: otp } = await admin
      .from('login_otp')
      .select('*')
      .eq('user_id', user.id)
      .eq('consumed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!otp) return json({ success: false, error: 'no_code' })
    if (new Date(otp.expires_at).getTime() < Date.now()) return json({ success: false, error: 'expired' })
    if (otp.attempts >= MAX_ATTEMPTS) return json({ success: false, error: 'too_many' })

    const hash = await sha256(String(code))
    if (hash !== otp.code_hash) {
      await admin.from('login_otp').update({ attempts: otp.attempts + 1 }).eq('id', otp.id)
      return json({ success: false, error: 'invalid', remaining: MAX_ATTEMPTS - (otp.attempts + 1) })
    }

    await admin.from('login_otp').update({ consumed: true }).eq('id', otp.id)
    return json({ success: true })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
