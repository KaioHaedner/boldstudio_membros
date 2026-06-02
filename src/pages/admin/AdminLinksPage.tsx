import { useEffect, useState } from 'react'
import { LinkIcon, Plus, Copy, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/Toast'
import { Loader } from '@/components/Loader'

interface LinkRow {
  id: string
  token: string
  label: string | null
  role_granted: string
  used_count: number
  max_uses: number
  created_at: string
}

const BASE: Record<string, string> = {
  student: 'https://academy.boldstudiobrasil.com/cadastro',
  crew: 'https://crew.boldstudiobrasil.com/cadastro',
  admin: 'https://admin.boldstudiobrasil.com/cadastro',
}

export function AdminLinksPage() {
  const { user } = useAuth()
  const toast = useToast()
  const [rows, setRows] = useState<LinkRow[]>([])
  const [loading, setLoading] = useState(true)
  const [label, setLabel] = useState('')
  const [role, setRole] = useState('student')
  const [gerando, setGerando] = useState(false)

  const load = async () => {
    const { data } = await supabase
      .from('access_links')
      .select('id, token, label, role_granted, used_count, max_uses, created_at')
      .order('created_at', { ascending: false })
    setRows((data as LinkRow[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function gerar() {
    setGerando(true)
    const token = crypto.randomUUID().replace(/-/g, '')
    const { error } = await supabase.from('access_links').insert({
      token, label: label || null, role_granted: role, created_by: user?.id, max_uses: 1,
    })
    setGerando(false)
    if (error) { toast.error('Falha ao gerar link', error.message); return }
    toast.success('Link gerado', 'Copie e envie pra pessoa.')
    setLabel('')
    load()
  }

  function copiar(r: LinkRow) {
    const url = `${BASE[r.role_granted] ?? BASE.student}?invite=${r.token}`
    navigator.clipboard.writeText(url)
    toast.success('Link copiado', url)
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest">Acesso</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">Links de Acesso</h1>
        <p className="mt-2 text-sm text-bold-white/60">Gere links de convite pra alunos, equipe ou admins.</p>
      </header>

      <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 p-4 flex flex-col sm:flex-row gap-2">
        <input
          value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Rótulo (ex: Turma maio, parceiro X)"
          className="flex-1 rounded-md bg-bold-black border border-bold-white/15 px-3 py-2 text-sm focus:outline-none focus:border-bold-yellow"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-md bg-bold-black border border-bold-white/15 px-3 py-2 text-sm focus:outline-none focus:border-bold-yellow">
          <option value="student">Aluno</option>
          <option value="crew">Crew</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={gerar} disabled={gerando} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-bold-yellow text-bold-black text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition">
          {gerando ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Gerar link
        </button>
      </div>

      {loading ? (
        <Loader label="Carregando links..." />
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 p-8 text-center text-sm text-bold-white/60">Nenhum link gerado ainda.</div>
      ) : (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 divide-y divide-bold-white/10">
          {rows.map((r) => (
            <div key={r.id} className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <LinkIcon size={13} className="text-bold-yellow shrink-0" />
                  <p className="text-sm truncate">{r.label || '(sem rótulo)'}</p>
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-bold-white/10 px-1.5 py-0.5 rounded-full">{r.role_granted}</span>
                </div>
                <p className="text-[11px] text-bold-white/40 mt-0.5 font-mono truncate">{r.token.slice(0, 16)}… • usos {r.used_count}/{r.max_uses}</p>
              </div>
              <button onClick={() => copiar(r)} className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-bold-white/15 text-xs hover:border-bold-yellow hover:text-bold-yellow transition">
                <Copy size={12} /> Copiar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
