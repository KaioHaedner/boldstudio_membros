// Webhook da Ticto: recebe a notificacao de compra, valida o token,
// libera o acesso (cria/garante o aluno + grava em purchases) e manda email de acesso.
// IMPORTANTE: deployar com --no-verify-jwt (a Ticto nao envia JWT do Supabase).
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

// Status da Ticto -> status da nossa tabela purchases
function mapStatus(raw: unknown): 'approved' | 'refunded' | 'chargeback' | 'pending' {
  const v = String(raw ?? '').toLowerCase()
  if (['authorized', 'approved', 'paid', 'complete', 'completed', 'aprovado'].some((s) => v.includes(s)))
    return 'approved'
  if (v.includes('refund') || v.includes('estorn')) return 'refunded'
  if (v.includes('chargeback')) return 'chargeback'
  return 'pending'
}

// Le um campo testando varios caminhos possiveis do payload
function pick(obj: Record<string, unknown>, paths: string[]): string {
  for (const p of paths) {
    const val = p.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], obj)
    if (val != null && String(val).trim() !== '') return String(val)
  }
  return ''
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
    return json({ error: 'invalid_json' }, 400)
  }

  // Validacao do token de seguranca (Ticto envia no corpo; tambem aceita header)
  const token = pick(payload, ['token', 'hottok']) || req.headers.get('x-ticto-token') || ''
  if (TICTO_TOKEN && token !== TICTO_TOKEN) return json({ error: 'invalid_token' }, 401)

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE)

  const status = mapStatus(pick(payload, ['status', 'order_status', 'transaction_status', 'order.status']))
  const email = pick(payload, ['customer.email', 'email', 'buyer.email', 'client.email']).toLowerCase()
  const name = pick(payload, ['customer.name', 'name', 'buyer.name', 'client.name'])
  const phone = pick(payload, ['customer.phone', 'phone', 'buyer.phone', 'customer.cellphone'])
  const txId = pick(payload, ['order.id', 'transaction.id', 'order_id', 'transaction_hash', 'id']) || `ticto-${Date.now()}`
  const amountRaw = pick(payload, ['amount', 'order.amount', 'value', 'order.paid_amount', 'transaction.amount'])
  const amountCents = Math.round(Number(String(amountRaw).replace(',', '.')) * 100) || 0
  const product = pick(payload, ['product.name', 'item.product_name', 'product_name', 'items.0.product_name'])

  // Sem email nao da pra liberar acesso. Loga em error_log pra debug e retorna 200.
  if (!email) {
    await admin.from('error_log').insert({
      message: 'webhook-ticto sem email no payload',
      stack: JSON.stringify(payload).slice(0, 2000),
      url: 'webhook-ticto',
    }).catch(() => {})
    return json({ ok: true, note: 'sem email no payload - logado para debug' })
  }

  // Acha ou cria o usuario
  let userId = ''
  const created = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: name },
  })
  if (created.data.user) {
    userId = created.data.user.id
  } else {
    // ja existe: busca na listagem
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
    userId = list.users.find((u) => u.email?.toLowerCase() === email)?.id ?? ''
  }
  if (!userId) return json({ error: 'user_resolve_failed', email }, 500)

  // Preenche perfil (nome/telefone) sem sobrescrever o que ja existe
  await admin.from('profiles').update({ full_name: name || undefined, whatsapp: phone || undefined }).eq('id', userId).catch(() => {})

  // Grava a compra (idempotente por gateway+transaction_id)
  await admin.from('purchases').upsert(
    {
      user_id: userId,
      gateway: 'ticto',
      transaction_id: txId,
      amount_cents: amountCents,
      currency: 'BRL',
      status,
      granted_at: status === 'approved' ? new Date().toISOString() : null,
      raw_payload: payload,
    },
    { onConflict: 'gateway,transaction_id' }
  )

  // Compra aprovada -> manda email de acesso com link pra definir senha
  if (status === 'approved') {
    try {
      const { data: link } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: { redirectTo: `${ACADEMY_URL}/redefinir-senha` },
      })
      const actionLink = link?.properties?.action_link ?? `${ACADEMY_URL}/login`
      await sendAccessEmail(email, name, actionLink)
    } catch (_e) {
      // email falhou nao deve falhar o webhook
    }
  }

  return json({ ok: true, status, product, userId })
})
