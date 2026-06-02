import { Package, Film, Palette, FileText, Music, Sparkles } from 'lucide-react'

const CATEGORIAS = [
  { nome: 'LUTs & Presets', desc: 'Looks de cor prontos pra usar', icon: Palette },
  { nome: 'Templates de Edição', desc: 'Projetos base pra Premiere/Resolve', icon: Film },
  { nome: 'Trilhas & SFX', desc: 'Áudio liberado pros seus vídeos', icon: Music },
  { nome: 'Motion / Overlays', desc: 'Lower thirds, transições, elementos', icon: Sparkles },
  { nome: 'Contratos & Propostas', desc: 'Modelos pra fechar com clientes', icon: FileText },
]

export function ArsenalPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest flex items-center gap-1.5">
          <Package size={14} /> Arsenal
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1.5">Seu kit de produção</h1>
        <p className="mt-2 text-bold-white/60">Materiais prontos pra você produzir e vender mais rápido.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIAS.map((c) => (
          <div key={c.nome} className="rounded-2xl border border-bold-white/10 bg-bold-gray/40 p-5 hover:border-bold-yellow/40 transition">
            <div className="h-10 w-10 rounded-lg bg-bold-yellow/10 flex items-center justify-center text-bold-yellow mb-3">
              <c.icon size={20} />
            </div>
            <h3 className="font-semibold">{c.nome}</h3>
            <p className="text-sm text-bold-white/55 mt-1">{c.desc}</p>
            <span className="inline-block mt-3 text-[10px] uppercase tracking-widest text-bold-white/40 border border-bold-white/15 rounded-full px-2 py-0.5">
              Em breve
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-bold-white/40 text-center">
        Os materiais de cada aula também ficam disponíveis dentro da própria aula.
      </p>
    </div>
  )
}
