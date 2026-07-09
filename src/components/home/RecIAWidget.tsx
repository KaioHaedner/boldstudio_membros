import { useEffect, useState, type FormEvent } from 'react'
import { Send, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useI18n } from '@/i18n/I18nContext'

type Stage = 'closed' | 'welcome' | 'lead' | 'chat'

type LeadInfo = { nome: string; whatsapp: string; email: string; cidade: string }

type Message = { role: 'user' | 'recia'; text: string }

const INITIAL_LEAD: LeadInfo = { nome: '', whatsapp: '', email: '', cidade: '' }

const RECIA_ICON = '/brand/logo-recia.svg'

// Salva o lead no Supabase (tabela recia_leads). Visitante anonimo: o RLS
// libera INSERT para anon e restringe a leitura ao admin (pagina "RecIA Forms").
async function saveReciaLead(lead: LeadInfo) {
  const { error } = await supabase.from('recia_leads').insert({
    nome: lead.nome,
    whatsapp: lead.whatsapp,
    email: lead.email,
    cidade: lead.cidade,
    source: 'recia_widget',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  })
  if (error) console.error('RecIA: falha ao salvar lead', error.message)

  // Email de confirmacao (Resend via edge function). Best-effort.
  try {
    await supabase.functions.invoke('send-lead-email', {
      body: { nome: lead.nome, email: lead.email },
    })
  } catch {
    /* email opcional */
  }
  return lead
}

