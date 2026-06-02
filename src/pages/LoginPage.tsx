import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PasswordInput } from '@/components/PasswordInput'
import { CaptchaWidget, type CaptchaWidgetHandle } from '@/components/CaptchaWidget'
import { AuthShell, Field } from '@/components/AuthShell'
import { registerDevice, logAccess } from '@/lib/deviceTracking'

export { AuthShell, Field } // re-export pra compatibilidade com imports legados

const APP_SPLASH_KEY = 'bold:app-splash-shown'

export function LoginPage() {
  const { session, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<CaptchaWidgetHandle>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!authLoading && session) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!captchaToken) {
      setError('Complete o captcha antes de entrar.')
      return
    }

    setSubmitting(true)
    const { data, error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    })
    setSubmitting(false)
    captchaRef.current?.reset()
    setCaptchaToken(null)

    if (signErr) {
      setError(traduzirErro(signErr.message))
      return
    }
    // Tracking (fire-and-forget, nao bloqueia a navegacao)
    const userId = data.user?.id
    if (userId) {
      void registerDevice(userId)
      void logAccess(userId, email, 'login')
    }
    sessionStorage.removeItem(APP_SPLASH_KEY)
    navigate(from, { replace: true })
  }

  return (
    <AuthShell title="Entrar" subtitle="Acesse sua área de aluno">
      <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <PasswordInput
            label="Senha"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
          />

          <div className="flex justify-end">
            <Link to="/recuperar-senha" className="text-xs text-bold-white/60 hover:text-bold-yellow">
              Esqueci minha senha
            </Link>
          </div>

          <CaptchaWidget
            ref={captchaRef}
            onVerify={(t) => setCaptchaToken(t)}
            onExpire={() => setCaptchaToken(null)}
          />

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !captchaToken}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {submitting && <Loader2 className="animate-spin" size={16} />}
            Entrar
          </button>

        <p className="text-center text-xs text-bold-white/60">
          Primeiro acesso?{' '}
          <Link to="/cadastro" className="text-bold-yellow hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}

function traduzirErro(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.'
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.'
  if (m.includes('captcha')) return 'Captcha inválido. Tente novamente.'
  if (m.includes('user already registered')) return 'Esse e-mail já tem cadastro.'
  if (m.includes('weak password')) return 'Senha muito fraca. Use no mínimo 6 caracteres.'
  return msg
}
