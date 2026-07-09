import { useEffect, useRef, useState } from 'react'
import { User } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ShinyButton } from '@/components/ShinyButton'
import { useI18n } from '@/i18n/I18nContext'
import { cn } from '@/lib/utils'

// Efeito "Sticky Cards" (GSAP ScrollTrigger) portado para a secao Crew.
// Cards empilhados que saem um a um conforme o scroll. Cargo e descricao vem
// das traducoes (t.crew.members[id]); aqui ficam so nome e foto (idiomaagnostico).
// Cada membro tem duas fotos: preto&branco (padrao, estatica) e colorida (aparece
// no hover e trava no clique, com transicao suave de 0.5s).
const BW_BASE = 'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/FOTOS_CREW_PR_BR/'
const COLOR_BASE = 'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/Fotos_CREW_COLORIDAS/'

const CREW = [
  { id: 'pedro-garcia', nome: 'Pedro Garcia Jr.', bw: `${BW_BASE}PEDRAO_BOLD_IMG_CREW_PR.png`, color: `${COLOR_BASE}PEDRAO_BOLD_IMG_CREW.png` },
  { id: 'miguel', nome: 'Miguel Souza', bw: `${BW_BASE}MIGUEL_BOLD_IMG_CREW_v2_PR.png`, color: `${COLOR_BASE}MIGUEL_BOLD_IMG_CREW.png` },
  { id: 'bruno', nome: 'Bruno Cavedon', bw: `${BW_BASE}CAVEDON_PR_BR.png`, color: `${COLOR_BASE}CAVEDON_BOLD_IMG_CREW.png` },
  { id: 'william', nome: 'William Ferruda', bw: `${BW_BASE}IMG_1088.JPG%202_PR.png`, color: `${COLOR_BASE}IMG_1088.JPG%201.png` },
  { id: 'rafaela', nome: 'Rafaela Souza', bw: `${BW_BASE}RAFAELA_BOLD_IMG_CREW_PR.png`, color: `${COLOR_BASE}RAFAELA_BOLD_IMG_CREW.png` },
  { id: 'nathalia', nome: 'Nathalia Umburanas' },
  { id: 'caroline', nome: 'Caroline Ventura', bw: `${BW_BASE}MULHER_MIGUEL_BOLD_IMG_CREW_PR.png`, color: `${COLOR_BASE}MULHER_MIGUEL_BOLD_IMG_CREW.png` },
  { id: 'germano', nome: 'Germano Pagliari', bw: `${BW_BASE}GERMANO_BOLD_IMG_CREW_PR.png`, color: `${COLOR_BASE}GERMANO_BOLD_IMG_CREW.png` },
  { id: 'pedro-neto', nome: 'Pedro Garcia Neto', bw: `${BW_BASE}juninho_BOLD_IMG_CREW_PR.png`, color: `${COLOR_BASE}juninho_BOLD_IMG_CREW.png` },
] as const

export function CrewSticky() {
  const { t } = useI18n()
  const cardsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  // membros com a foto colorida "travada" pelo clique
  const [colorLocked, setColorLocked] = useState<Set<string>>(new Set())
  const toggleColor = (id: string) =>
    setColorLocked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

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
      end: `+=${window.innerHeight * (totalCards * 0.85)}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
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

    return () => {
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
          const hasPhoto = 'bw' in m
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
                <button
                  type="button"
                  onClick={() => toggleColor(m.id)}
                  className={cn('crew-card__photo', colorLocked.has(m.id) && 'is-color')}
                  aria-label={m.nome}
                  aria-pressed={colorLocked.has(m.id)}
                >
                  <img className="crew-photo crew-photo--bw" src={m.bw} alt={m.nome} loading="lazy" />
                  <img className="crew-photo crew-photo--color" src={m.color} alt="" aria-hidden="true" loading="lazy" />
                </button>
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
