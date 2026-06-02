// Webhook da Ticto (v2.0): recebe a notificacao, valida o token, registra a compra
// e — quando aprovada (authorized) — cria/garante o aluno e libera o acesso + email.
// Deploy com --no-verify-jwt (a Ticto nao envia JWT do Supabase).
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const TICTO_TOKEN = Deno.env.get('TICTO_WEBHOOK_TOKEN') ?? ''
const ACADEMY_URL = 'https://academy.boldstudiobrasil.com'
const FROM = 'BOLD Studio <acesso@boldstudiobrasil.com>'

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

function mapStatus(raw: unknown): 'approved' | 'refunded' | 'chargeback' | 'pending' | 'refused' {
  const v = String(raw ?? '').toLowerCase()
  if (['authorized', 'approved', 'paid', 'complete', 'completed', 'aprovado'].some((s) => v.includes(s))) return 'approved'
  if (v.includes('refund') || v.includes('estorn')) return 'refunded'
  if (v.includes('chargeback')) return 'chargeback'
  if (v.includes('refused') || v.includes('recus')) return 'refused'
  return 'pending'
}

// Le um campo testando varios caminhos; ignora objetos (so string/number)
function pick(obj: Record<string, unknown>, paths: string[]): string {
  for (const p of paths) {
    const val = p.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], obj)
    if (val != null && (typeof val === 'string' || typeof val === 'number')) {
      const s = String(val).trim()
      if (s !== '') return s
    }
  }
  return ''
}

// Telefone da Ticto vem como objeto { ddi, ddd, number }
function extractPhone(payload: Record<string, unknown>): string {
  const p = (payload.customer as Record<string, unknown>)?.phone
  if (!p) return ''
  if (typeof p === 'string') return p
  if (typeof p === 'object') {
    const o = p as Record<string, unknown>
    const ddi = String(o.ddi ?? '+55').replace(/[^\d+]/g, '')
    const ddd = String(o.ddd ?? '')
    const num = String(o.number ?? '')
    return `${ddi}${ddd}${num}`
  }
  return ''
}

async function logErr(admin: ReturnType<typeof createClient>, message: string, detail: unknown) {
  try {
    await admin.from('error_log').insert({ message, stack: JSON.stringify(detail).slice(0, 3000), url: 'webhook-ticto' })
  } catch (_e) { /* noop */ }
}

async function sendAccessEmail(email: string, name: string, actionLink: string) {
  const html = `<div style="font-family:Arial,sans-serif;background:#000;color:#fff;padding:40px 24px;text-align:center;max-width:480px;margin:0 auto">
    <div style="font-size:26px;font-weight:800">bold<span style="color:#FFD712">.</span></div>
    <h2 style="margin-top:24px">Bem-vindo${name ? ', ' + name : ''}! Seu acesso esta liberado.</h2>
    <p style="color:#ccc">Clique no botao para definir sua senha e entrar na Academy.</p>
    <a href="${actionLink}" style="display:inline-block;margin-top:16px;background:#FFD712;color:#000;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none">Acessar a Academy</a>
    <p style="color:#888;font-size:12px;margin-top:24px">Ou acesse ${ACADEMY_URL}</p>
  </div>`
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [email], subject: 'Seu acesso a BOLD Academy esta liberado', html }),
  })
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return json({ ok: false, error: 'invalid_json' })
  }

  const token = pick(payload, ['token', 'hottok']) || req.headers.get('x-ticto-token') || ''
  if (TICTO_TOKEN && token !== TICTO_TOKEN) return json({ ok: false, error: 'invalid_token' }, 401)

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE)

  try {
    const status = mapStatus(pick(payload, ['status', 'order_status', 'transaction_status', 'order.status']))
    const email = pick(payload, ['customer.email', 'email', 'buyer.email']).toLowerCase()
    const name = pick(payload, ['customer.name', 'name', 'buyer.name'])
    const phone = extractPhone(payload)
    const txId = pick(payload, ['order.transaction_hash', 'order.hash', 'order.id', 'transaction.id', 'order_id', 'id']) || `ticto-${Date.now()}`
    const amountRaw = pick(payload, ['order.paid_amount', 'item.amount', 'amount', 'order.amount'])
    const amountCents = amountRaw.includes('.') || amountRaw.includes(',')
      ? Math.round(Number(amountRaw.replace(',', '.')) * 100)
      : Math.round(Number(amountRaw)) || 0

    if (!email) {
      await logErr(admin, 'webhook-ticto sem email', payload)
      return json({ ok: true, note: 'sem email - logado' })
    }

    // Acha ou cria o usuario
    let userId = ''
    const created = await admin.auth.admin.createUser({ email, email_confirm: true, user_metadata: { full_name: name } })
    if (created.data?.user) {
      userId = created.data.user.id
    } else {
      const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
      userId = list.users.find((u) => u.email?.toLowerCase() === email)?.id ?? ''
    }
    if (!userId) {
      await logErr(admin, 'webhook-ticto user_resolve_failed', { email, createErr: created.error?.message })
      return json({ ok: false, error: 'user_resolve_failed' })
    }

    // Preenche perfil (sem apagar o que ja existe)
    const profilePatch: Record<string, string> = {}
    if (name) profilePatch.full_name = name
    if (phone) profilePatch.whatsapp = phone
    if (Object.keys(profilePatch).length) {
      const up = await admin.from('profiles').update(profilePatch).eq('id', userId)
      if (up.error) await logErr(admin, 'webhook-ticto profile_update', up.error.message)
    }

    // Registra a compra (idempotente)
    const purchase = await admin.from('purchases').upsert(
      {
        user_id: userId,
        gateway: 'ticto',
        transaction_id: txId,
        amount_cents: amountCents,
        currency: 'BRL',
        status: status === 'refused' ? 'pending' : status,
        granted_at: status === 'approved' ? new Date().toISOString() : null,
        raw_payload: payload,
      },
      { onConflict: 'gateway,transaction_id' }
    )
    if (purchase.error) {
      await logErr(admin, 'webhook-ticto purchase_upsert', purchase.error.message)
      return json({ ok: false, error: 'purchase_failed', detail: purchase.error.message })
    }

    // Aprovada -> manda email de acesso
    if (status === 'approved') {
      try {
        const { data: link } = await admin.auth.admin.generateLink({
          type: 'recovery',
          email,
          options: { redirectTo: `${ACADEMY_URL}/redefinir-senha` },
        })
        const actionLink = link?.properties?.action_link ?? `${ACADEMY_URL}/login`
        await sendAccessEmail(email, name, actionLink)
      } catch (e) {
        await logErr(admin, 'webhook-ticto email', String(e))
      }
    }

    return json({ ok: true, status, userId })
  } catch (e) {
    await logErr(admin, 'webhook-ticto fatal', String(e))
    return json({ ok: false, error: String(e) })
  }
})
