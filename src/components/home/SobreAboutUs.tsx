import { Fragment, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useI18n } from '@/i18n/I18nContext'
import { CoinDecor } from '@/components/home/CoinDecor'

const CREW_IMG =
  'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/Fotos_CREW_COLORIDAS/BOLDSTUDIO_CREW_ABOUTUS.webp'

// Destaca em amarelo os trechos marcados com **...** no texto das traduções.
function renderHighlighted(text: string) {
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

// Mancha branca irregular (respingo estilo Nickelodeon) atrás da foto do crew.
function SplatBlob() {
  return (
    <svg
      viewBox="0 0 220 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-0 -z-10 h-full w-full drop-shadow-[0_20px_60px_rgba(255,255,255,0.12)]"
    >
      <g fill="#ffffff">
        <path d="M96,14 C132,6 154,26 160,52 C165,74 186,72 194,96 C203,122 182,136 180,158 C178,182 150,194 122,186 C100,180 92,198 64,192 C36,186 20,170 20,142 C20,120 6,112 10,86 C14,58 30,52 40,34 C52,14 66,22 96,14 Z" />
        {/* gota arrastada / puxada */}
        <path d="M188,150 C200,150 208,160 205,172 C202,183 190,185 184,178 C178,171 176,150 188,150 Z" />
        {/* respingos */}
        <circle cx="204" cy="60" r="9" />
        <circle cx="30" cy="176" r="6" />
        <circle cx="196" cy="118" r="4" />
      </g>
    </svg>
  )
}

// Seção "Sobre" no estilo Sand: foto do crew (com "ABOUT US" embutido) sobre uma
// mancha branca irregular, em parallax; ao lado, o texto em parágrafos bold que
// surgem do nada conforme o scroll chega em cada um.
export function SobreAboutUs() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      if (imgRef.current) {
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
      className="relative scroll-mt-24 overflow-hidden px-5 py-24 sm:px-8 md:py-32 lg:px-12"
    >
      <CoinDecor className="right-6 top-10 w-16 opacity-15 sm:w-24 lg:right-16" rotate={20} floatDuration={7.5} />
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        {/* Foto do crew sobre mancha branca irregular (parallax) */}
        <div className="relative flex items-center justify-center">
          <SplatBlob />
          <img
            ref={imgRef}
            src={CREW_IMG}
            alt="Equipe da BoldStudio — About Us"
            loading="lazy"
            className="relative w-full max-w-lg will-change-transform"
          />
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
