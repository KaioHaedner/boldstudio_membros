import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShinyButton } from '@/components/ShinyButton'
import { useI18n } from '@/i18n/I18nContext'
import { SERVICO_SLUGS } from '@/data/servicos'

// Seção "Soluções" (produtos). Lista central: o item ativo fica amarelo e os
// outros apagam. No desktop (mouse de verdade) o realce segue o hover; no
// mobile/touch, onde não existe hover, ele percorre a lista sozinho. Cada item
// leva para a página do serviço. No rodapé, etiqueta amarela sticky.
export function SolucoesSticky() {
  const { t } = useI18n()
  const produtos = t.servicos.produtos
  const [activeIndex, setActiveIndex] = useState(0)
  // No desktop o hover manda enquanto o mouse está na lista; fora disso o
  // destaque volta a percorrer sozinho. No touch, onde hover não existe, ele
  // percorre o tempo todo.
  const [mouseNaLista, setMouseNaLista] = useState(false)

  // Ref pra o intervalo saber onde parou sem virar dependência do efeito (se
  // virasse, o intervalo seria recriado a cada troca).
  const indiceAtual = useRef(0)
  const ativar = useCallback((indice: number) => {
    indiceAtual.current = indice
    setActiveIndex(indice)
  }, [])

  useEffect(() => {
    if (mouseNaLista) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      ativar((indiceAtual.current + 1) % produtos.length)
    }, 2200)
    return () => window.clearInterval(id)
  }, [mouseNaLista, produtos.length, ativar])

  return (
    <section id="servicos" className="relative scroll-mt-24 px-6 py-[var(--espaco-secao)]">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-bold-yellow">
          {t.servicos.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-black uppercase leading-[1.05] sm:text-5xl">
          {t.servicos.title}
        </h2>

        <div className="relative mt-10 sm:mt-16">
          <ul
            onMouseEnter={() => setMouseNaLista(true)}
            onMouseLeave={() => setMouseNaLista(false)}
            className="mx-auto flex max-w-3xl flex-col items-center"
          >
            {produtos.map((produto, index) => (
              <li key={produto.nome} className="flex items-baseline gap-4 py-0.5 sm:py-1">
                <span
                  className="font-serif text-base italic transition-colors duration-300 sm:text-xl"
                  style={{ color: activeIndex === index ? '#FFD712' : 'rgba(255,255,255,0.3)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Link
                  to={`/servico/${SERVICO_SLUGS[index]}`}
                  onMouseEnter={() => ativar(index)}
                  className="text-[clamp(1.8rem,6vw,4rem)] font-black uppercase leading-[1.05] tracking-tight transition-all duration-300"
                  style={{
                    color: activeIndex === index ? '#FFD712' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {produto.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* min-h: a descrição só existe com um item ativo; sem altura reservada
            o bloco crescia do zero e empurrava o resto ao ativar. */}
        <p className="mx-auto mt-10 min-h-[4rem] max-w-3xl text-[clamp(1rem,3vw,2rem)] font-black uppercase leading-[1.05] tracking-tight text-bold-yellow sm:min-h-[4.5rem]">
          {activeIndex !== null ? produtos[activeIndex].descricao : ''}
        </p>

        <div className="mt-10 flex justify-center">
          <ShinyButton
            onClick={() =>
                document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
          >
            {t.servicos.ctaButton}
          </ShinyButton>
        </div>
      </div>

      {/* Etiqueta amarela sticky */}
      {/* -ml-6 anula o px-6 da seção: sem isso a etiqueta parava a 24px da borda,
          enquanto BoldCrew, Academy e Contato encostavam de fato. */}
      <div className="pointer-events-none sticky bottom-6 z-10 -ml-6 mt-[var(--espaco-etiqueta)]">
        <span className="sticker-amarelo inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          {t.servicos.label}
        </span>
      </div>
    </section>
  )
}
