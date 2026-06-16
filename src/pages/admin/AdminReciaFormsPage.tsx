import { useEffect, useState } from 'react'
import { Mail, MapPin, MessageCircle, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@/components/Loader'
import { useToast } from '@/components/Toast'

type LeadStatus = 'novo' | 'em_contato' | 'convertido' | 'descartado'

interface ReciaLeadRow {
  id: string
  nome: string
  whatsapp: string
  email: string
  cidade: string | null
  status: LeadStatus
  source: string
  created_at: string
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'novo', label: 'Novo' },
  { value: 'em_contato', label: 'Em contato' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'descartado', label: 'Descartado' },
]

const STATUS_STYLE: Record<LeadStatus, string> = {
  novo: 'bg-bold-yellow/20 text-bold-yellow',
  em_contato: 'bg-blue-500/20 text-blue-300',
  convertido: 'bg-green-500/20 text-green-300',
  descartado: 'bg-bold-white/10 text-bold-white/50',
}

export function AdminReciaFormsPage() {
  const [leads, setLeads] = useState<ReciaLeadRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Nao chama setLoading(true) aqui: o estado ja inicia true (primeira carga) e
  // os refreshes (mudanca de status) atualizam a lista sem piscar o loader.
  const load = async () => {
    const { data } = await supabase
      .from('recia_leads')
      .select('id, nome, whatsapp, email, cidade, status, source, created_at')
      .order('created_at', { ascending: false })
    setLeads((data as ReciaLeadRow[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = leads.filter((l) => {
    if (!search.trim()) return true
    const s = search.toLowerCase()
    return (
      l.nome.toLowerCase().includes(s) ||
      l.whatsapp.includes(s) ||
      l.email.toLowerCase().includes(s) ||
      (l.cidade ?? '').toLowerCase().includes(s)
    )
  })

  const novos = leads.filter((l) => l.status === 'novo').length

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest">RecIA</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">RecIA Forms</h1>
        <p className="mt-2 text-sm text-bold-white/60">
          {leads.length} {leads.length === 1 ? 'lead capturado' : 'leads capturados'} • {novos}{' '}
          {novos === 1 ? 'novo' : 'novos'}
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bold-white/40" size={14} />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, whatsapp, e-mail ou cidade..."
          className="w-full rounded-md bg-bold-gray/60 border border-bold-white/10 pl-9 pr-3 py-2 text-sm placeholder-bold-white/40 focus:outline-none focus:border-bold-yellow"
        />
      </div>

      {loading ? (
        <Loader label="Carregando leads da RecIA..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 p-8 text-center text-sm text-bold-white/60">
          {search ? 'Nenhum resultado para essa busca.' : 'Nenhum lead capturado pela RecIA ainda.'}
        </div>
      ) : (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 divide-y divide-bold-white/10">
          {filtered.map((lead) => (
            <ReciaLeadItem key={lead.id} lead={lead} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  )
}

function ReciaLeadItem({ lead, onChanged }: { lead: ReciaLeadRow; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  async function changeStatus(status: LeadStatus) {
    setBusy(true)
    const { error } = await supabase.from('recia_leads').update({ status }).eq('id', lead.id)
    setBusy(false)
    if (error) {
      toast.error('Falha ao atualizar status', error.message)
      return
    }
    toast.success('Status atualizado', `${lead.nome} → ${status}`)
    onChanged()
  }

  const waNumber = lead.whatsapp.replace(/\D/g, '')

  return (
    <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm truncate">{lead.nome}</p>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${STATUS_STYLE[lead.status]}`}
          >
            {STATUS_OPTIONS.find((s) => s.value === lead.status)?.label ?? lead.status}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-bold-white/55">
          <span className="inline-flex items-center gap-1">
            <MessageCircle size={11} /> {lead.whatsapp}
          </span>
          <span className="inline-flex items-center gap-1">
            <Mail size={11} /> {lead.email}
          </span>
          {lead.cidade && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} /> {lead.cidade}
            </span>
          )}
          <span>{formatDate(lead.created_at)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {waNumber && (
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-green-500/10 text-green-300 border border-green-500/30 text-xs hover:bg-green-500/20 transition"
          >
            <MessageCircle size={11} /> WhatsApp
          </a>
        )}
        <select
          value={lead.status}
          disabled={busy}
          onChange={(e) => changeStatus(e.target.value as LeadStatus)}
          className="rounded-md bg-bold-black/60 border border-bold-white/10 px-2 py-1.5 text-xs text-bold-white focus:outline-none focus:border-bold-yellow disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return iso.slice(0, 10)
  }
}
