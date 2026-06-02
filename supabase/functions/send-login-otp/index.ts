// Edge Function: gera um codigo OTP de 6 digitos e envia por email (Resend).
// Chamada apos o login com senha. Requer JWT valido do usuario.
import { createClient } from 'jsr:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const FROM = 'BOLD Studio <acesso@boldstudiobrasil.com>'

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

function emailHtml(code: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#000;color:#fff;padding:40px 24px;text-align:center;max-width:480px;margin:0 auto">
    <div style="font-size:26px;font-weight:800;color:#fff;margin-bottom:24px">bold<span style="color:#FFD712">.</span></div>
    <p style="color:#ccc;font-size:15px;margin:0 0 8px">Seu codigo de acesso e:</p>
    <div style="font-size:38px;letter-spacing:10px;font-weight:800;color:#FFD712;margin:16px 0">${code}</div>
    <p style="color:#888;font-size:12px;margin-top:24px">Expira em 10 minutos. Se nao foi voce que tentou entrar, ignore este email.</p>
  </div>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const jwt = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
    if (!jwt) return json({ error: 'missing token' }, 401)

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE)
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt)
    if (userErr || !userData.user?.email) return json({ error: 'unauthorized' }, 401)
    const user = userData.user

    const code = String(Math.floor(100000 + Math.random() * 900000))
    const codeHash = await sha256(code)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Invalida codigos pendentes anteriores e cria o novo
    await admin.from('login_otp').update({ consumed: true }).eq('user_id', user.id).eq('consumed', false)
    const { error: insErr } = await admin
      .from('login_otp')
      .insert({ user_id: user.id, code_hash: codeHash, expires_at: expiresAt })
    if (insErr) return json({ error: insErr.message }, 500)

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [user.email],
        subject: `Seu codigo de acesso BOLD: ${code}`,
        html: emailHtml(code),
      }),
    })
    if (!resp.ok) return json({ error: 'email_failed', detail: await resp.text() }, 502)

    return json({ success: true })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
