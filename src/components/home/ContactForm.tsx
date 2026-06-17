import { useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'
import { ShinyButton } from '@/components/ShinyButton'
import { supabase } from '@/lib/supabase'

type FormState = {
  nome: string
  email: string
  whatsapp: string
  mensagem: string
}

const INITIAL_STATE: FormState = { nome: '', email: '', whatsapp: '', mensagem: '' }

const INPUT_CLASS =
  'rounded-xl border border-white/10 bg-bold-black/30 px-4 py-3 text-sm text-bold-white outline-none transition-colors placeholder:text-bold-white/35 focus:border-bold-yellow/70 focus:bg-bold-black/40'

async function submitLead(data: FormState) {
  // Salva o lead no painel admin (RecIA Forms, source contact_form).
  const { error } = await supabase.from('recia_leads').insert({
    nome: data.nome,
    whatsapp: data.whatsapp,
    email: data.email,
    messages: data.mensagem ? [{ role: 'user', text: data.mensagem }] : [],
    source: 'contact_form',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  })
  if (error) throw new Error(error.message)

  // Dispara o email de confirmacao (Resend via edge function). Best-effort:
  // se o email falhar, o lead ja foi salvo e o form segue como enviado.
  try {
    await supabase.functions.invoke('send-lead-email', {
      body: { nome: data.nome, email: data.email },
    })
  } catch {
    /* email opcional */
  }
  return data
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.nome || !form.email || !form.whatsapp) return

    setStatus('sending')
    try {
      await submitLead(form)
      setStatus('sent')
      setForm(INITIAL_STATE)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="liquid-glass relative z-20 flex w-full max-w-2xl flex-col gap-5 rounded-[28px] p-6 sm:p-8 md:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome" className="text-sm font-medium text-bold-white/80">Nome</label>
          <input
            id="nome"
            required
            value={form.nome}
            onChange={(e) => update('nome', e.target.value)}
            className={INPUT_CLASS}
            placeholder="Seu nome"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-bold-white/80">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={INPUT_CLASS}
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="whatsapp" className="text-sm font-medium text-bold-white/80">WhatsApp</label>
        <input
          id="whatsapp"
          required
          value={form.whatsapp}
          onChange={(e) => update('whatsapp', e.target.value)}
          className={INPUT_CLASS}
          placeholder="(66) 99999-9999"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mensagem" className="text-sm font-medium text-bold-white/80">Mensagem</label>
        <textarea
          id="mensagem"
          rows={5}
          value={form.mensagem}
          onChange={(e) => update('mensagem', e.target.value)}
          className={cn(INPUT_CLASS, 'resize-none')}
          placeholder="Conta um pouco do que você precisa"
        />
      </div>

      <ShinyButton
        type="submit"
        disabled={status === 'sending'}
        className={cn('mt-1 w-full', status === 'sending' && 'pointer-events-none opacity-60')}
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
      </ShinyButton>

      {status === 'sent' && (
        <p className="text-sm text-bold-yellow">Recebido! A gente te chama no WhatsApp em breve.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-400">Algo deu errado, tenta de novo em alguns minutos.</p>
      )}
    </form>
  )
}
