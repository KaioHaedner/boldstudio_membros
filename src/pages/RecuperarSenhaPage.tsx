import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthShell, Field } from '@/components/AuthShell'
import { useToast } from '@/components/Toast'

export function RecuperarSenhaPage() {
  const { resetPassword } = useAuth()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await resetPassword(email)
    setSubmitting(false)
    if (error) {
      setError(error)
      toast.error('Não foi possível enviar', error)
    } else {
      setSent(true)
      toast.success('Link enviado', 'Confira sua caixa de entrada.')
    }
  }

  if (sent) {
    return (
      <AuthShell title="Link enviado" subtitle="Verifique sua caixa de entrada">
        <p className="text-sm text-bold-white/70 text-center">
          Se houver conta com <strong className="text-bold-white">{email}</strong>, você vai receber um e-mail com link para redefinir a senha.
        </p>
        <Link
          to="/login"
          className="block text-center mt-6 py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 transition"
        >
          Voltar para login
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Esqueci minha senha" subtitle="Vamos te enviar um link de redefinição">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" required />

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
          Enviar link
        </button>

        <p className="text-center text-xs text-bold-white/60">
          <Link to="/login" className="text-bold-yellow hover:underline">
            Voltar para login
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
