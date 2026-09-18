import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, MapPin, Phone, Play, X } from 'lucide-react'
import { ShinyButton } from '@/components/ShinyButton'
import { CoinDecor } from '@/components/home/CoinDecor'
import { useI18n } from '@/i18n/I18nContext'
import { CLIENTES, type Cliente } from '@/data/clientes'

function LogoTapHint({ label }: { label: string }) {
  return (
    <div className="clientes-tap-hint">
      <svg viewBox="0 0 190 76" aria-hidden="true">
        <path className="clientes-tap-hint__arrow" d="M12 43c25-30 67-31 104-8" />
        <path className="clientes-tap-hint__arrow" d="m106 25 11 10-14 5" />

        <rect className="clientes-tap-hint__target" x="126" y="9" width="56" height="56" rx="11" />
        <g className="clientes-tap-hint__target-logo">
          <circle cx="154" cy="37" r="11" />
          <path d="M154 26v7m9-2-6 4m6 8-7-3m-2 8v-7m-9 2 6-4m-6-8 7 3" />
        </g>

        <circle className="clientes-tap-hint__pulse" cx="154" cy="37" r="13" />
        <circle className="clientes-tap-hint__pulse clientes-tap-hint__pulse--two" cx="154" cy="37" r="13" />

        <g transform="translate(154 37)">
          <g className="clientes-tap-hint__pointer">
            <path d="M0 0v31l8-8 8 17 8-4-8-16h13z" />
          </g>
        </g>
      </svg>
      <p className="clientes-tap-hint__label">{label}</p>
    </div>
  )
}

// Carrossel contínuo (marquee) com TODAS as marcas atendidas. A lista é
// duplicada para o loop infinito; a segunda cópia fica fora da acessibilidade.
// Clicar num logo abre o modal com preview/depoimento e link pro projeto.
export function ClientesWave() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Cliente | null>(null)

  return (
    <section id="clientes" className="relative scroll-mt-24 overflow-hidden py-20 md:py-28">
      <CoinDecor className="right-8 top-10 w-16 opacity-15 sm:w-24" rotate={18} floatDuration={7} />
      <CoinDecor className="left-4 bottom-10 hidden w-14 opacity-[0.12] lg:block" rotate={-20} floatDuration={9} />

      <div className="px-6 text-center">
        <p className="text-[clamp(1.15rem,2.4vw,1.75rem)] font-black italic uppercase leading-none tracking-[-0.035em] text-bold-yellow">{t.clientes.eyebrow}</p>
        <h2 className="mx-auto mt-3 max-w-4xl text-[clamp(1.8rem,4vw,3.4rem)] font-black italic uppercase leading-[0.92] tracking-[-0.035em] text-bold-white">{t.clientes.title}</h2>
        <LogoTapHint label={t.clientes.helper} />
      </div>

      <div className="marcas-marquee-mask mt-12 flex overflow-hidden">
        <div className="marcas-marquee flex shrink-0">
          {[0, 1].map((copyIndex) =>
            CLIENTES.map((client) => {
              const isCopy = copyIndex === 1
              return (
                <button
                  key={`${client.slug}-${copyIndex}`}
                  type="button"
                  tabIndex={isCopy ? -1 : 0}
                  aria-hidden={isCopy || undefined}
                  aria-label={isCopy ? undefined : `Ver detalhes de ${client.nome}`}
                  onClick={() => setSelected(client)}
                  className="group mx-3 flex h-28 w-52 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white p-6 transition-transform hover:scale-[1.03] hover:border-bold-yellow/50 sm:h-32 sm:w-60"
                >
                  <img
                    src={client.logo}
                    alt={isCopy ? '' : client.nome}
                    loading="eager"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center gap-5 px-6 text-center">
        <p className="text-xl font-bold text-bold-white md:text-2xl">{t.clientes.ctaText}</p>
        <ShinyButton
          onClick={() =>
            document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        >
          {t.clientes.ctaButton}
        </ShinyButton>
      </div>

      {selected && (
        <div
          role="presentation"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes de ${selected.nome}`}
            className="clientes-detail-card relative w-full max-w-md text-center text-bold-black shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
              className="absolute -right-2 -top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#d8242f] text-white shadow-[0_8px_22px_rgba(216,36,47,0.38)] transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8242f]"
            >
              <X size={21} strokeWidth={3} />
            </button>

            <div className="clientes-detail-card__surface">
              <div className="aspect-video w-full overflow-hidden bg-[#858585]">
                {selected.videos[0] ? (
                  <video
                    src={selected.videos[0]}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onTimeUpdate={(e) => {
                      if (e.currentTarget.currentTime >= 10) e.currentTarget.currentTime = 0
                    }}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-bold-white/55">
                    <Play size={30} className="text-bold-yellow/90" />
                    <span className="text-xs">{t.clientes.previewSoon}</span>
                  </div>
                )}
              </div>

              <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                <h3 className="text-2xl font-black text-bold-black">{selected.nome}</h3>

                {(selected.area || selected.telefone) && (
                  <div className="mt-3 flex flex-col items-center gap-2 text-sm font-medium text-bold-black/70">
                    {selected.area && (
                      <p className="flex items-center justify-center gap-2 text-black">
                        <MapPin size={17} strokeWidth={2.5} className="shrink-0 text-[#EA4335]" />
                        <span>{selected.area}</span>
                      </p>
                    )}
                    {selected.telefone && (
                      <p className="flex items-center justify-center gap-2">
                        <Phone size={16} className="shrink-0 text-bold-yellow" /> {selected.telefone}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-6 flex flex-col items-stretch gap-2.5">
                  <ShinyButton
                    className="clientes-modal__project-cta"
                    onClick={() => {
                      setSelected(null)
                      navigate(`/projeto-${selected.slug}`)
                    }}
                  >
                    {t.clientes.viewProject} <ArrowRight size={16} />
                  </ShinyButton>
                  {selected.videos[0] && (
                    <a
                      href={selected.videos[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mx-auto inline-flex w-fit items-center justify-center gap-1.5 border-b border-bold-black/40 pb-0.5 text-sm font-bold text-bold-black transition-colors hover:border-bold-black hover:text-bold-black"
                    >
                      {t.clientes.watchCase}
                      <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
