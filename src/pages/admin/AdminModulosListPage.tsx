import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, EyeOff, Loader2, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { type Module } from '@/hooks/useModules'
import { Loader } from '@/components/Loader'

export function AdminModulosListPage() {
  // Admin precisa ver TODOS modulos (inclusive inativos) — usa query direta
  const [modulos, setModulos] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('modules')
      .select('id, title, description, cover_url, display_order, active')
      .order('display_order', { ascending: true })
    setLoading(false)
    if (error) setError(error.message)
    else setModulos((data ?? []) as Module[])
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-xs text-bold-yellow uppercase tracking-widest">Conteudo</p>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">Modulos</h1>
        </div>
      </header>

      <CriarModuloForm onCreated={load} nextOrder={(modulos.at(-1)?.display_order ?? 0) + 1} />

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <Loader label="Carregando modulos..." />
      ) : modulos.length === 0 ? (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 p-8 text-center text-sm text-bold-white/60">
          Nenhum modulo criado ainda. Crie o primeiro acima.
        </div>
      ) : (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 divide-y divide-bold-white/10">
          {modulos.map((m) => (
            <ModuloRow key={m.id} modulo={m} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  )
}

function CriarModuloForm({ onCreated, nextOrder }: { onCreated: () => void; nextOrder: number }) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    setError(null)
    const { error: insErr } = await supabase.from('modules').insert({
      title: title.trim(),
      display_order: nextOrder,
      active: true,
    })
    setSubmitting(false)
    if (insErr) {
      setError(insErr.message)
      return
    }
    setTitle('')
    onCreated()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 rounded-lg border border-bold-yellow/30 bg-bold-yellow/5 p-3"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titulo do novo modulo"
        className="flex-1 rounded-md bg-bold-black border border-bold-white/15 px-3 py-2 text-sm placeholder-bold-white/30 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow"
        required
      />
      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-bold-yellow text-bold-black text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
      >
        {submitting ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
        Criar modulo
      </button>
      {error && <p className="text-xs text-red-400 mt-1 sm:basis-full">{error}</p>}
    </form>
  )
}

function ModuloRow({ modulo, onChanged }: { modulo: Module; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)

  async function toggleActive() {
    setBusy(true)
    await supabase.from('modules').update({ active: !modulo.active }).eq('id', modulo.id)
    setBusy(false)
    onChanged()
  }

  async function remove() {
    if (!confirm(`Excluir modulo "${modulo.title}"? Todas as aulas e progresso vinculados tambem serao apagados.`)) return
    setBusy(true)
    await supabase.from('modules').delete().eq('id', modulo.id)
    setBusy(false)
    onChanged()
  }

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-bold-white/[0.02] transition">
      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-bold-black text-xs font-bold text-bold-yellow shrink-0">
        {modulo.display_order}
      </span>

      <div className="flex-1 min-w-0">
        <Link
          to={`/admin/modulos/${modulo.id}`}
          className="font-semibold text-sm truncate block hover:text-bold-yellow transition"
        >
          {modulo.title}
        </Link>
        {modulo.description && (
          <p className="text-xs text-bold-white/50 truncate">{modulo.description}</p>
        )}
      </div>

      {!modulo.active && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bold-white/5 text-[10px] uppercase tracking-wider text-bold-white/50">
          <EyeOff size={10} /> inativo
        </span>
      )}

      <button
        type="button"
        onClick={toggleActive}
        disabled={busy}
        className="text-xs text-bold-white/60 hover:text-bold-yellow px-2 py-1 transition disabled:opacity-50"
      >
        {modulo.active ? 'Desativar' : 'Ativar'}
      </button>

      <Link
        to={`/admin/modulos/${modulo.id}`}
        className="inline-flex items-center gap-1 text-xs text-bold-yellow px-2 py-1 hover:underline"
      >
        Editar <ArrowRight size={12} />
      </Link>

      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="text-red-400/80 hover:text-red-400 p-1 transition disabled:opacity-50"
        aria-label="Excluir"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
