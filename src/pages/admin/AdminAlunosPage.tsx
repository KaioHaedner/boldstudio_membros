import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Search, ShieldCheck, UserCheck, UserMinus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@/components/Loader'
import { useToast } from '@/components/Toast'

interface AlunoRow {
  id: string
  full_name: string | null
  role: 'student' | 'admin' | 'instructor'
  whatsapp: string
  created_at: string
  email: string | null
  has_purchase: boolean
}

export function AdminAlunosPage() {
  const [alunos, setAlunos] = useState<AlunoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    // Junta profiles com purchases aprovadas (subquery) e auth.users (via view ou pega email separado)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, role, whatsapp, created_at')
      .order('created_at', { ascending: false })

    const { data: purchases } = await supabase
      .from('purchases')
      .select('user_id')
      .eq('status', 'approved')

    const purchasedSet = new Set((purchases ?? []).map((p) => p.user_id))

    // Buscar emails via auth.users seria ideal, mas RLS bloqueia.
    // Como admin tem acesso via service_role, mas frontend usa anon. Workaround:
    // Mostrar so o que profiles tem + flag de compra.
    const rows: AlunoRow[] = (profiles ?? []).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      role: p.role,
      whatsapp: p.whatsapp,
      created_at: p.created_at,
      email: null, // sem email no front (privacidade + restrição RLS)
      has_purchase: purchasedSet.has(p.id),
    }))

    setAlunos(rows)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = alunos.filter((a) => {
    if (!search.trim()) return true
    const s = search.toLowerCase()
    return (
      (a.full_name ?? '').toLowerCase().includes(s) ||
      (a.whatsapp ?? '').includes(s) ||
      a.id.toLowerCase().includes(s)
    )
  })

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest">Acesso</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">Alunos</h1>
        <p className="mt-2 text-sm text-bold-white/60">
          {alunos.length} cadastrados • {alunos.filter((a) => a.has_purchase).length} com compra aprovada
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bold-white/40" size={14} />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, whatsapp ou ID..."
          className="w-full rounded-md bg-bold-gray/60 border border-bold-white/10 pl-9 pr-3 py-2 text-sm placeholder-bold-white/40 focus:outline-none focus:border-bold-yellow"
        />
      </div>

      {loading ? (
        <Loader label="Carregando alunos..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 p-8 text-center text-sm text-bold-white/60">
          {search ? 'Nenhum resultado para essa busca.' : 'Nenhum aluno cadastrado ainda.'}
        </div>
      ) : (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 divide-y divide-bold-white/10">
          {filtered.map((a) => (
            <AlunoRowItem key={a.id} aluno={a} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  )
}

function AlunoRowItem({ aluno, onChanged }: { aluno: AlunoRow; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const toast = useToast()

  async function liberarAcesso() {
    setBusy(true)
    const { error } = await supabase.from('purchases').insert({
      user_id: aluno.id,
      gateway: 'manual',
      transaction_id: `manual-${Date.now()}`,
      amount_cents: 0,
      currency: 'BRL',
      status: 'approved',
      granted_at: new Date().toISOString(),
    })
    setBusy(false)
    if (error) {
      setFeedback(`erro: ${error.message}`)
      toast.error('Falha ao liberar acesso', error.message)
      setTimeout(() => setFeedback(null), 3500)
      return
    }
    setFeedback('acesso liberado')
    toast.success('Acesso liberado', `${aluno.full_name || 'Aluno'} agora tem acesso ao curso.`)
    setTimeout(() => setFeedback(null), 2000)
    onChanged()
  }

  async function toggleAdmin() {
    setBusy(true)
    const newRole = aluno.role === 'admin' ? 'student' : 'admin'
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', aluno.id)
    setBusy(false)
    if (error) {
      setFeedback(`erro: ${error.message}`)
      toast.error('Falha ao alterar papel', error.message)
      setTimeout(() => setFeedback(null), 3500)
      return
    }
    setFeedback(newRole === 'admin' ? 'promovido a admin' : 'voltou a student')
    toast.success(newRole === 'admin' ? 'Promovido a admin' : 'Rebaixado a aluno', aluno.full_name || undefined)
    setTimeout(() => setFeedback(null), 2000)
    onChanged()
  }

  return (
    <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm truncate">{aluno.full_name || '(sem nome)'}</p>
          {aluno.role === 'admin' && (
            <span className="px-1.5 py-0.5 rounded-full bg-bold-yellow/20 text-bold-yellow text-[9px] uppercase font-bold tracking-wider">
              admin
            </span>
          )}
          {aluno.has_purchase && (
            <span className="px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-300 text-[9px] uppercase font-bold tracking-wider">
              acesso
            </span>
          )}
        </div>
        <p className="text-[11px] text-bold-white/50 mt-0.5">
          {aluno.whatsapp || 'sem WhatsApp'} • desde {formatDate(aluno.created_at)} • <span className="font-mono">{aluno.id.slice(0, 8)}</span>
        </p>
        {feedback && (
          <p className={`text-[11px] mt-1 ${feedback.startsWith('erro') ? 'text-red-400' : 'text-bold-yellow'}`}>
            <CheckCircle2 size={10} className="inline mr-1" /> {feedback}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {!aluno.has_purchase && (
          <button
            type="button"
            onClick={liberarAcesso}
            disabled={busy}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-green-500/10 text-green-300 border border-green-500/30 text-xs hover:bg-green-500/20 disabled:opacity-50 transition"
          >
            {busy ? <Loader2 className="animate-spin" size={11} /> : <UserCheck size={11} />}
            Liberar acesso
          </button>
        )}
        <button
          type="button"
          onClick={toggleAdmin}
          disabled={busy}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-bold-yellow/10 text-bold-yellow border border-bold-yellow/30 text-xs hover:bg-bold-yellow/20 disabled:opacity-50 transition"
        >
          {aluno.role === 'admin' ? <UserMinus size={11} /> : <ShieldCheck size={11} />}
          {aluno.role === 'admin' ? 'Rebaixar' : 'Tornar admin'}
        </button>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR')
  } catch {
    return iso.slice(0, 10)
  }
}
