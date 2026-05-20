import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Loader2, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@/components/Loader'
import type { Lesson } from '@/hooks/useLessons'
import type { Module } from '@/hooks/useModules'

export function AdminModuloEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [modulo, setModulo] = useState<Module | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    if (!id) return
    setLoading(true)
    const [{ data: mod }, { data: aulas }] = await Promise.all([
      supabase
        .from('modules')
        .select('id, title, description, cover_url, display_order, active')
        .eq('id', id)
        .maybeSingle(),
      supabase
        .from('lessons')
        .select('id, module_id, title, description, panda_video_id, materials, display_order, duration_sec, active')
        .eq('module_id', id)
        .order('display_order', { ascending: true }),
    ])
    setModulo(mod as Module | null)
    setLessons((aulas ?? []) as Lesson[])
    if (mod) {
      const m = mod as Module
      setTitle(m.title)
      setDescription(m.description ?? '')
      setCoverUrl(m.cover_url ?? '')
      setDisplayOrder(m.display_order)
      setActive(m.active)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError(null)
    setSaved(false)
    const { error: updErr } = await supabase
      .from('modules')
      .update({
        title: title.trim(),
        description: description.trim() || null,
        cover_url: coverUrl.trim() || null,
        display_order: displayOrder,
        active,
      })
      .eq('id', id)
    setSaving(false)
    if (updErr) {
      setError(updErr.message)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    load()
  }

  async function handleDelete() {
    if (!id) return
    if (!confirm(`Excluir modulo "${title}"? TUDO sera apagado (aulas, progresso dos alunos, comentarios).`)) return
    await supabase.from('modules').delete().eq('id', id)
    navigate('/admin/modulos')
  }

  if (loading) return <Loader label="Carregando..." />
  if (!modulo) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Modulo nao encontrado</h1>
        <Link to="/admin/modulos" className="mt-4 inline-block text-bold-yellow hover:underline">
          Voltar
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/modulos" className="inline-flex items-center gap-1 text-xs text-bold-white/60 hover:text-bold-yellow">
        <ArrowLeft size={12} /> Todos os modulos
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-bold-white/10 bg-bold-gray/40 p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-bold-yellow">Dados do modulo</h2>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <Field label="Titulo" value={title} onChange={setTitle} required className="sm:col-span-5" />
          <Field label="Ordem" type="number" value={String(displayOrder)} onChange={(v) => setDisplayOrder(Number(v) || 0)} className="sm:col-span-1" />
          <TextArea label="Descricao" value={description} onChange={setDescription} className="sm:col-span-6" />
          <Field label="URL da capa" value={coverUrl} onChange={setCoverUrl} placeholder="https://..." className="sm:col-span-5" />
          <label className="sm:col-span-1 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-bold-white/60">Ativo</span>
            <button
              type="button"
              onClick={() => setActive((a) => !a)}
              className={`mt-1 px-3 py-2 rounded-md text-sm font-semibold transition ${
                active ? 'bg-bold-yellow text-bold-black' : 'bg-bold-white/5 text-bold-white/60'
              }`}
            >
              {active ? 'Ativo' : 'Inativo'}
            </button>
          </label>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-2.5">{error}</p>
        )}
        {saved && (
          <p className="flex items-center gap-2 text-xs text-bold-yellow">
            <CheckCircle2 size={14} /> Salvo
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-bold-white/10">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-400 transition"
          >
            <Trash2 size={12} /> Excluir modulo
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-bold-yellow text-bold-black text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {saving && <Loader2 className="animate-spin" size={14} />}
            Salvar
          </button>
        </div>
      </form>

      {/* AULAS DO MODULO */}
      <section className="space-y-3">
        <header className="flex items-end justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-bold-yellow">Aulas</h2>
          <NovaAulaButton moduloId={modulo.id} nextOrder={(lessons.at(-1)?.display_order ?? 0) + 1} onCreated={load} />
        </header>

        {lessons.length === 0 ? (
          <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 p-6 text-center text-xs text-bold-white/60">
            Nenhuma aula. Clique em "Nova aula" pra comecar.
          </div>
        ) : (
          <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 divide-y divide-bold-white/10">
            {lessons.map((l) => (
              <Link
                key={l.id}
                to={`/admin/aulas/${l.id}`}
                className="flex items-center gap-3 p-3 hover:bg-bold-white/[0.02] transition"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-bold-black text-xs font-bold text-bold-yellow shrink-0">
                  {l.display_order}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{l.title}</p>
                  {l.description && (
                    <p className="text-xs text-bold-white/50 truncate">{l.description}</p>
                  )}
                </div>
                {!l.active && (
                  <span className="text-[10px] uppercase tracking-wider text-bold-white/40">inativo</span>
                )}
                {l.panda_video_id ? (
                  <span className="text-[10px] uppercase tracking-wider text-green-400">video</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-amber-400">sem video</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function NovaAulaButton({
  moduloId,
  nextOrder,
  onCreated,
}: {
  moduloId: string
  nextOrder: number
  onCreated: () => void
}) {
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function create() {
    setBusy(true)
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        module_id: moduloId,
        title: `Aula ${nextOrder}`,
        display_order: nextOrder,
        active: false,
        materials: [],
      })
      .select('id')
      .maybeSingle()
    setBusy(false)
    if (error || !data) {
      alert(error?.message ?? 'Erro ao criar aula')
      return
    }
    onCreated()
    navigate(`/admin/aulas/${data.id}`)
  }

  return (
    <button
      type="button"
      onClick={create}
      disabled={busy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-bold-yellow text-bold-black text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition"
    >
      {busy ? <Loader2 className="animate-spin" size={12} /> : <Plus size={12} />}
      Nova aula
    </button>
  )
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
  className,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
  className?: string
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="text-[10px] uppercase tracking-wider text-bold-white/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md bg-bold-black border border-bold-white/15 px-2.5 py-2 text-sm text-bold-white placeholder-bold-white/30 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="text-[10px] uppercase tracking-wider text-bold-white/60">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-md bg-bold-black border border-bold-white/15 px-2.5 py-2 text-sm text-bold-white placeholder-bold-white/30 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow resize-y"
      />
    </label>
  )
}
