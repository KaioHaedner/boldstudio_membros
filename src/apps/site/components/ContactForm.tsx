import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Mic } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ShinyButton } from '@/shared/components/ShinyButton'
import { supabase } from '@/shared/lib/supabase'
import { useI18n } from '@/apps/site/i18n/I18nContext'

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
      body: { nome: data.nome, email: data.email, origem: 'contact_form' },
    })
  } catch {
    /* email opcional */
  }
  return data
}

export function ContactForm() {
  const { t } = useI18n()
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [recording, setRecording] = useState(false)
  const submittingRef = useRef(false)
  const mountedRef = useRef(false)
  // Web Speech API (transcrição por voz). Só habilita se o navegador suportar.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const [voiceSupported] = useState(
    () =>
      typeof window !== 'undefined' &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  )

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      const recognition = recognitionRef.current
      if (!recognition) return
      recognition.onresult = null
      recognition.onend = null
      recognition.onerror = null
      recognition.abort()
      recognitionRef.current = null
    }
  }, [])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleVoice() {
    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = 'pt-BR'
    rec.continuous = true
    rec.interimResults = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let finalText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript
      }
      const clean = finalText.trim()
      if (clean) {
        setForm((prev) => ({
          ...prev,
          mensagem: prev.mensagem ? `${prev.mensagem} ${clean}` : clean,
        }))
      }
    }
    const finishVoice = () => {
      if (recognitionRef.current !== rec) return
      recognitionRef.current = null
      setRecording(false)
    }
    rec.onend = finishVoice
    rec.onerror = finishVoice
    recognitionRef.current = rec
    try {
      rec.start()
      setRecording(true)
    } catch {
      finishVoice()
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submittingRef.current || !form.nome.trim() || !form.email.trim() || !form.whatsapp.trim()) return

    submittingRef.current = true
    // A completed form must not keep the microphone active or refill the
    // cleared message after the request finishes.
    const recognition = recognitionRef.current
    if (recognition) {
      recognition.onresult = null
      recognition.onend = null
      recognition.onerror = null
      recognition.abort()
      recognitionRef.current = null
      setRecording(false)
    }

    setStatus('sending')
    try {
      await submitLead({ ...form, nome: form.nome.trim(), email: form.email.trim(), whatsapp: form.whatsapp.trim() })
      if (!mountedRef.current) return
      setStatus('sent')
      setForm(INITIAL_STATE)
    } catch {
      if (mountedRef.current) setStatus('error')
    } finally {
      submittingRef.current = false
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="liquid-glass relative z-20 flex w-full max-w-sm flex-col gap-3.5 rounded-[22px] p-5 shadow-[0_0_60px_-10px_rgba(255,215,18,0.45)] ring-1 ring-bold-yellow/25"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome" className="text-sm font-medium text-bold-white/80">{t.form.nome}</label>
          <input
            id="nome"
            required
            value={form.nome}
            onChange={(e) => update('nome', e.target.value)}
            className={INPUT_CLASS}
            placeholder={t.form.nomePh}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-bold-white/80">{t.form.email}</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={INPUT_CLASS}
            placeholder={t.form.emailPh}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="whatsapp" className="text-sm font-medium text-bold-white/80">{t.form.whatsapp}</label>
        <input
          id="whatsapp"
          type="tel"
          autoComplete="tel"
          required
          value={form.whatsapp}
          onChange={(e) => update('whatsapp', e.target.value)}
          className={INPUT_CLASS}
          placeholder={t.form.whatsappPh}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mensagem" className="text-sm font-medium text-bold-white/80">{t.form.mensagem}</label>
        <div className="relative">
          <textarea
            id="mensagem"
            rows={3}
            value={form.mensagem}
            onChange={(e) => update('mensagem', e.target.value)}
            className={cn(INPUT_CLASS, 'w-full resize-none pr-14')}
            placeholder={recording ? 'Gravando… pode falar' : t.form.mensagemPh}
          />
          {voiceSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              aria-label={recording ? 'Parar gravação' : 'Descrever o projeto por voz'}
              title={recording ? 'Parar gravação' : 'Descrever por voz'}
              className={cn(
                'absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full transition-transform',
                recording ? 'bg-red-600 text-white' : 'bg-bold-yellow text-bold-black hover:scale-110'
              )}
            >
              {recording && (
                <span className="absolute inset-0 animate-ping rounded-full bg-red-600 opacity-60" />
              )}
              <Mic size={16} className="relative" />
            </button>
          )}
        </div>
      </div>

      <ShinyButton
        type="submit"
        disabled={status === 'sending'}
        className={cn('mt-1 w-full', status === 'sending' && 'pointer-events-none opacity-60')}
      >
        {status === 'sending' ? t.form.sending : t.form.send}
      </ShinyButton>

      {status === 'sent' && <p role="status" className="text-sm text-bold-yellow">{t.form.sent}</p>}
      {status === 'error' && <p role="alert" className="text-sm text-red-400">{t.form.error}</p>}
    </form>
  )
}
