import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { AvatarUploader } from '@/components/AvatarUploader'
import { fetchCEP, maskCEP } from '@/lib/viacep'
import { isValidWhatsapp, maskWhatsapp } from '@/lib/phone'
import { APP_VERSION } from '@/lib/version'

export function PerfilPage() {
  const { user, profile, refreshProfile } = useAuth()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [pais, setPais] = useState('Brasil')
  const [cepLoading, setCepLoading] = useState(false)
  const [cepNotFound, setCepNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setPhone(profile.phone ?? '')
      setWhatsapp(maskWhatsapp(profile.whatsapp ?? ''))
      setCep(profile.cep ? maskCEP(profile.cep) : '')
      setRua(profile.rua ?? '')
      setNumero(profile.numero ?? '')
      setComplemento(profile.complemento ?? '')
      setBairro(profile.bairro ?? '')
      setCidade(profile.cidade ?? '')
      setEstado(profile.estado ?? '')
      setPais(profile.pais ?? 'Brasil')
    }
  }, [profile])

  // Auto-buscar CEP quando 8 digitos
  useEffect(() => {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) {
      setCepNotFound(false)
      return
    }
    let active = true
    setCepLoading(true)
    setCepNotFound(false)
    fetchCEP(digits).then((data) => {
      if (!active) return
      setCepLoading(false)
      if (!data) {
        setCepNotFound(true)
        return
      }
      setRua(data.logradouro || '')
      setBairro(data.bairro || '')
      setCidade(data.localidade || '')
      setEstado(data.uf || '')
      setPais('Brasil')
    })
    return () => {
      active = false
    }
  }, [cep])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user?.id) return
    setError(null)
    setSaved(false)

    if (!fullName.trim()) {
      setError('Nome eh obrigatorio.')
      return
    }
    if (!isValidWhatsapp(whatsapp)) {
      setError('WhatsApp invalido. Use DDD + numero.')
      return
    }

    setSubmitting(true)
    const { error: updErr } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        whatsapp: whatsapp.replace(/\D/g, ''),
        cep: cep.replace(/\D/g, '') || null,
        rua: rua.trim() || null,
        numero: numero.trim() || null,
        complemento: complemento.trim() || null,
        bairro: bairro.trim() || null,
        cidade: cidade.trim() || null,
        estado: estado.trim() || null,
        pais: pais.trim() || null,
      })
      .eq('id', user.id)

    setSubmitting(false)
    if (updErr) {
      setError(updErr.message)
    } else {
      setSaved(true)
      await refreshProfile()
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <header className="text-sm">
        <p className="text-bold-yellow uppercase tracking-widest text-xs">Conta</p>
        <h1 className="text-2xl font-extrabold mt-1.5">Meu perfil</h1>
        <p className="mt-1 text-bold-white/60 text-xs">
          Atualize seus dados. WhatsApp eh obrigatorio. O e-mail nao pode ser alterado por aqui.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8">
        {/* COLUNA ESQUERDA: AVATAR */}
        <aside className="rounded-lg border border-bold-white/10 bg-bold-gray/50 backdrop-blur p-5 lg:sticky lg:top-24 self-start">
          <AvatarUploader size={154} />
          <div className="mt-5 pt-4 border-t border-bold-white/10 text-center space-y-1">
            <p className="text-xs text-bold-white/40 uppercase tracking-widest">Conta</p>
            <p className="text-sm font-semibold truncate" title={user?.email ?? ''}>{user?.email}</p>
            {profile?.role === 'admin' && (
              <p className="inline-block mt-2 px-2 py-0.5 rounded-full bg-bold-yellow/20 text-bold-yellow text-[10px] uppercase font-bold tracking-wider">
                Admin
              </p>
            )}
          </div>
        </aside>

        {/* COLUNA DIREITA: DADOS */}
        <div className="space-y-5 rounded-lg border border-bold-white/10 bg-bold-gray/50 backdrop-blur p-5">
          <section>
            <SectionTitle>Dados pessoais</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field label="Nome completo" type="text" value={fullName} onChange={setFullName} required full />
              <Field
                label="WhatsApp *"
                type="tel"
                value={whatsapp}
                onChange={(v) => setWhatsapp(maskWhatsapp(v))}
                placeholder="(00) 00000-0000"
                required
              />
              <Field
                label="Telefone fixo (opcional)"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="(00) 0000-0000"
              />
            </div>
          </section>

          <section>
            <SectionTitle>Endereco</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3.5">
              <div className="sm:col-span-2">
                <Field
                  label="CEP"
                  type="text"
                  value={cep}
                  onChange={(v) => setCep(maskCEP(v))}
                  placeholder="00000-000"
                  rightIcon={
                    cepLoading ? (
                      <Loader2 className="animate-spin text-bold-yellow" size={14} />
                    ) : (
                      <Search size={14} className="text-bold-white/30" />
                    )
                  }
                />
                {cepNotFound && (
                  <p className="mt-1 text-[11px] text-amber-400">CEP nao encontrado.</p>
                )}
              </div>

              <Field label="Rua" type="text" value={rua} onChange={setRua} className="sm:col-span-4" />
              <Field label="Numero" type="text" value={numero} onChange={setNumero} className="sm:col-span-1" />
              <Field label="Complemento" type="text" value={complemento} onChange={setComplemento} className="sm:col-span-3" placeholder="Apto, sala..." />
              <Field label="Bairro" type="text" value={bairro} onChange={setBairro} className="sm:col-span-2" />
              <Field label="Cidade" type="text" value={cidade} onChange={setCidade} className="sm:col-span-3" />
              <Field label="UF" type="text" value={estado} onChange={(v) => setEstado(v.toUpperCase().slice(0, 2))} className="sm:col-span-1" />
              <Field label="Pais" type="text" value={pais} onChange={setPais} className="sm:col-span-2" />
            </div>
          </section>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-2.5">
              {error}
            </p>
          )}
          {saved && (
            <p className="flex items-center gap-2 text-xs text-bold-yellow">
              <CheckCircle2 size={14} /> Dados atualizados com sucesso.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-bold-white/10">
            <SendResetButton email={user?.email ?? ''} />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-bold-yellow text-bold-black text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {submitting && <Loader2 className="animate-spin" size={14} />}
              Salvar alteracoes
            </button>
          </div>

          <p className="text-center text-[10px] text-bold-white/30 uppercase tracking-widest pt-2">
            bold. v{APP_VERSION}
          </p>
        </div>
      </form>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-widest text-bold-yellow mb-3">
      {children}
    </h2>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
  required,
  placeholder,
  className,
  rightIcon,
  full,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
  className?: string
  rightIcon?: React.ReactNode
  full?: boolean
}) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''} ${className ?? ''}`}>
      <span className="text-[10px] uppercase tracking-wider text-bold-white/60">{label}</span>
      <div className="mt-1 relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-md bg-bold-black border border-bold-white/15 px-2.5 py-2 pr-8 text-sm text-bold-white placeholder-bold-white/30 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow"
        />
        {rightIcon && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">{rightIcon}</span>
        )}
      </div>
    </label>
  )
}

function SendResetButton({ email }: { email: string }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handle() {
    setSending(true)
    setErr(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar-senha`,
    })
    setSending(false)
    if (error) setErr(error.message)
    else setSent(true)
  }

  if (sent) {
    return (
      <p className="text-xs text-bold-yellow inline-flex items-center gap-1.5">
        <CheckCircle2 size={12} /> Link de troca enviado para {email}
      </p>
    )
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handle}
        disabled={sending || !email}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-bold-white/15 text-bold-white/80 text-xs hover:border-bold-yellow hover:text-bold-yellow disabled:opacity-50 transition"
      >
        {sending && <Loader2 className="animate-spin" size={12} />}
        Trocar senha por e-mail
      </button>
      {err && <p className="text-[11px] text-red-400">{err}</p>}
    </div>
  )
}
