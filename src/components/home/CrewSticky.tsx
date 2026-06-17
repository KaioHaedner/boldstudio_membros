import { useEffect, useRef } from 'react'
import { User } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ShinyButton } from '@/components/ShinyButton'

// Efeito "Sticky Cards" (GSAP ScrollTrigger) portado para a secao Crew.
// Cards empilhados que saem um a um conforme o scroll. Fotos sao placeholder
// (icone) ate ter as imagens reais da equipe.
type Integrante = { nome: string; cargos: string[]; foto?: string }

const CREW: Integrante[] = [
  { nome: 'Pedro Garcia', cargos: ['CEO e Founder', 'Diretor de Produção'] },
  { nome: 'Miguel Souza', cargos: ['Co-Founder', 'Diretor de Fotografia'] },
  { nome: 'Bruno Cavedon', cargos: ['Co-Founder', 'Diretor de Vendas'] },
]

export function CrewSticky() {
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
        <p className="text-xs font-bold tracking-wider text-bold-yellow">Crew</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">Quem faz a BoldStudio acontecer</h2>
      </div>

      <div ref={cardsRef} className="crew-cards">
        <div ref={ctaRef} className="crew-cta">
          <p>Vamos gravar algo bold?</p>
          <ShinyButton
            onClick={() =>
              document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          >
            Falar com a Bold Studio
          </ShinyButton>
        </div>
        {CREW.map((m, i) => (
          <article key={m.nome} className="crew-card" style={{ zIndex: 10 - i }}>
            <div className="crew-card__info">
              <span className="crew-card__bar" aria-hidden="true" />
              <div>
                <h3 className="crew-card__name">{m.nome}</h3>
                <div className="crew-card__roles">
                  {m.cargos.map((c) => (
                    <p key={c} className="crew-card__role">
                      {c}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="crew-card__photo">
              {m.foto ? (
                <img src={m.foto} alt={m.nome} />
              ) : (
                <User size={64} className="text-bold-white/20" aria-hidden="true" />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
