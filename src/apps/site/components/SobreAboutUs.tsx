import { Fragment, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/shared/lib/gsap'
import { useI18n } from '@/apps/site/i18n/I18nContext'
import { CoinDecor } from '@/apps/site/components/CoinDecor'
import { usePointerTilt } from '@/shared/hooks/usePointerTilt'

const CREW_IMG = '/media/backgrounds/boldstudio-quem-somos-1400-v2.webp'

// Destaca em amarelo os trechos marcados com **...** no texto das traduções.
export function renderHighlighted(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={index} className="text-bold-yellow">
          {part.slice(2, -2)}
        </span>
      )
    }
    return <Fragment key={index}>{part}</Fragment>
  })
}

// Foto do time em primeiro plano e fundo fornecido em P&B, com gradiente
// escuro para manter contraste durante a revelacao dos textos no scroll.
export function SobreAboutUs() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const photoRef = usePointerTilt()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      if (imgRef.current && matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
        gsap.fromTo(
          imgRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      // Cada parágrafo surge quando entra na tela e some quando sai — repete
      // toda vez que a seção passa pela viewport.
      const paras = section.querySelectorAll<HTMLElement>('[data-para]')
      paras.forEach((p) => {
        gsap.set(p, { autoAlpha: 0, y: 30 })
        const show = () => gsap.to(p, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
        const hide = () => gsap.to(p, { autoAlpha: 0, y: 30, duration: 0.5, ease: 'power2.in' })
        ScrollTrigger.create({
          trigger: p,
          start: 'top 85%',
          end: 'bottom 12%',
          onEnter: show,
          onEnterBack: show,
          onLeave: hide,
          onLeaveBack: hide,
        })
      })
    }, section)

    return () => ctx.revert()
  }, [t])

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="relative scroll-mt-24 overflow-hidden px-5 py-[var(--espaco-secao)] sm:px-8 lg:px-12"
    >
      <img src="/media/backgrounds/boldstudio-quem-somos-bg.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.3),rgba(0,0,0,.75)),linear-gradient(0deg,#000_0%,transparent_25%,transparent_75%,#000_100%)]" aria-hidden="true" />
      <CoinDecor className="right-6 top-10 w-16 opacity-15 sm:w-24 lg:right-16" rotate={20} floatDuration={7.5} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        {/* Foto do time em primeiro plano (parallax). */}
        <div className="relative flex items-center justify-center">
          <div ref={photoRef} className="about-photo">
          <div className="about-photo__tilt">
          <img
            ref={imgRef}
            src={CREW_IMG}
            srcSet="/media/backgrounds/boldstudio-quem-somos-700-v2.webp 700w, /media/backgrounds/boldstudio-quem-somos-1400-v2.webp 1400w"
            sizes="(min-width: 1200px) 560px, (min-width: 1024px) 48vw, (min-width: 640px) 560px, calc(100vw - 40px)"
            width={1400}
            height={933}
            alt="Equipe da BoldStudio — About Us"
            loading="lazy"
            decoding="async"
            className="relative w-full rounded-3xl"
          />
          </div>
          </div>
        </div>

        {/* Texto em parágrafos que surgem com o scroll */}
        <div className="lg:pl-2">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-bold-yellow md:text-sm">
            {t.sobre.eyebrow}
          </p>

          <div className="mt-8 space-y-7">
            {t.sobre.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                data-para
                className={
                  index === t.sobre.paragraphs.length - 1
                    ? 'text-2xl font-bold leading-snug text-bold-white md:text-3xl'
                    : 'text-xl font-bold leading-snug text-bold-white/90 md:text-2xl'
                }
              >
                {renderHighlighted(paragraph)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
