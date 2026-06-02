import { Route, Lock, CheckCircle2, Circle } from 'lucide-react'

const ETAPAS = [
  { nome: 'Mentalidade e Mercado', desc: 'Como o audiovisual funciona e as carreiras possíveis', estado: 'feito' },
  { nome: 'Fundamentos Visuais', desc: 'Linguagem cinematográfica, composição, enquadramentos', estado: 'atual' },
  { nome: 'Equipamentos e Captação', desc: 'Câmeras, lentes, tríade de exposição, fluxo em campo', estado: 'travado' },
  { nome: 'Produção e Edição', desc: 'Direção, roteiro, montagem, ritmo, narrativa', estado: 'travado' },
  { nome: 'Áudio, Color e Motion', desc: 'Sound design, color grading, motion graphics', estado: 'travado' },
  { nome: 'Comercial e Produtora', desc: 'Vendas, gestão, escala — virar dono', estado: 'travado' },
]

export function RotaPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest flex items-center gap-1.5">
          <Route size={14} /> Rota
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1.5">Sua jornada na Bold</h1>
        <p className="mt-2 text-bold-white/60">O caminho recomendado, do primeiro take até abrir sua produtora.</p>
      </header>

      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-bold-white/15" />
        <div className="space-y-4">
          {ETAPAS.map((e) => {
            const done = e.estado === 'feito'
            const atual = e.estado === 'atual'
            const locked = e.estado === 'travado'
            return (
              <div key={e.nome} className="relative">
                <span className="absolute -left-[22px] top-1.5 bg-bold-black">
                  {done ? <CheckCircle2 className="text-green-400" size={18} /> : atual ? <Circle className="text-bold-yellow fill-bold-yellow/30" size={18} /> : <Lock className="text-bold-white/30" size={16} />}
                </span>
                <div className={`rounded-xl border p-4 ${atual ? 'border-bold-yellow/50 bg-bold-yellow/5' : locked ? 'border-bold-white/10 bg-bold-gray/20 opacity-70' : 'border-bold-white/10 bg-bold-gray/40'}`}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{e.nome}</h3>
                    {atual && <span className="text-[9px] uppercase font-bold tracking-wider bg-bold-yellow text-bold-black px-1.5 py-0.5 rounded-full">você está aqui</span>}
                  </div>
                  <p className="text-sm text-bold-white/55 mt-1">{e.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <p className="text-xs text-bold-white/40 text-center">Sua rota se personaliza conforme suas respostas no onboarding e seu progresso. (em evolução)</p>
    </div>
  )
}
