import { useEffect, useState } from 'react'
import { Check, Loader2, MessageSquare, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@/components/Loader'

interface CommentRow {
  id: string
  content: string
  approved: boolean
  created_at: string
  user_id: string
  lesson_id: string
  profile_name: string | null
  lesson_title: string | null
}

export function AdminComentariosPage() {
  const [items, setItems] = useState<CommentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'approved'>('pending')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .select(`
        id, content, approved, created_at, user_id, lesson_id,
        profiles:user_id (full_name),
        lessons:lesson_id (title)
      `)
      .eq('approved', tab === 'approved')
      .order('created_at', { ascending: false })
      .limit(100)

    const rows: CommentRow[] = (data ?? []).map((c: Record<string, unknown>) => ({
      id: c.id as string,
      content: c.content as string,
      approved: c.approved as boolean,
      created_at: c.created_at as string,
      user_id: c.user_id as string,
      lesson_id: c.lesson_id as string,
      profile_name: ((c.profiles as { full_name?: string } | null)?.full_name) ?? null,
      lesson_title: ((c.lessons as { title?: string } | null)?.title) ?? null,
    }))
    setItems(rows)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [tab])

  async function approve(id: string) {
    await supabase.from('comments').update({ approved: true }).eq('id', id)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Excluir este comentário?')) return
    await supabase.from('comments').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest">Moderação</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">Comentários</h1>
      </header>

      <div className="flex gap-2 border-b border-bold-white/10">
        <TabBtn active={tab === 'pending'} onClick={() => setTab('pending')}>
          Pendentes
        </TabBtn>
        <TabBtn active={tab === 'approved'} onClick={() => setTab('approved')}>
          Aprovados
        </TabBtn>
      </div>

      {loading ? (
        <Loader label="Carregando comentários..." />
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 p-8 text-center text-sm text-bold-white/60">
          <MessageSquare className="mx-auto mb-3 text-bold-white/30" size={32} />
          {tab === 'pending' ? 'Nenhum comentário pendente.' : 'Nenhum comentário aprovado ainda.'}
        </div>
      ) : (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 divide-y divide-bold-white/10">
          {items.map((c) => (
            <ComentarioRow key={c.id} c={c} onApprove={approve} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}

function ComentarioRow({
  c,
  onApprove,
  onRemove,
}: {
  c: CommentRow
  onApprove: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [busy, setBusy] = useState(false)

  async function handle(fn: () => Promise<void> | void) {
    setBusy(true)
    await fn()
    setBusy(false)
  }

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <p className="font-semibold text-bold-white truncate">
          {c.profile_name || '(aluno sem nome)'}
        </p>
        <p className="text-bold-white/40 shrink-0">{formatDate(c.created_at)}</p>
      </div>
      <p className="text-[11px] text-bold-yellow uppercase tracking-wider">
        Aula: {c.lesson_title || '(aula apagada)'}
      </p>
      <p className="text-sm text-bold-white/90 whitespace-pre-wrap">{c.content}</p>
      <div className="flex items-center gap-2 pt-1">
        {!c.approved && (
          <button
            type="button"
            disabled={busy}
            onClick={() => handle(() => onApprove(c.id))}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-green-500/10 text-green-300 border border-green-500/30 text-xs hover:bg-green-500/20 transition disabled:opacity-50"
          >
            {busy ? <Loader2 className="animate-spin" size={11} /> : <Check size={11} />}
            Aprovar
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => handle(() => onRemove(c.id))}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-300 border border-red-500/30 text-xs hover:bg-red-500/20 transition disabled:opacity-50"
        >
          <Trash2 size={11} />
          Excluir
        </button>
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${
        active
          ? 'border-bold-yellow text-bold-yellow'
          : 'border-transparent text-bold-white/50 hover:text-bold-white/80'
      }`}
    >
      {children}
    </button>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
  } catch {
    return iso.slice(0, 10)
  }
}
