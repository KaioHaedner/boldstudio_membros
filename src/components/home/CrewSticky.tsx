import { useEffect, useRef } from 'react'
import { User } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ShinyButton } from '@/components/ShinyButton'
import { useI18n } from '@/i18n/I18nContext'

// Efeito "Sticky Cards" (GSAP ScrollTrigger) portado para a secao Crew.
// Cards empilhados que saem um a um conforme o scroll. Cargo e descricao vem
// das traducoes (t.crew.members[id]); aqui ficam so nome e foto (idiomaagnostico).
// Uma unica foto colorida por membro evita baixar duas imagens do Supabase para
// cada card e reduz o tempo de carregamento da home.
const COLOR_BASE = 'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/Fotos_CREW_COLORIDAS/'

const CREW = [
  { id: 'pedro-garcia', nome: 'Pedro Garcia Jr.', color: `${COLOR_BASE}PEDRAO_BOLD_IMG_CREW.png` },
  { id: 'miguel', nome: 'Miguel Souza', color: `${COLOR_BASE}MIGUEL_BOLD_IMG_CREW.png` },
  { id: 'bruno', nome: 'Bruno Cavedon', color: `${COLOR_BASE}CAVEDON_BOLD_IMG_CREW.png` },
  { id: 'william', nome: 'William Ferruda', color: `${COLOR_BASE}IMG_1088.JPG%201.png` },
  { id: 'rafaela', nome: 'Rafaela Souza', color: `${COLOR_BASE}RAFAELA_BOLD_IMG_CREW.png` },
  { id: 'nathalia', nome: 'Nathalia Umburanas' },
  { id: 'caroline', nome: 'Caroline Ventura', color: `${COLOR_BASE}MULHER_MIGUEL_BOLD_IMG_CREW.png` },
  { id: 'germano', nome: 'Germano Pagliari', color: `${COLOR_BASE}GERMANO_BOLD_IMG_CREW.png` },
  { id: 'pedro-neto', nome: 'Pedro Garcia Neto', color: `${COLOR_BASE}juninho_BOLD_IMG_CREW.png` },
] as const

export function CrewSticky() {
  const { t } = useI18n()
  const cardsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const wrap = cardsRef.current
    const cta = ctaRef.current
    if (!wrap) return

    const cards = Array.from(wrap.querySelectorAll<HTMLElement>('.crew-card'))
    const totalCards = cards.length
    if (totalCards === 0) return

    const segmentSize = 1 / totalCards
    const cardYOffset = 5
    const cardScaleStep = 0.075

    cards.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50 + i * cardYOffset,
        scale: 1 - i * cardScaleStep,
      })
    })

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: () => '+=' + window.innerHeight * (totalCards * 0.85),
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress

        // CTA "Falar com a Bold Studio" aparece nos ultimos ~20% (quando o
        // ultimo card esta saindo), preenchendo o fim do efeito sem espaco morto.
        if (cta) {
          const o = Math.max(0, Math.min(1, (progress - 0.78) / 0.18))
          gsap.set(cta, { opacity: o, pointerEvents: o > 0.5 ? 'auto' : 'none' })
        }

        const activeIndex = Math.min(Math.floor(progress / segmentSize), totalCards - 1)
        const segProgress = (progress - activeIndex * segmentSize) / segmentSize

        cards.forEach((card, i) => {
          if (i < activeIndex) {
            gsap.set(card, { yPercent: -250, rotationX: 35 })
          } else if (i === activeIndex) {
            gsap.set(card, {
              yPercent: gsap.utils.interpolate(-50, -200, segProgress),
              rotationX: gsap.utils.interpolate(0, 35, segProgress),
              scale: 1,
            })
          } else {
            const behindIndex = i - activeIndex
            const currentYOffset = (behindIndex - segProgress) * cardYOffset
            const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep
            gsap.set(card, {
              yPercent: -50 + currentYOffset,
              rotationX: 0,
              scale: currentScale,
            })
          }
        })
      },
    })

    // As secoes acima (reels/clientes/fontes) e a intro que revela a home so
    // assentam DEPOIS do pin ja ter sido medido, deslocando a posicao real da
    // secao — era isso que "bugava" os cards ate um refresh manual. Recalcula os
    // ScrollTriggers quando a pagina/fontes terminam de carregar.
    const refresh = () => ScrollTrigger.refresh()
    const raf = requestAnimationFrame(refresh)
    window.addEventListener('load', refresh)
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {})

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', refresh)
      st.kill()
    }
  }, [])

  return (
    <section id="crew" className="scroll-mt-24">
      <div className="px-6 pt-24 pb-8 text-center">
        <p className="text-xs font-bold tracking-wider text-bold-yellow">{t.crew.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t.crew.title}</h2>
      </div>

      <div ref={cardsRef} className="crew-cards">
        <div ref={ctaRef} className="crew-cta">
          <p>{t.crew.ctaText}</p>
          <ShinyButton
            onClick={() =>
              document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          >
            {t.crew.ctaButton}
          </ShinyButton>
        </div>
        {CREW.map((m, i) => {
          const info = t.crew.members[m.id]
          const hasPhoto = 'color' in m
          return (
            <article key={m.id} className="crew-card" style={{ zIndex: 10 - i }}>
              <div className="crew-card__info">
                <span className="crew-card__bar" aria-hidden="true" />
                <div>
                  <h3 className="crew-card__name">{m.nome}</h3>
                  <div className="crew-card__roles">
                    <p className="crew-card__role">{info.role}</p>
                  </div>
                  <p className="crew-card__desc">{info.desc}</p>
                </div>
              </div>
              {hasPhoto ? (
                <div className="crew-card__photo">
                  <img
                    className="crew-photo"
                    src={m.color}
                    alt={m.nome}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="crew-card__photo crew-card__photo--empty">
                  <User size={64} className="text-bold-white/20" aria-hidden="true" />
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
