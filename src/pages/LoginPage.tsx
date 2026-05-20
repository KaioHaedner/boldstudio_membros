import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PasswordInput } from '@/components/PasswordInput'
import { LoginBackground } from '@/components/LoginBackground'
import { CaptchaWidget, type CaptchaWidgetHandle } from '@/components/CaptchaWidget'
import { APP_VERSION } from '@/lib/version'

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
    const { error: signErr } = await supabase.auth.signInWithPassword({
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
    sessionStorage.removeItem(APP_SPLASH_KEY)
    navigate(from, { replace: true })
  }

  return (
    <>
      <LoginBackground />
      <AuthShell title="Entrar" subtitle="Acesse sua area de aluno">
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
    </>
  )
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen text-bold-white flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/brand/logo-primary.png"
            alt="bold."
            className="h-12 w-auto mb-6 drop-shadow-[0_4px_20px_rgba(255,215,18,0.3)]"
            draggable={false}
          />
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-bold-white/60">{subtitle}</p>}
        </div>
        <div className="glass-card rounded-lg p-6">
          {children}
        </div>
        <p className="mt-6 text-center text-[10px] text-bold-white/30 uppercase tracking-widest">
          bold. v{APP_VERSION}
        </p>
      </div>
    </div>
  )
}

export function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
  placeholder,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-bold-white/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md bg-bold-black border border-bold-white/15 px-3 py-2.5 text-bold-white placeholder-bold-white/30 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow"
      />
    </label>
  )
}

function traduzirErro(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.'
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.'
  if (m.includes('captcha')) return 'Captcha invalido. Tente novamente.'
  if (m.includes('user already registered')) return 'Esse e-mail ja tem cadastro.'
  if (m.includes('weak password')) return 'Senha muito fraca. Use 6+ caracteres.'
  return msg
}
