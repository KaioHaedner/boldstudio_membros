// Edge Function: valida o OTP de SMS/WhatsApp via Twilio Verify (VerificationCheck).
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const TW_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!
const TW_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!
const TW_VERIFY = Deno.env.get('TWILIO_VERIFY_SERVICE_SID')!

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
}
function toE164BR(raw?: string | null): string | null {
  if (!raw) return null
  if (raw.trim().startsWith('+')) return '+' + raw.replace(/[^\d]/g, '')
  const d = raw.replace(/\D/g, '')
  if (!d) return null
  if (d.startsWith('55') && d.length >= 12) return '+' + d
  if (d.length === 10 || d.length === 11) return '+55' + d
  return '+' + d
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const jwt = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
    if (!jwt) return json({ success: false, error: 'unauthorized' }, 401)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE)
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt)
    if (userErr || !userData.user) return json({ success: false, error: 'unauthorized' }, 401)
    const user = userData.user

    const { code } = await req.json().catch(() => ({ code: '' }))
    if (!code || String(code).length < 4) return json({ success: false, error: 'invalid_format' })

    const { data: profile } = await admin
      .from('profiles')
      .select('whatsapp, phone')
      .eq('id', user.id)
      .maybeSingle()
    const phone = toE164BR(profile?.whatsapp) ?? toE164BR(profile?.phone)
    if (!phone) return json({ success: false, error: 'no_phone' })

    const basic = btoa(`${TW_SID}:${TW_TOKEN}`)
    const resp = await fetch(`https://verify.twilio.com/v2/Services/${TW_VERIFY}/VerificationCheck`, {
      method: 'POST',
      headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: phone, Code: String(code) }),
    })
    const data = await resp.json()
    if (resp.ok && data.status === 'approved' && data.valid) {
      return json({ success: true })
    }
    return json({ success: false, error: 'invalid' })
  } catch (e) {
    return json({ success: false, error: String(e) }, 500)
  }
})
