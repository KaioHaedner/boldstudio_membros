import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, PlayCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@/components/Loader'

interface ModuleRow {
  id: string
  title: string
  description: string | null
  cover_url: string | null
}

const FORMACOES = [
  { nome: 'Equipe Bold', desc: 'A base pra entrar no mercado pela Bold', cor: 'border-bold-yellow/40' },
  { nome: 'Bold Professional', desc: 'Captação e edição em nível sênior', cor: 'border-bold-white/15' },
  { nome: 'Dono de Produtora', desc: 'Construa e escale seu negócio', cor: 'border-bold-white/15' },
]

export function TrilhasPage() {
  const [modules, setModules] = useState<ModuleRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('modules')
        .select('id, title, description, cover_url')
        .eq('active', true)
        .order('display_order')
      setModules((data as ModuleRow[]) ?? [])
      setLoading(false)
    })()
  }, [])

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest flex items-center gap-1.5">
          <GraduationCap size={14} /> Trilhas
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1.5">Suas formações</h1>
        <p className="mt-2 text-bold-white/60">Do básico ao dono de produtora. Escolha por onde avançar.</p>
      </header>

      {/* As 3 formacoes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FORMACOES.map((f, i) => (
          <div key={f.nome} className={`rounded-2xl border ${f.cor} bg-bold-gray/40 p-5`}>
            <span className="text-[10px] uppercase tracking-widest text-bold-white/40">Formação {i + 1}</span>
            <h3 className="text-lg font-bold mt-1 text-bold-yellow">{f.nome}</h3>
            <p className="text-sm text-bold-white/60 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Modulos */}
      <div>
        <h2 className="text-xl font-bold mb-4">Módulos</h2>
        {loading ? (
          <Loader label="Carregando módulos..." />
        ) : modules.length === 0 ? (
          <div className="rounded-xl border border-bold-white/10 bg-bold-gray/40 p-8 text-center text-sm text-bold-white/60">
            Os módulos aparecem aqui assim que forem publicados.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => (
              <Link
                key={m.id}
                to={`/modulo/${m.id}`}
                className="group rounded-2xl border border-bold-white/10 bg-bold-gray/40 overflow-hidden hover:border-bold-yellow/50 transition"
              >
                <div className="aspect-video bg-bold-black/60 relative overflow-hidden">
                  {m.cover_url ? (
                    <img src={m.cover_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-bold-white/20">
                      <PlayCircle size={40} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-bold-yellow transition">{m.title}</h3>
                  {m.description && <p className="text-xs text-bold-white/50 mt-1 line-clamp-2">{m.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
