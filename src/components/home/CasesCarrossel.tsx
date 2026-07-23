import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '@/lib/gsap'
import { CLIENTES } from '@/data/clientes'
import { ShinyButton } from '@/components/ShinyButton'
import { useI18n } from '@/i18n/I18nContext'

// Só as marcas que têm vídeo demoreel entram no carrossel fullscreen.
const CASES = CLIENTES.filter((c) => c.videos.length > 0)

// Carrossel Blur Reveal: seção pinada onde cada case é um slide fullscreen
// (vídeo + título). A troca por scroll usa clip-path (recorte de baixo pra
// cima) + escala + blur progressivo, com o título surgindo desfocado -> nítido.
export function CasesCarrossel() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>('.case-slide')
      if (slides.length < 2) return

      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${(slides.length - 1) * 100}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        slides.forEach((slide, index) => {
          if (index === 0) return
          const mediaEl = slide.querySelector('.case-media')
          const caption = slide.querySelector('.case-caption')

          tl.fromTo(
            slide,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 },
            index
          )
          tl.fromTo(
            mediaEl,
            { scale: 1.25, filter: 'blur(26px)' },
            { scale: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 1 },
            index
          )
          tl.fromTo(
            caption,
            { autoAlpha: 0, y: 40, filter: 'blur(16px)' },
            { autoAlpha: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.6 },
            index + 0.35
          )
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="cases"
      className="relative h-screen overflow-hidden bg-bold-black"
    >
      {CASES.map((client, index) => (
        <article
          key={client.slug}
          className="case-slide absolute inset-0"
          style={{
            zIndex: index,
            clipPath: index === 0 ? undefined : 'inset(100% 0% 0% 0%)',
          }}
        >
          <video
            className="case-media absolute inset-0 h-full w-full object-cover"
            src={client.videos[0]}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/50" />

          <div className="absolute right-5 top-24 flex flex-col items-end gap-4 sm:right-10">
            <span
              aria-hidden="true"
              className="pointer-events-none text-[clamp(3.5rem,9vw,8rem)] font-black leading-none text-white/15"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <ShinyButton onClick={() => navigate(`/projeto-${client.slug}`)}>
              {t.clientes.viewProject}
            </ShinyButton>
          </div>

          <div className="case-caption absolute inset-x-5 bottom-[22%] sm:inset-x-12">
            <div className="flex items-center gap-4 sm:gap-5">
              <span className="flex h-14 shrink-0 items-center justify-center rounded-lg bg-white px-3 sm:h-20">
                <img
                  src={client.logo}
                  alt={client.nome}
                  loading="lazy"
                  className="h-full max-h-10 w-auto max-w-[110px] object-contain sm:max-h-14"
                />
              </span>
              <h3 className="max-w-3xl text-[clamp(1.8rem,4.5vw,3.8rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] text-bold-white">
                {client.nome}
              </h3>
            </div>
          </div>
        </article>
      ))}

      {/* Etiqueta "Cases" — fixa no rodapé durante todo o efeito (seção pinada) */}
      <div className="pointer-events-none absolute bottom-8 left-0 z-30">
        <span className="live-yellow inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          {t.cases.label}
        </span>
      </div>
    </section>
  )
}
