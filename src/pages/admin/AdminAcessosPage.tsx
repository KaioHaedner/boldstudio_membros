import { useEffect, useState } from 'react'
import { LogIn, LogOut, KeyRound, Search, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@/components/Loader'

interface AccessRow {
  id: string
  user_id: string | null
  email: string | null
  action: string
  user_agent: string | null
  created_at: string
}

function ActionBadge({ action }: { action: string }) {
  const map: Record<string, { icon: typeof LogIn; cls: string; label: string }> = {
    login: { icon: LogIn, cls: 'bg-green-500/15 text-green-300', label: 'Login' },
    logout: { icon: LogOut, cls: 'bg-bold-white/10 text-bold-white/60', label: 'Logout' },
    password_reset: { icon: KeyRound, cls: 'bg-bold-yellow/15 text-bold-yellow', label: 'Reset senha' },
  }
  const m = map[action] ?? { icon: Activity, cls: 'bg-bold-white/10 text-bold-white/60', label: action }
  const Icon = m.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${m.cls}`}>
      <Icon size={10} /> {m.label}
    </span>
  )
}

export function AdminAcessosPage() {
  const [rows, setRows] = useState<AccessRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('access_log')
        .select('id, user_id, email, action, user_agent, created_at')
        .order('created_at', { ascending: false })
        .limit(500)
      setRows((data as AccessRow[]) ?? [])
      setLoading(false)
    })()
  }, [])

  const filtered = rows.filter((r) => {
    if (!search.trim()) return true
    const s = search.toLowerCase()
    return (r.email ?? '').toLowerCase().includes(s) || r.action.toLowerCase().includes(s)
  })

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest">Auditoria</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">Histórico de Acessos</h1>
        <p className="mt-2 text-sm text-bold-white/60">{rows.length} eventos registrados (últimos 500)</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bold-white/40" size={14} />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por e-mail ou ação..."
          className="w-full rounded-md bg-bold-gray/60 border border-bold-white/10 pl-9 pr-3 py-2 text-sm placeholder-bold-white/40 focus:outline-none focus:border-bold-yellow"
        />
      </div>

      {loading ? (
        <Loader label="Carregando acessos..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 p-8 text-center text-sm text-bold-white/60">
          {search ? 'Nenhum acesso para essa busca.' : 'Nenhum acesso registrado ainda.'}
        </div>
      ) : (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 divide-y divide-bold-white/10">
          {filtered.map((r) => (
            <div key={r.id} className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <ActionBadge action={r.action} />
                <span className="text-sm truncate">{r.email || '(sem e-mail)'}</span>
              </div>
              <span className="text-[11px] text-bold-white/40 shrink-0">
                {new Date(r.created_at).toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
