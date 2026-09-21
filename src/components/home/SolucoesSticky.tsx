import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n/I18nContext'
import { SERVICO_SLUGS } from '@/data/servicos'

// Seção "Soluções" (produtos). Lista central: o item ativo fica amarelo e os
// outros apagam. No desktop (mouse de verdade) o realce segue o hover; no
// mobile/touch, onde não existe hover, ele percorre a lista sozinho. Cada item
// leva para a página do serviço. No rodapé, etiqueta amarela sticky.
export function SolucoesSticky() {
  const { t } = useI18n()
  const produtos = t.servicos.produtos
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [autoCycle, setAutoCycle] = useState(false)

  // Mobile/touch: o destaque que no desktop responde ao hover percorre a lista
  // sozinho. Incluímos largura, hover e ponteiro na detecção porque alguns
  // navegadores/emuladores móveis ainda anunciam hover e deixavam a seção vazia.
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (hover: none), (pointer: coarse)')
    const update = () => setAutoCycle(media.matches)

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!autoCycle) return

    let i = 0
    setActiveIndex(0)
    const id = window.setInterval(() => {
      i = (i + 1) % produtos.length
      setActiveIndex(i)
    }, 2200)
    return () => window.clearInterval(id)
  }, [autoCycle, produtos.length])

  return (
    <section id="servicos" className="relative scroll-mt-24 px-6 py-16 sm:py-32">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-bold-yellow">
          {t.servicos.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-black uppercase leading-[1.05] sm:text-5xl">
          {t.servicos.title}
        </h2>

        <div className="relative mt-10 sm:mt-16">
          <ul
            onMouseLeave={() => {
              if (!autoCycle) setActiveIndex(null)
            }}
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
                  onMouseEnter={() => {
                    if (!autoCycle) setActiveIndex(index)
                  }}
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
      </div>

      {/* Etiqueta amarela sticky */}
      <div className="pointer-events-none sticky bottom-6 z-10 mt-16">
        <span className="sticker-amarelo inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          {t.servicos.label}
        </span>
      </div>
    </section>
  )
}
