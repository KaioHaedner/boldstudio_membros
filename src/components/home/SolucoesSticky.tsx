import { useI18n } from '@/i18n/I18nContext'

// Seção "Soluções" (produtos). A área de produtos é um placeholder por enquanto
// (as imagens ainda não existem). No rodapé, uma etiqueta amarela (mesmo estilo
// do "BoldCrew") fica sticky e usa um gradiente vivo que se move continuamente.
export function SolucoesSticky() {
  const { t } = useI18n()

  return (
    <section id="servicos" className="relative scroll-mt-24">
      {/* Área dos produtos — placeholder até as imagens existirem */}
      <div className="flex h-[70vh] min-h-[560px] items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-bold-yellow">
            {t.servicos.eyebrow}
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-bold-white/20">
            {t.servicos.title}
          </p>
        </div>
      </div>

      {/* Etiqueta amarela sticky com gradiente vivo (estilo BoldCrew) */}
      <div className="pointer-events-none sticky bottom-6 z-10">
        <span className="live-yellow inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          {t.servicos.label}
        </span>
      </div>
    </section>
  )
}
