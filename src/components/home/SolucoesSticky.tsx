import { useI18n } from '@/i18n/I18nContext'

// Seção "Soluções" (produtos). No rodapé, uma etiqueta amarela (mesmo estilo
// do "BoldCrew") fica sticky e usa um gradiente vivo que se move continuamente.
export function SolucoesSticky() {
  const { t } = useI18n()

  return (
    <section id="servicos" className="relative scroll-mt-24 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-bold-yellow">
          {t.servicos.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-black uppercase leading-[1.05] sm:text-5xl">
          {t.servicos.title}
        </h2>

        <div className="mt-14 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {t.servicos.produtos.map((produto, index) => (
            <div
              key={produto.nome}
              className="group relative overflow-hidden rounded-2xl border border-bold-yellow/15 bg-bold-gray/40 p-7 transition-colors duration-300 hover:border-bold-yellow/50"
            >
              <span className="text-sm font-black text-bold-yellow/40">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-xl font-extrabold uppercase tracking-tight text-bold-white">
                {produto.nome}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bold-white/70">
                {produto.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Etiqueta amarela sticky com gradiente vivo (estilo BoldCrew) */}
      <div className="pointer-events-none sticky bottom-6 z-10 mt-16">
        <span className="live-yellow inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          {t.servicos.label}
        </span>
      </div>
    </section>
  )
}
