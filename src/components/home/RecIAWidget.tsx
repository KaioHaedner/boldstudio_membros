import { useEffect, useState, type FormEvent } from 'react'
import { Send, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

type Stage = 'closed' | 'welcome' | 'lead' | 'chat'

type LeadInfo = { nome: string; whatsapp: string; email: string; cidade: string }

type Message = { role: 'user' | 'recia'; text: string }

const INITIAL_LEAD: LeadInfo = { nome: '', whatsapp: '', email: '', cidade: '' }

const RECIA_ICON = '/brand/logo-recia.svg'

// Frases que sobem em balao sobre o botao quando o widget esta fechado.
const TEASERS = [
  'Fale com a gente',
  'Vídeo cinematográfico é aqui!',
  'Que tal um vídeo para sua empresa?',
]

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
  return lead
}

// TODO (fase RecIA): plugar motor de IA real (Claude). O historico ja chega pronto.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function mockReply(_history: Message[]): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return 'Anotado! Em breve aqui entra a resposta de verdade da RecIA sobre a BoldStudio.'
}

export function RecIAWidget() {
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
      setTeaser((t) => (t + 1) % TEASERS.length)
    }, 3600)
    return () => window.clearInterval(id)
  }, [stage])

  async function startChat(e: FormEvent) {
    e.preventDefault()
    if (!lead.nome || !lead.whatsapp || !lead.email || !lead.cidade) return
    await saveReciaLead(lead)
    setMessages([
      {
        role: 'recia',
        text: `Prazer, ${lead.nome.split(' ')[0]}! Sou a RecIA, da BoldStudio. Pode perguntar o que quiser sobre nossos serviços, vídeos e o estúdio aqui em Sinop.`,
      },
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
    const reply = await mockReply(next)
    setMessages((prev) => [...prev, { role: 'recia', text: reply }])
    setSending(false)
  }

  function close() {
    setStage('closed')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Balao de chamada (apenas com o widget fechado) */}
      {stage === 'closed' && (
        <div
          key={teaser}
          className="recia-bubble mb-3 max-w-[15rem] rounded-2xl rounded-br-sm bg-bold-white px-4 py-2.5 text-sm font-medium text-bold-black shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]"
        >
          {TEASERS[teaser]}
        </div>
      )}

      {stage === 'closed' && (
        <button
          type="button"
          onClick={() => setStage('welcome')}
          aria-label="Abrir RecIA"
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
        <div className="liquid-glass flex h-[30rem] w-[21rem] flex-col overflow-hidden rounded-[26px]">
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
                  Online agora
                </span>
              </div>
            </div>
            <button type="button" onClick={close} aria-label="Fechar" className="text-bold-white/60 hover:text-bold-white">
              <X size={18} />
            </button>
          </div>

          {stage === 'welcome' && (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
              <img src={RECIA_ICON} alt="RecIA" className="h-14 w-14 object-contain" />
              <div>
                <p className="text-lg font-black text-bold-white">Conheça a BoldStudio mais ainda!</p>
                <p className="mt-2 text-sm text-bold-white/60">
                  Bate um papo rápido com a RecIA e descubra como a gente pode gravar algo bold pra você.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStage('lead')}
                className="rounded-full bg-bold-yellow px-6 py-3 text-sm font-bold text-bold-black transition-transform hover:scale-[1.03]"
              >
                Iniciar conversa
              </button>
            </div>
          )}

          {stage === 'lead' && (
            <form onSubmit={startChat} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              <p className="text-xs text-bold-white/60">
                Antes da gente começar, me diz quem é você:
              </p>
              <input
                required
                value={lead.nome}
                onChange={(e) => setLead((p) => ({ ...p, nome: e.target.value }))}
                placeholder="Nome"
                className="rounded-xl border border-white/10 bg-bold-black/40 px-3 py-2 text-sm text-bold-white outline-none placeholder:text-bold-white/35 focus:border-bold-yellow"
              />
              <input
                required
                value={lead.whatsapp}
                onChange={(e) => setLead((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder="WhatsApp"
                className="rounded-xl border border-white/10 bg-bold-black/40 px-3 py-2 text-sm text-bold-white outline-none placeholder:text-bold-white/35 focus:border-bold-yellow"
              />
              <input
                required
                type="email"
                value={lead.email}
                onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                placeholder="E-mail"
                className="rounded-xl border border-white/10 bg-bold-black/40 px-3 py-2 text-sm text-bold-white outline-none placeholder:text-bold-white/35 focus:border-bold-yellow"
              />
              <input
                required
                value={lead.cidade}
                onChange={(e) => setLead((p) => ({ ...p, cidade: e.target.value }))}
                placeholder="Cidade e estado (ex.: Sinop - MT)"
                className="rounded-xl border border-white/10 bg-bold-black/40 px-3 py-2 text-sm text-bold-white outline-none placeholder:text-bold-white/35 focus:border-bold-yellow"
              />
              <button type="submit" className="mt-auto rounded-full bg-bold-yellow px-4 py-2.5 text-sm font-bold text-bold-black transition-transform hover:scale-[1.02]">
                Começar
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
                {sending && <p className="text-xs text-bold-white/40">RecIA está digitando...</p>}
              </div>
              <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-white/10 p-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                  className="flex-1 rounded-full border border-white/10 bg-bold-black/40 px-4 py-2 text-sm text-bold-white outline-none placeholder:text-bold-white/35 focus:border-bold-yellow"
                />
                <button type="submit" aria-label="Enviar" className="rounded-full bg-bold-yellow p-2.5 text-bold-black">
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
