import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Loader2, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { AuthShell } from '@/components/AuthShell'
import { is2faVerified, set2faVerified } from '@/lib/twoFactor'

export function TwoFactorPage() {
  const { session, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  if (!loading && !session) return <Navigate to="/login" replace />
  if (is2faVerified()) return <Navigate to="/dashboard" replace />

  async function handleVerify(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (code.length !== 6) {
      setError('Digite os 6 dígitos do código.')
      return
    }
    setSubmitting(true)
    const { data, error: invErr } = await supabase.functions.invoke('verify-login-otp', {
      body: { code },
    })
    setSubmitting(false)

    if (invErr) {
      setError('Não foi possível validar agora. Tente de novo.')
      return
    }
    if (!data?.success) {
      setError(traduzir(data?.error, data?.remaining))
      return
    }
    set2faVerified()
    navigate('/dashboard', { replace: true })
  }

  async function handleResend() {
    setResending(true)
    setError(null)
    await supabase.functions.invoke('send-login-otp')
    setResending(false)
    setResent(true)
    setCode('')
    setTimeout(() => setResent(false), 4000)
  }

  async function handleTrocarConta() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <AuthShell title="Verificação em 2 etapas" subtitle="Enviamos um código de 6 dígitos pro seu e-mail">
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

        {resent && (
          <p className="text-sm text-green-300 bg-green-500/10 border border-green-500/30 rounded-md p-3">
            Novo código enviado! Confira seu e-mail.
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

        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="flex items-center gap-1.5 text-bold-white/60 hover:text-bold-yellow disabled:opacity-50 transition"
          >
            <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
            Reenviar código
          </button>
          <button
            type="button"
            onClick={handleTrocarConta}
            className="text-bold-white/60 hover:text-bold-white transition"
          >
            Entrar com outra conta
          </button>
        </div>
      </form>
    </AuthShell>
  )
}

function traduzir(err?: string, remaining?: number): string {
  switch (err) {
    case 'invalid':
      return remaining && remaining > 0
        ? `Código incorreto. ${remaining} tentativa(s) restante(s).`
        : 'Código incorreto.'
    case 'expired':
      return 'O código expirou. Clique em "Reenviar código".'
    case 'no_code':
      return 'Nenhum código ativo. Clique em "Reenviar código".'
    case 'too_many':
      return 'Muitas tentativas. Reenvie um novo código.'
    case 'invalid_format':
      return 'Digite os 6 dígitos do código.'
    default:
      return 'Não foi possível validar. Tente novamente.'
  }
}
