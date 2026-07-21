import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Phone, Play, Video, X } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { ShinyButton } from '@/components/ShinyButton'
import { CoinDecor } from '@/components/home/CoinDecor'
import { useI18n } from '@/i18n/I18nContext'
import { CLIENTES, type Cliente } from '@/data/clientes'

// Duas pistas editoriais movidas em sentidos opostos pelo scroll. A lista e
// duplicada apenas para continuidade visual; a segunda copia fica fora da
// arvore de acessibilidade. Modal e paginas de projeto permanecem os mesmos.

const CLIENT_ROWS = [
  CLIENTES.filter((_, index) => index % 2 === 0),
  CLIENTES.filter((_, index) => index % 2 !== 0),
] as const

export function ClientesWave() {
  const { t } = useI18n()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<Cliente | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const topTrack = wrap.querySelector<HTMLElement>('.clients-track--top')
    const bottomTrack = wrap.querySelector<HTMLElement>('.clients-track--bottom')
    if (!topTrack || !bottomTrack) return

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 1.8, 1200)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      timeline.to(topTrack, { x: () => -topTrack.scrollWidth / 2, ease: 'none' }, 0)
      timeline.fromTo(
        bottomTrack,
        { x: () => -bottomTrack.scrollWidth / 2 },
        { x: 0, ease: 'none' },
        0
      )
    })

    return () => {
      media.revert()
    }
  }, [])

  return (
    <section id="clientes" className="clientes-wave relative scroll-mt-24 overflow-hidden">
      <CoinDecor className="right-8 top-24 w-16 opacity-15 sm:w-24" rotate={18} floatDuration={7} />
      <CoinDecor className="left-4 bottom-32 hidden w-14 opacity-[0.12] lg:block" rotate={-20} floatDuration={9} />
      <div className="px-6 pt-24 pb-4 text-center">
        <p className="text-xs font-bold tracking-wider text-bold-yellow">{t.clientes.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t.clientes.title}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-bold-white/60">{t.clientes.helper}</p>
      </div>

      <div ref={wrapRef} className="clients-stage">
        {CLIENT_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="clients-rail">
            <div className={`clients-track clients-track--${rowIndex === 0 ? 'top' : 'bottom'}`}>
              {[0, 1].map((copyIndex) =>
                row.map((client) => {
                  const isCopy = copyIndex === 1
                  return (
                    <div
                      key={`${client.slug}-${copyIndex}`}
                      className="client-logo-card"
                      role={isCopy ? undefined : 'button'}
                      tabIndex={isCopy ? -1 : 0}
                      aria-hidden={isCopy || undefined}
                      aria-label={isCopy ? undefined : `Ver detalhes de ${client.nome}`}
                      onClick={() => setSelected(client)}
                      onKeyDown={(event) => {
                        if (!isCopy && (event.key === 'Enter' || event.key === ' ')) {
                          event.preventDefault()
                          setSelected(client)
                        }
                      }}
                    >
                      <img src={client.logo} alt={isCopy ? '' : client.nome} loading="lazy" decoding="async" />
                    </div>
                  )
                })
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-5 px-6 pb-24 pt-2 text-center">
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
            className="relative w-full max-w-md rounded-xl border border-bold-yellow/20 bg-bold-gray p-6 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-10 text-bold-white/60 transition-colors hover:text-bold-white"
            >
              <X size={20} />
            </button>

            {/* Preview animado em loop cortado em 10s. Placeholder ate ter o real. */}
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-bold-black/50">
              {selected.videos[0] ? (
                <video
                  src={selected.videos[0]}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onTimeUpdate={(e) => {
                    // corta o preview nos primeiros 10s, em loop
                    if (e.currentTarget.currentTime >= 10) e.currentTarget.currentTime = 0
                  }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-bold-white/40">
                  <Play size={30} className="text-bold-yellow/70" />
                  <span className="text-xs">{t.clientes.previewSoon}</span>
                </div>
              )}
            </div>

            <h3 className="mt-5 text-xl font-bold text-bold-white">{selected.nome}</h3>

            {(selected.area || selected.telefone) && (
              <div className="mt-3 flex flex-col items-center gap-2 text-sm text-bold-white/80">
                {selected.area && (
                  <p className="flex items-center justify-center gap-2">
                    <MapPin size={16} className="shrink-0 text-bold-yellow" /> {selected.area}
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
              <Link
                to={`/projeto-${selected.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-bold-yellow px-5 py-2.5 text-sm font-bold text-bold-black transition-transform hover:scale-[1.02]"
              >
                {t.clientes.viewProject} <ArrowRight size={16} />
              </Link>
              {selected.videos[0] && (
                <a
                  href={selected.videos[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-bold text-bold-white transition-colors hover:border-bold-yellow/60 hover:text-bold-yellow"
                >
                  <Video size={16} /> {t.clientes.watchCase}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
