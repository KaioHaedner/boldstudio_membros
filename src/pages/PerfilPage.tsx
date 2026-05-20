import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function PerfilPage() {
  const { user, profile, refreshProfile } = useAuth()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setPhone(profile.phone ?? '')
      setAddress(profile.address ?? '')
    }
  }, [profile])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user?.id) return
    setError(null)
    setSaved(false)
    setSubmitting(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
      })
      .eq('id', user.id)

    setSubmitting(false)
    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      await refreshProfile()
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <p className="text-sm text-bold-yellow uppercase tracking-widest">Conta</p>
        <h1 className="text-3xl font-extrabold mt-2">Meu perfil</h1>
        <p className="mt-2 text-bold-white/60">
          Atualize seus dados pessoais. O e-mail nao pode ser alterado por aqui.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-bold-white/10 bg-bold-gray p-6">
        <ReadOnlyRow label="E-mail" value={user?.email ?? ''} />

        <FormRow
          label="Nome completo"
          type="text"
          value={fullName}
          onChange={setFullName}
          required
        />

        <FormRow
          label="Telefone"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="(00) 00000-0000"
        />

        <FormRow
          label="Endereco"
          type="text"
          value={address}
          onChange={setAddress}
          placeholder="Cidade, estado"
        />

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-3">
            {error}
          </p>
        )}

        {saved && (
          <p className="flex items-center gap-2 text-sm text-bold-yellow">
            <CheckCircle2 size={16} /> Dados atualizados com sucesso.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {submitting && <Loader2 className="animate-spin" size={16} />}
          Salvar alteracoes
        </button>
      </form>

      <section className="rounded-lg border border-bold-white/10 bg-bold-gray p-6 space-y-3">
        <h2 className="text-lg font-bold">Trocar senha</h2>
        <p className="text-sm text-bold-white/60">
          Pra trocar sua senha, peca um link de redefinicao. Vamos enviar pro seu e-mail cadastrado.
        </p>
        <SendResetButton email={user?.email ?? ''} />
      </section>
    </div>
  )
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-bold-white/60">{label}</span>
      <input
        type="text"
        value={value}
        readOnly
        className="mt-1 w-full rounded-md bg-bold-black/60 border border-bold-white/10 px-3 py-2.5 text-bold-white/60"
      />
    </label>
  )
}

function FormRow({
  label,
  type,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
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
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md bg-bold-black border border-bold-white/15 px-3 py-2.5 text-bold-white placeholder-bold-white/30 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow"
      />
    </label>
  )
}

function SendResetButton({ email }: { email: string }) {
  const { resetPassword } = useAuth()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handle() {
    setSending(true)
    setError(null)
    const { error } = await resetPassword(email)
    setSending(false)
    if (error) setError(error)
    else setSent(true)
  }

  if (sent) {
    return (
      <p className="text-sm text-bold-yellow inline-flex items-center gap-2">
        <CheckCircle2 size={16} /> Link enviado para {email}
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handle}
        disabled={sending || !email}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-bold-white/15 text-bold-white hover:border-bold-yellow hover:text-bold-yellow disabled:opacity-50 transition"
      >
        {sending && <Loader2 className="animate-spin" size={14} />}
        Enviar link de redefinicao
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
