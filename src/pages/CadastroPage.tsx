import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { AuthShell, Field } from '@/pages/LoginPage'
import { PasswordInput } from '@/components/PasswordInput'
import { LoginBackground } from '@/components/LoginBackground'
import { CaptchaWidget, type CaptchaWidgetHandle } from '@/components/CaptchaWidget'

export function CadastroPage() {
  const { session } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<CaptchaWidgetHandle>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (session) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('As senhas nao coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    if (!captchaToken) {
      setError('Complete o captcha antes de continuar.')
      return
    }

    setSubmitting(true)
    const { error: signErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        captchaToken,
      },
    })
    setSubmitting(false)
    captchaRef.current?.reset()
    setCaptchaToken(null)

    if (signErr) {
      setError(signErr.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <>
        <LoginBackground />
        <AuthShell title="Verifique seu e-mail" subtitle="Falta so confirmar pra acessar">
          <div className="space-y-4 text-sm text-bold-white/70 text-center">
            <p>
              Mandamos um link de confirmacao para <strong className="text-bold-white">{email}</strong>.
            </p>
            <p>Apos confirmar, faca login normalmente.</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full mt-4 py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 transition"
            >
              Ir para login
            </button>
          </div>
        </AuthShell>
      </>
    )
  }

  return (
    <>
      <LoginBackground />
      <AuthShell title="Criar conta" subtitle="Cadastre-se para acessar as aulas">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nome completo" type="text" value={fullName} onChange={setFullName} required />
          <Field label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" required />
          <PasswordInput label="Senha" value={password} onChange={setPassword} autoComplete="new-password" required minLength={6} />
          <PasswordInput label="Confirmar senha" value={confirm} onChange={setConfirm} autoComplete="new-password" required minLength={6} />

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
            Criar conta
          </button>

          <p className="text-center text-xs text-bold-white/60">
            Ja tem conta?{' '}
            <Link to="/login" className="text-bold-yellow hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </AuthShell>
    </>
  )
}
