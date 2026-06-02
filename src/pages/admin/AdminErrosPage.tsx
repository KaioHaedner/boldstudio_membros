import { useEffect, useState } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@/components/Loader'

interface ErrorRow {
  id: string
  message: string
  stack: string | null
  url: string | null
  user_agent: string | null
  created_at: string
}

export function AdminErrosPage() {
  const [rows, setRows] = useState<ErrorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('error_log')
        .select('id, message, stack, url, user_agent, created_at')
        .order('created_at', { ascending: false })
        .limit(300)
      setRows((data as ErrorRow[]) ?? [])
      setLoading(false)
    })()
  }, [])

  const filtered = rows.filter((r) => !search.trim() || (r.message + (r.url ?? '')).toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest">Sistema</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">Erros do Sistema</h1>
        <p className="mt-2 text-sm text-bold-white/60">{rows.length} eventos (últimos 300)</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bold-white/40" size={14} />
        <input
          type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por mensagem ou origem..."
          className="w-full rounded-md bg-bold-gray/60 border border-bold-white/10 pl-9 pr-3 py-2 text-sm placeholder-bold-white/40 focus:outline-none focus:border-bold-yellow"
        />
      </div>

      {loading ? (
        <Loader label="Carregando erros..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-8 text-center text-sm text-green-300">
          {search ? 'Nenhum erro pra essa busca.' : 'Nenhum erro registrado. Tudo limpo! ✅'}
        </div>
      ) : (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 divide-y divide-bold-white/10">
          {filtered.map((r) => (
            <div key={r.id} className="p-3.5">
              <button onClick={() => setOpen(open === r.id ? null : r.id)} className="w-full flex items-start justify-between gap-3 text-left">
                <div className="min-w-0">
                  <p className="text-sm text-red-300 truncate">{r.message}</p>
                  <p className="text-[11px] text-bold-white/40 mt-0.5">
                    {r.url ?? '—'} • {new Date(r.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                {r.stack && (open === r.id ? <ChevronUp size={16} className="shrink-0 text-bold-white/40" /> : <ChevronDown size={16} className="shrink-0 text-bold-white/40" />)}
              </button>
              {open === r.id && r.stack && (
                <pre className="mt-2 text-[11px] text-bold-white/50 bg-bold-black/60 rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-words max-h-60">{r.stack}</pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
