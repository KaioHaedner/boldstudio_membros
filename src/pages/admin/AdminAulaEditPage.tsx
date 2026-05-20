import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Loader2, Plus, Trash2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@/components/Loader'
import type { Lesson, LessonMaterial } from '@/hooks/useLessons'

export function AdminAulaEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [aula, setAula] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [pandaId, setPandaId] = useState('')
  const [durationMin, setDurationMin] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [active, setActive] = useState(false)
  const [materials, setMaterials] = useState<LessonMaterial[]>([])

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    supabase
      .from('lessons')
      .select('id, module_id, title, description, panda_video_id, materials, display_order, duration_sec, active')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return
        const l = data as Lesson | null
        setAula(l)
        if (l) {
          setTitle(l.title)
          setDescription(l.description ?? '')
          setPandaId(l.panda_video_id ?? '')
          setDurationMin(l.duration_sec ? String(Math.round(l.duration_sec / 60)) : '')
          setDisplayOrder(l.display_order)
          setActive(l.active)
          setMaterials(l.materials ?? [])
        }
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError(null)
    setSaved(false)
    const { error: updErr } = await supabase
      .from('lessons')
      .update({
        title: title.trim(),
        description: description.trim() || null,
        panda_video_id: pandaId.trim() || null,
        duration_sec: durationMin ? Math.round(Number(durationMin) * 60) : null,
        display_order: displayOrder,
        active,
        materials: materials.filter((m) => m.label.trim() && m.url.trim()),
      })
      .eq('id', id)
    setSaving(false)
    if (updErr) {
      setError(updErr.message)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleDelete() {
    if (!id || !aula) return
    if (!confirm(`Excluir aula "${title}"? Progresso e comentarios serao apagados.`)) return
    await supabase.from('lessons').delete().eq('id', id)
    navigate(`/admin/modulos/${aula.module_id}`)
  }

  function addMaterial() {
    setMaterials([...materials, { label: '', url: '' }])
  }
  function updateMaterial(i: number, patch: Partial<LessonMaterial>) {
    setMaterials(materials.map((m, idx) => (idx === i ? { ...m, ...patch } : m)))
  }
  function removeMaterial(i: number) {
    setMaterials(materials.filter((_, idx) => idx !== i))
  }

  if (loading) return <Loader label="Carregando..." />
  if (!aula) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Aula nao encontrada</h1>
        <Link to="/admin/modulos" className="mt-4 inline-block text-bold-yellow hover:underline">
          Voltar
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        to={`/admin/modulos/${aula.module_id}`}
        className="inline-flex items-center gap-1 text-xs text-bold-white/60 hover:text-bold-yellow"
      >
        <ArrowLeft size={12} /> Voltar ao modulo
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-bold-white/10 bg-bold-gray/40 p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-bold-yellow">Dados da aula</h2>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <Field label="Titulo" value={title} onChange={setTitle} required className="sm:col-span-5" />
          <Field label="Ordem" type="number" value={String(displayOrder)} onChange={(v) => setDisplayOrder(Number(v) || 0)} className="sm:col-span-1" />
          <TextArea label="Descricao" value={description} onChange={setDescription} className="sm:col-span-6" />
          <Field
            label="Panda Video ID"
            value={pandaId}
            onChange={setPandaId}
            placeholder="ex: 1234567890abcdef"
            className="sm:col-span-4"
          />
          <Field
            label="Duracao (min)"
            type="number"
            value={durationMin}
            onChange={setDurationMin}
            placeholder="ex: 12"
            className="sm:col-span-1"
          />
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

        {/* MATERIAIS */}
        <div className="pt-2 border-t border-bold-white/10">
          <div className="flex items-end justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-bold-yellow">
              Materiais ({materials.length})
            </span>
            <button
              type="button"
              onClick={addMaterial}
              className="inline-flex items-center gap-1 text-xs text-bold-white/60 hover:text-bold-yellow transition"
            >
              <Plus size={12} /> Adicionar material
            </button>
          </div>
          <div className="space-y-2">
            {materials.map((m, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Nome (ex: Slide PDF)"
                  value={m.label}
                  onChange={(e) => updateMaterial(i, { label: e.target.value })}
                  className="col-span-4 rounded-md bg-bold-black border border-bold-white/15 px-2 py-1.5 text-xs"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={m.url}
                  onChange={(e) => updateMaterial(i, { url: e.target.value })}
                  className="col-span-7 rounded-md bg-bold-black border border-bold-white/15 px-2 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeMaterial(i)}
                  className="col-span-1 text-red-400/80 hover:text-red-400 flex justify-center"
                  aria-label="Remover"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {materials.length === 0 && (
              <p className="text-[11px] text-bold-white/40">Nenhum material vinculado.</p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-2.5">{error}</p>
        )}
        {saved && (
          <p className="flex items-center gap-2 text-xs text-bold-yellow">
            <CheckCircle2 size={14} /> Aula salva
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-bold-white/10">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-400 transition"
          >
            <Trash2 size={12} /> Excluir aula
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
    </div>
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
        rows={2}
        className="mt-1 w-full rounded-md bg-bold-black border border-bold-white/15 px-2.5 py-2 text-sm text-bold-white placeholder-bold-white/30 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow resize-y"
      />
    </label>
  )
}