export function RecIAWidget() {
  const { t } = useI18n()
  const [stage, setStage] = useState<Stage>('closed')
  const [lead, setLead] = useState<LeadInfo>(INITIAL_LEAD)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [teaser, setTeaser] = useState(0)

  // Cicla as frases dos baloes enquanto o widget esta fechado.
  useEffect(() => {
    if (stage !== 'closed') return
    const id = window.setInterval(() => {
      setTeaser((prev) => (prev + 1) % t.recia.teasers.length)
    }, 3600)
    return () => window.clearInterval(id)
  }, [stage, t.recia.teasers.length])

  async function startChat(e: FormEvent) {
    e.preventDefault()
    if (!lead.nome || !lead.whatsapp || !lead.email || !lead.cidade) return
    await saveReciaLead(lead)
    setMessages([
      { role: 'recia', text: t.recia.greeting.replace('{name}', lead.nome.split(' ')[0]) },
    ])
    setStage('chat')
  }

  async function sendMessage(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return
    const next = [...messages, { role: 'user' as const, text: input.trim() }]
    setMessages(next)
    setInput('')
    setSending(true)
    // TODO (fase RecIA): plugar motor de IA real (Claude). O historico (next) ja chega pronto.
    await new Promise((resolve) => setTimeout(resolve, 500))
    setMessages((prev) => [...prev, { role: 'recia', text: t.recia.botReply }])
    setSending(false)
  }

  function close() {
    setStage('closed')
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Balao de chamada (apenas com o widget fechado) */}
      {stage === 'closed' && (
        <div
          key={teaser}
          className="recia-bubble mb-3 max-w-[15rem] rounded-2xl rounded-br-sm bg-bold-white px-4 py-2.5 text-sm font-medium text-bold-black shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]"
        >
          {t.recia.teasers[teaser]}
        </div>
      )}

      {stage === 'closed' && (
        <button
          type="button"
          onClick={() => setStage('welcome')}
          aria-label={t.recia.openAria}
          className="relative flex h-16 w-16 items-center justify-center rounded-full drop-shadow-[0_8px_25px_rgba(255,215,18,0.45)] transition-transform hover:scale-105"
        >
          <img src={RECIA_ICON} alt="RecIA" className="h-16 w-16 object-contain" />
          {/* Sinal vermelho de "nova mensagem" (notificacao) */}
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-bold-black bg-red-500 text-[10px] font-bold text-bold-white">
              1
            </span>
          </span>
        </button>
      )}

      {stage !== 'closed' && (
        <div className="liquid-glass recia-solid flex h-[30rem] w-[21rem] flex-col overflow-hidden rounded-[26px]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <img src={RECIA_ICON} alt="RecIA" className="h-8 w-8 object-contain" />
              <div className="leading-tight">
                <p className="text-sm font-bold text-bold-white">RecIA · BoldStudio</p>
                <span className="flex items-center gap-1 text-[10px] font-medium text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  {t.recia.online}
                </span>
              </div>
            </div>
            <button type="button" onClick={close} aria-label={t.recia.closeAria} className="text-bold-white/60 hover:text-bold-white">
              <X size={18} />
            </button>
          </div>

          {stage === 'welcome' && (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
              <img src={RECIA_ICON} alt="RecIA" className="h-14 w-14 object-contain" />
              <div>
                <p className="text-lg font-black text-bold-white">{t.recia.welcomeTitle}</p>
                <p className="mt-2 text-sm text-bold-white/60">{t.recia.welcomeText}</p>
              </div>
              <button
                type="button"
                onClick={() => setStage('lead')}
                className="rounded-lg bg-bold-yellow px-6 py-3 text-sm font-bold text-bold-black transition-transform hover:scale-[1.03]"
              >
                {t.recia.start}
              </button>
            </div>
          )}

          {stage === 'lead' && (
            <form onSubmit={startChat} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              <p className="text-xs text-bold-white/60">{t.recia.leadPrompt}</p>
              <input
                required
                value={lead.nome}
                onChange={(e) => setLead((p) => ({ ...p, nome: e.target.value }))}
                placeholder={t.recia.nome}
                className="rounded-xl border border-white/10 bg-bold-black/40 px-3 py-2 text-sm text-bold-white outline-none placeholder:text-bold-white/35 focus:border-bold-yellow"
              />
              <input
                required
                value={lead.whatsapp}
                onChange={(e) => setLead((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder={t.recia.whatsapp}
                className="rounded-xl border border-white/10 bg-bold-black/40 px-3 py-2 text-sm text-bold-white outline-none placeholder:text-bold-white/35 focus:border-bold-yellow"
              />
              <input
                required
                type="email"
                value={lead.email}
                onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                placeholder={t.recia.email}
                className="rounded-xl border border-white/10 bg-bold-black/40 px-3 py-2 text-sm text-bold-white outline-none placeholder:text-bold-white/35 focus:border-bold-yellow"
              />
              <input
                required
                value={lead.cidade}
                onChange={(e) => setLead((p) => ({ ...p, cidade: e.target.value }))}
                placeholder={t.recia.cidade}
                className="rounded-xl border border-white/10 bg-bold-black/40 px-3 py-2 text-sm text-bold-white outline-none placeholder:text-bold-white/35 focus:border-bold-yellow"
              />
              <button type="submit" className="mt-auto rounded-lg bg-bold-yellow px-4 py-2.5 text-sm font-bold text-bold-black transition-transform hover:scale-[1.02]">
                {t.recia.begin}
              </button>
            </form>
          )}

          {stage === 'chat' && (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm',
                      msg.role === 'recia'
                        ? 'bg-bold-gray text-bold-white/90'
                        : 'ml-auto bg-bold-yellow text-bold-black'
                    )}
                  >
                    {msg.text}
                  </div>
                ))}
                {sending && <p className="text-xs text-bold-white/40">{t.recia.typing}</p>}
              </div>
              <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-white/10 p-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.recia.inputPlaceholder}
                  className="flex-1 rounded-lg border border-white/10 bg-bold-black/40 px-4 py-2 text-sm text-bold-white outline-none placeholder:text-bold-white/35 focus:border-bold-yellow"
                />
                <button type="submit" aria-label={t.recia.sendAria} className="rounded-lg bg-bold-yellow p-2.5 text-bold-black">
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  )
}
