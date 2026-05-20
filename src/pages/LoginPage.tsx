import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const APP_SPLASH_KEY = 'bold:app-splash-shown'

export function LoginPage() {
  const { session, signIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!authLoading && session) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError(traduzirErro(error))
      return
    }
    sessionStorage.removeItem(APP_SPLASH_KEY)
    navigate(from, { replace: true })
  }

  return (
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
        <Field
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />

        <div className="flex justify-end">
          <Link
            to="/recuperar-senha"
            className="text-xs text-bold-white/60 hover:text-bold-yellow"
          >
            Esqueci minha senha
          </Link>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
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
    <div className="min-h-screen bg-bold-black text-bold-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/brand/logo-primary.png"
            alt="bold."
            className="h-12 w-auto mb-6"
            draggable={false}
          />
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-bold-white/60">{subtitle}</p>}
        </div>
        <div className="bg-bold-gray border border-bold-white/10 rounded-lg p-6 shadow-2xl">
          {children}
        </div>
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
  if (m.includes('user already registered')) return 'Esse e-mail ja tem cadastro.'
  if (m.includes('weak password')) return 'Senha muito fraca. Use 6+ caracteres.'
  return msg
}
