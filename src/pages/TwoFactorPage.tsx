import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Loader2, RefreshCw, Mail, MessageSquare, Phone } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { AuthShell } from '@/components/AuthShell'
import { is2faVerified, set2faVerified } from '@/lib/twoFactor'
import { homeForRole } from '@/lib/area'
import { useToast } from '@/components/Toast'

type Channel = 'email' | 'sms' | 'whatsapp'

export function TwoFactorPage() {
  const { session, loading, profile, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [channel, setChannel] = useState<Channel>('email')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sending, setSending] = useState<Channel | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  if (!loading && !session) return <Navigate to="/login" replace />
  if (is2faVerified()) return <Navigate to={homeForRole(profile?.role)} replace />

  async function handleVerify(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (code.length !== 6) {
      setError('Digite os 6 dígitos do código.')
      return
    }
    setSubmitting(true)
    const fn = channel === 'email' ? 'verify-login-otp' : 'verify-phone-otp'
    const { data, error: invErr } = await supabase.functions.invoke(fn, { body: { code } })
    setSubmitting(false)

    if (invErr) {
      setError('Não foi possível validar agora. Tente de novo.')
      toast.error('Falha na verificação', 'Tente novamente em instantes.')
      return
    }
    if (!data?.success) {
      const msg = traduzir(data?.error, data?.remaining)
      setError(msg)
      toast.error('Código reprovado', msg)
      return
    }
    set2faVerified()
    toast.success('Verificado!', 'Acesso liberado. Bem-vindo à Bold.')
    navigate(homeForRole(profile?.role), { replace: true })
  }

  // Troca o canal e dispara o envio do codigo
  async function enviarPor(ch: Channel) {
    setSending(ch)
    setError(null)
    setInfo(null)
    setCode('')
    if (ch === 'email') {
      await supabase.functions.invoke('send-login-otp')
      setChannel('email')
      setSentTo(null)
      setInfo('Código enviado pro seu e-mail.')
      toast.success('Código enviado', 'Confira seu e-mail.')
    } else {
      const { data, error: invErr } = await supabase.functions.invoke('send-phone-otp', {
        body: { channel: ch },
      })
      if (invErr || !data?.success) {
        const msg = traduzir(data?.error)
        setError(msg)
        toast.error('Não foi possível enviar', msg)
      } else {
        setChannel(ch)
        setSentTo(data.to ?? null)
        const canal = ch === 'sms' ? 'SMS' : 'WhatsApp'
        setInfo(`Código enviado por ${canal}${data.to ? ` para ${data.to}` : ''}.`)
        toast.success('Código enviado', `Enviamos por ${canal}.`)
      }
    }
    setSending(null)
    setTimeout(() => setInfo(null), 5000)
  }

  async function handleTrocarConta() {
    await signOut()
    navigate('/login', { replace: true })
  }

  const subtitle =
    channel === 'email'
      ? 'Enviamos um código de 6 dígitos pro seu e-mail'
      : `Código enviado por ${channel === 'sms' ? 'SMS' : 'WhatsApp'}${sentTo ? ` para ${sentTo}` : ''}`

  return (
    <AuthShell title="Verificação em 2 etapas" subtitle={subtitle}>
      <form onSubmit={handleVerify} className="space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-bold-white/60">Código</span>
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="______"
            autoFocus
            className="mt-1 w-full rounded-md bg-bold-black border border-bold-white/15 px-3 py-3 text-center text-2xl tracking-[0.5em] font-display text-bold-white placeholder-bold-white/20 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow"
          />
        </label>

        {info && (
          <p className="text-sm text-green-300 bg-green-500/10 border border-green-500/30 rounded-md p-3">
            {info}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || code.length !== 6}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {submitting && <Loader2 className="animate-spin" size={16} />}
          Verificar e entrar
        </button>

        {/* Canais alternativos */}
        <div className="pt-2 border-t border-bold-white/10">
          <p className="text-[11px] text-bold-white/40 text-center mb-2">Receber o código por:</p>
          <div className="grid grid-cols-3 gap-2">
            <ChannelBtn active={channel === 'email'} busy={sending === 'email'} onClick={() => enviarPor('email')} icon={Mail} label="E-mail" />
            <ChannelBtn active={channel === 'sms'} busy={sending === 'sms'} onClick={() => enviarPor('sms')} icon={Phone} label="SMS" />
            <ChannelBtn active={channel === 'whatsapp'} busy={sending === 'whatsapp'} onClick={() => enviarPor('whatsapp')} icon={MessageSquare} label="WhatsApp" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={() => enviarPor(channel)}
            disabled={sending !== null}
            className="flex items-center gap-1.5 text-bold-white/60 hover:text-bold-yellow disabled:opacity-50 transition"
          >
            <RefreshCw size={12} className={sending ? 'animate-spin' : ''} />
            Reenviar
          </button>
          <button type="button" onClick={handleTrocarConta} className="text-bold-white/60 hover:text-bold-white transition">
            Entrar com outra conta
          </button>
        </div>
      </form>
    </AuthShell>
  )
}

function ChannelBtn({
  active,
  busy,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  busy: boolean
  onClick: () => void
  icon: typeof Mail
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`flex flex-col items-center gap-1 py-2 rounded-md border text-[11px] transition ${
        active
          ? 'border-bold-yellow bg-bold-yellow/10 text-bold-yellow'
          : 'border-bold-white/10 text-bold-white/60 hover:border-bold-white/30'
      } disabled:opacity-50`}
    >
      {busy ? <Loader2 className="animate-spin" size={14} /> : <Icon size={14} />}
      {label}
    </button>
  )
}

function traduzir(err?: string, remaining?: number): string {
  switch (err) {
    case 'invalid':
      return remaining && remaining > 0
        ? `Código incorreto. ${remaining} tentativa(s) restante(s).`
        : 'Código incorreto.'
    case 'expired':
      return 'O código expirou. Reenvie um novo.'
    case 'no_code':
      return 'Nenhum código ativo. Clique em reenviar.'
    case 'too_many':
      return 'Muitas tentativas. Reenvie um novo código.'
    case 'no_phone':
      return 'Você não tem celular cadastrado. Use o e-mail ou atualize seu perfil.'
    case 'twilio_error':
      return 'Falha ao enviar pro celular. Tente o e-mail.'
    case 'invalid_format':
      return 'Digite os 6 dígitos do código.'
    default:
      return 'Não foi possível validar. Tente novamente.'
  }
}
