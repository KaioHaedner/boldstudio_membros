import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/I18nContext'

// Imagem placeholder por produto — troca quando o Kaio mandar a arte/video real de cada um.
const PLACEHOLDER_IMG = '/brand/logo-boldstudio.webp'

// Seção "Soluções" (produtos). Lista central: item ativo realça (branco) e os
// outros ficam opacos, com uma miniatura flutuante acompanhando a altura do
// item — alterna de lado (par abre pra direita, impar pra esquerda), estilo
// sand.black. No desktop (mouse de verdade) é hover manual; no mobile/touch
// (sem hover), cicla sozinho pelos itens em loop. No rodapé, etiqueta amarela
// sticky (mesmo estilo do "BoldCrew").
export function SolucoesSticky() {
  const { t } = useI18n()
  const produtos = t.servicos.produtos
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [thumbTop, setThumbTop] = useState(0)

  const activateIndex = (index: number) => {
    const list = listRef.current
    const el = itemRefs.current[index]
    if (!list || !el) return
    const listRect = list.getBoundingClientRect()
    const itemRect = el.getBoundingClientRect()
    setThumbTop(itemRect.top - listRect.top + itemRect.height / 2)
    setActiveIndex(index)
  }

  // Mobile/touch (sem hover de verdade): looping automatico pelos itens.
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (canHover) return

    let i = 0
    activateIndex(0)
    const id = window.setInterval(() => {
      i = (i + 1) % produtos.length
      activateIndex(i)
    }, 2200)
    return () => window.clearInterval(id)
    // roda so uma vez no mount — activateIndex le refs atuais, nao precisa redeclarar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const side = activeIndex !== null && activeIndex % 2 === 0 ? 'right' : 'left'

  return (
    <section id="servicos" className="relative scroll-mt-24 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-bold-yellow">
          {t.servicos.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-black uppercase leading-[1.05] sm:text-5xl">
          {t.servicos.title}
        </h2>

        <div className="relative mt-16">
          <ul
            ref={listRef}
            onMouseLeave={() => setActiveIndex(null)}
            className="mx-auto flex max-w-3xl flex-col items-center"
          >
            {produtos.map((produto, index) => (
              <li
                key={produto.nome}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                onMouseEnter={() => activateIndex(index)}
                className="flex cursor-default items-baseline gap-4 py-0.5 sm:py-1"
              >
                <span
                  className="font-serif text-base italic transition-colors duration-300 sm:text-xl"
                  style={{ color: activeIndex === index ? '#FFD712' : 'rgba(255,255,255,0.3)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-[clamp(1.8rem,6vw,4rem)] font-black uppercase leading-[1.05] tracking-tight transition-all duration-300"
                  style={{
                    color:
                      activeIndex === index
                        ? '#FFD712'
                        : activeIndex === null
                          ? '#FFFFFF'
                          : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {produto.nome}
                </span>
              </li>
            ))}
          </ul>

          {/* Miniatura — no mobile nao ha espaco lateral pra flutuar do lado
              do item sem sobrepor o texto (a lista ocupa a largura toda), entao
              fica empilhada abaixo da lista, centralizada, em fluxo normal
              (position:static ignora o `top` que o framer-motion anima). A
              partir do sm: vira flutuante ao lado do item ativo, como no
              desktop. */}
          <AnimatePresence>
            {activeIndex !== null && (
              <motion.div
                key={side}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, top: thumbTop }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ top: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className={cn(
                  'pointer-events-none z-10 mx-auto mt-6 h-[140px] w-[140px] overflow-hidden rounded-2xl border border-bold-yellow/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] sm:absolute sm:mt-0 sm:h-[180px] sm:w-[180px] sm:-translate-y-1/2 md:h-[260px] md:w-[260px]',
                  side === 'right' ? 'sm:right-4 md:right-10' : 'sm:left-4 md:left-10'
                )}
              >
                <img
                  src={PLACEHOLDER_IMG}
                  alt=""
                  className="h-full w-full bg-bold-gray object-contain p-6 sm:p-6 md:p-10"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-10 max-w-lg mx-auto text-sm leading-relaxed text-bold-white/60">
          {activeIndex !== null ? produtos[activeIndex].descricao : ''}
        </p>
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
