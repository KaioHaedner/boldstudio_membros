// Edge Function: envia email de confirmacao para um lead que preencheu o
// formulario de contato / RecIA no site institucional. Publica (sem JWT) —
// chamada via supabase.functions.invoke com a anon key.
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM = 'Bold Studio Brasil <contato@boldstudiobrasil.com>'
const WHATSAPP = '5566996402088'

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

function emailHtml(nome: string): string {
  const primeiro = nome.trim().split(' ')[0] || nome
  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#000;color:#fff;padding:40px 24px;max-width:480px;margin:0 auto;border-radius:16px">
    <div style="font-size:26px;font-weight:800;color:#fff;margin-bottom:24px;text-align:center">Bold<span style="color:#FFD712">Studio</span></div>
    <h1 style="font-size:22px;color:#fff;margin:0 0 12px">Recebemos seus dados! 🎬</h1>
    <p style="color:#ccc;font-size:15px;line-height:1.6;margin:0 0 12px">Oi ${primeiro}, obrigado por falar com a Bold Studio Brasil.</p>
    <p style="color:#ccc;font-size:15px;line-height:1.6;margin:0 0 12px">Já recebemos suas informações e nossa equipe vai entrar em contato com você em até <strong style="color:#FFD712">24 horas</strong>.</p>
    <p style="color:#ccc;font-size:15px;line-height:1.6;margin:0 0 20px">Quer adiantar a conversa? Fala com a gente agora mesmo no WhatsApp:</p>
    <div style="text-align:center;margin:24px 0">
      <a href="https://wa.me/${WHATSAPP}" style="display:inline-block;background:#FFD712;color:#000;font-weight:700;font-size:15px;text-decoration:none;padding:14px 28px;border-radius:999px">Chamar no WhatsApp</a>
    </div>
    <p style="color:#888;font-size:12px;margin-top:28px;text-align:center">Bold Studio Brasil — Estúdio audiovisual em Sinop, MT</p>
  </div>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const { nome, email } = await req.json()
    if (!email || typeof email !== 'string') return json({ error: 'email obrigatorio' }, 400)

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: 'Recebemos seu contato — Bold Studio Brasil',
        html: emailHtml(typeof nome === 'string' ? nome : ''),
      }),
    })
    if (!resp.ok) return json({ error: 'email_failed', detail: await resp.text() }, 502)

    return json({ success: true })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
