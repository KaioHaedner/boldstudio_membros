import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AuthShell } from '@/components/AuthShell'
import { PasswordInput } from '@/components/PasswordInput'
import { usePwnedCheck } from '@/hooks/usePwnedCheck'
import { useToast } from '@/components/Toast'

export function RedefinirSenhaPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [hasRecoverySession, setHasRecoverySession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const pwned = usePwnedCheck(password)

  useEffect(() => {
    // Supabase JS detecta sessao de recovery via URL hash (#access_token=...&type=recovery)
    // automaticamente, porque detectSessionInUrl: true no client.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && event === 'SIGNED_IN')) {
        setHasRecoverySession(true)
      }
      setCheckingSession(false)
    })

    supabase.auth.getSession().then(({ data }) => {
      setHasRecoverySession(!!data.session)
      setCheckingSession(false)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    if (pwned.status === 'pwned') {
      setError('Essa senha foi encontrada em vazamentos. Escolha outra.')
      return
    }

    setSubmitting(true)
    const { error: updErr } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (updErr) {
      setError(updErr.message)
      toast.error('Não foi possível atualizar', updErr.message)
      return
    }
    setSuccess(true)
    toast.success('Senha redefinida', 'Redirecionando para o app...')
    setTimeout(() => navigate('/dashboard'), 2500)
  }

  if (checkingSession) {
    return (
      <AuthShell title="Carregando...">
        <p className="text-center text-sm text-bold-white/60 flex items-center justify-center gap-2 py-4">
          <Loader2 className="animate-spin" size={14} />
          Verificando link de recuperação
        </p>
      </AuthShell>
    )
  }

  if (!hasRecoverySession) {
    return (
      <AuthShell title="Link inválido ou expirado" subtitle="Volte e peça um novo link de redefinição">
        <div className="space-y-3 text-sm text-bold-white/70 text-center">
          <p>O link de redefinição de senha precisa ser usado em até 1 hora.</p>
          <Link
            to="/recuperar-senha"
            className="block mt-4 py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 transition"
          >
            Pedir novo link
          </Link>
          <Link to="/login" className="block text-xs text-bold-white/60 hover:text-bold-yellow">
            Voltar para login
          </Link>
        </div>
      </AuthShell>
    )
  }

  if (success) {
    return (
      <AuthShell title="Senha redefinida" subtitle="Redirecionando para o app...">
        <p className="flex items-center justify-center gap-2 text-sm text-bold-yellow">
          <CheckCircle2 size={16} /> Sua senha foi atualizada com sucesso.
        </p>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Definir nova senha" subtitle="Escolha uma senha segura">
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Nova senha"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
            minLength={6}
            pwned={pwned}
          />
          <PasswordInput
            label="Confirmar nova senha"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            required
            minLength={6}
          />

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || pwned.status === 'pwned' || pwned.status === 'checking'}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting && <Loader2 className="animate-spin" size={16} />}
            Atualizar senha
          </button>
      </form>
    </AuthShell>
  )
}
