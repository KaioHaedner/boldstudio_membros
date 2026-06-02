import { useEffect, useState } from 'react'
import { ShieldCheck, Search, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@/components/Loader'

interface Row {
  id: string
  full_name: string | null
  whatsapp: string | null
  cpf: string | null
  address: string | null
  consentAt: string | null
}

export function AdminLgpdPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    ;(async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, whatsapp, cpf, address')
        .order('created_at', { ascending: false })
      const { data: consents } = await supabase
        .from('lgpd_consents')
        .select('user_id, created_at')
        .eq('accepted', true)
        .order('created_at', { ascending: false })
      const consentMap = new Map<string, string>()
      for (const c of consents ?? []) if (!consentMap.has(c.user_id)) consentMap.set(c.user_id, c.created_at)
      setRows(
        (profiles ?? []).map((p) => ({
          id: p.id,
          full_name: p.full_name,
          whatsapp: p.whatsapp,
          cpf: p.cpf,
          address: p.address,
          consentAt: consentMap.get(p.id) ?? null,
        }))
      )
      setLoading(false)
    })()
  }, [])

  const filtered = rows.filter((r) => !search.trim() || (r.full_name ?? '').toLowerCase().includes(search.toLowerCase()) || (r.cpf ?? '').includes(search))
  const comConsent = rows.filter((r) => r.consentAt).length

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest">Privacidade</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">LGPD e Dados</h1>
        <p className="mt-2 text-sm text-bold-white/60">{rows.length} alunos • {comConsent} com consentimento registrado</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bold-white/40" size={14} />
        <input
          type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou CPF..."
          className="w-full rounded-md bg-bold-gray/60 border border-bold-white/10 pl-9 pr-3 py-2 text-sm placeholder-bold-white/40 focus:outline-none focus:border-bold-yellow"
        />
      </div>

      {loading ? (
        <Loader label="Carregando dados..." />
      ) : (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 divide-y divide-bold-white/10">
          {filtered.map((r) => (
            <div key={r.id} className="p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm">{r.full_name || '(sem nome)'}</p>
                <p className="text-[11px] text-bold-white/50 mt-0.5">
                  {r.whatsapp || 'sem WhatsApp'} · CPF {r.cpf || '—'} {r.address ? `· ${r.address}` : ''}
                </p>
              </div>
              {r.consentAt ? (
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-green-300">
                  <CheckCircle2 size={12} /> {new Date(r.consentAt).toLocaleDateString('pt-BR')}
                </span>
              ) : (
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-amber-400">
                  <AlertCircle size={12} /> sem registro
                </span>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="p-8 text-center text-sm text-bold-white/60">Nenhum aluno encontrado.</p>}
        </div>
      )}
      <p className="text-xs text-bold-white/40 flex items-center gap-1.5">
        <ShieldCheck size={12} /> Dados pessoais protegidos por RLS. Consentimentos são registrados no onboarding/cadastro.
      </p>
    </div>
  )
}
