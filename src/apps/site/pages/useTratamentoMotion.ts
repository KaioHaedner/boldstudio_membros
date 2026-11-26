import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'

type ControleTypewriter = {
  kill: () => void
  restaurar: () => void
}

function criarTypewriter(el: HTMLElement, delay = 0): ControleTypewriter | null {
  const original = el.dataset.twOriginal ?? el.textContent ?? ''
  if (!original.trim()) return null
  el.dataset.twOriginal = original

  const ativo = document.createElement('span')
  ativo.className = 'trat-tw__ativo'
  const resto = document.createElement('span')
  resto.className = 'trat-tw__resto'
  resto.setAttribute('aria-hidden', 'true')
  resto.textContent = original

  el.textContent = ''
  el.append(ativo, resto)

  const estado = { chars: 0 }
  const total = original.length
  const duracao = Math.min(1.4, Math.max(0.42, total * 0.011))

  const restaurar = () => {
    if (el.dataset.twOriginal) {
      el.textContent = el.dataset.twOriginal
    }
  }

  const tween = gsap.to(estado, {
    chars: total,
    duration: duracao,
    delay,
    ease: 'none',
    onUpdate: () => {
      const corte = Math.round(estado.chars)
      ativo.textContent = original.slice(0, corte)
      resto.textContent = original.slice(corte)
    },
    onComplete: restaurar,
  })

  return {
    kill: () => tween.kill(),
    restaurar,
  }
}

export function useTratamentoMotion(rootRef: RefObject<HTMLDivElement | null>, mediaKey: string) {
  const seen = useRef(new WeakSet<Element>())

  useEffect(() => {
    const root = rootRef.current
    const stage = root?.querySelector<HTMLElement>('.trat-palco')
    if (!root || !stage) return

    const media = gsap.matchMedia()
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      pointer: '(hover: hover) and (pointer: fine)',
    }, context => {
      if (!context.conditions?.motion) return

      const ativosTw = new Set<ControleTypewriter>()
      const iniciarTw = (el: HTMLElement, delay = 0) => {
        const tw = criarTypewriter(el, delay)
        if (tw) ativosTw.add(tw)
      }

      type GrupoReveal = {
        trigger: HTMLElement
        modo: 'grow-midia' | 'fade-up' | 'cards-com-texto' | 'botoes' | 'typewriter'
        itens: HTMLElement[]
      }

      const grupos: GrupoReveal[] = []
      const registrar = (
        trigger: HTMLElement | null,
        modo: GrupoReveal['modo'],
        itens: HTMLElement[],
      ) => {
        if (!trigger || !itens.length || seen.current.has(trigger)) return
        grupos.push({ trigger, modo, itens })
      }

      // 1) Imagens, vídeos e logos: Fade-in-up + Grow
      registrar(
        root.querySelector<HTMLElement>('.trat-capa img'),
        'grow-midia',
        Array.from(root.querySelectorAll<HTMLElement>('.trat-capa img')),
      )
      registrar(
        root.querySelector<HTMLElement>('.trat-jd__marca'),
        'grow-midia',
        Array.from(root.querySelectorAll<HTMLElement>('.trat-jd__marca')),
      )
      root.querySelectorAll<HTMLElement>('.trat-faixa').forEach(faixa => {
        registrar(faixa, 'grow-midia', Array.from(faixa.querySelectorAll<HTMLElement>(':scope > .trat-midia')))
      })
      root.querySelectorAll<HTMLElement>('.trat-jd__cena > .trat-midia, .trat-abre-duas > .trat-midia, .trat-obrigado > .trat-midia, .trat-yt, .trat-rodape__logo')
        .forEach(el => registrar(el, 'grow-midia', [el]))

      // 2) Títulos e divisores: Fade-in-up
      root.querySelectorAll<HTMLElement>('.trat-jd__cabecalho h1, .trat-titulo, .trat-obrigado h2, .trat-camera__linha')
        .forEach(el => registrar(el, 'fade-up', [el]))

      // 3) Balões de fala e cards de Som/Arte: Card faz Fade-in-up + parágrafo interno faz Typewriter
      root.querySelectorAll<HTMLElement>('.trat-falas').forEach(falas => {
        registrar(falas, 'cards-com-texto', Array.from(falas.querySelectorAll<HTMLElement>('blockquote')))
      })
      root.querySelectorAll<HTMLElement>('.trat-som').forEach(som => {
        registrar(som, 'cards-com-texto', Array.from(som.querySelectorAll<HTMLElement>('article')))
      })
      root.querySelectorAll<HTMLElement>('.trat-arte').forEach(arte => {
        registrar(arte, 'cards-com-texto', Array.from(arte.querySelectorAll<HTMLElement>(':scope > div')))
      })

      // 4) Botões e listas de links/câmera: Fade-in-up com stagger
      root.querySelectorAll<HTMLElement>('.trat-link-pratica')
        .forEach(btn => registrar(btn, 'botoes', [btn]))
      root.querySelectorAll<HTMLElement>('.trat-lista, .trat-links, .trat-rodape__links').forEach(lista => {
        registrar(lista, 'botoes', Array.from(lista.querySelectorAll<HTMLElement>(':scope > li')))
      })

      // 5) Eyebrows e parágrafos editoriais: Fade-in-up suave + Typewriter
      root.querySelectorAll<HTMLElement>('.trat-eyebrow, .trat-jd__cena > p, .trat-corpo p, .trat-obrigado p')
        .forEach(p => registrar(p, 'typewriter', [p]))

      const mapaPorTrigger = new Map<Element, GrupoReveal[]>()
      for (const g of grupos) {
        const lista = mapaPorTrigger.get(g.trigger) ?? []
        lista.push(g)
        mapaPorTrigger.set(g.trigger, lista)

        if (g.modo === 'grow-midia') {
          gsap.set(g.itens, { opacity: 0, y: 38, scale: 0.9 })
        } else if (g.modo === 'fade-up' || g.modo === 'cards-com-texto') {
          gsap.set(g.itens, { opacity: 0, y: 30 })
        } else if (g.modo === 'botoes') {
          gsap.set(g.itens, { opacity: 0, y: 26, scale: 0.96 })
        } else if (g.modo === 'typewriter') {
          gsap.set(g.itens, { opacity: 0, y: 16 })
        }
      }

      const reveal = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const trigger = entry.target as HTMLElement
          const lotes = mapaPorTrigger.get(trigger)
          seen.current.add(trigger)
          reveal.unobserve(trigger)
          if (!lotes) continue

          context.add(() => {
            for (const g of lotes) {
              if (g.modo === 'grow-midia') {
                gsap.to(g.itens, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.82,
                  stagger: 0.09,
                  ease: 'power3.out',
                  overwrite: 'auto',
                  clearProps: 'opacity,transform',
                })
              } else if (g.modo === 'fade-up') {
                gsap.to(g.itens, {
                  opacity: 1,
                  y: 0,
                  duration: 0.72,
                  stagger: 0.08,
                  ease: 'power3.out',
                  overwrite: 'auto',
                  clearProps: 'opacity,transform',
                })
              } else if (g.modo === 'cards-com-texto') {
                gsap.to(g.itens, {
                  opacity: 1,
                  y: 0,
                  duration: 0.72,
                  stagger: 0.09,
                  ease: 'power3.out',
                  overwrite: 'auto',
                  clearProps: 'opacity,transform',
                })
                g.itens.forEach((card, idx) => {
                  const p = card.querySelector<HTMLElement>('p')
                  if (p) iniciarTw(p, idx * 0.09)
                })
              } else if (g.modo === 'botoes') {
                gsap.to(g.itens, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.66,
                  stagger: 0.075,
                  ease: 'back.out(1.35)',
                  overwrite: 'auto',
                  clearProps: 'opacity,transform',
                })
              } else if (g.modo === 'typewriter') {
                gsap.to(g.itens, {
                  opacity: 1,
                  y: 0,
                  duration: 0.48,
                  ease: 'power2.out',
                  overwrite: 'auto',
                  clearProps: 'opacity,transform',
                })
                g.itens.forEach((el, idx) => iniciarTw(el, idx * 0.08))
              }
            }
          })
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })

      for (const trigger of mapaPorTrigger.keys()) {
        reveal.observe(trigger)
      }

      let active: HTMLElement | null = null
      const tilted = new Set<HTMLElement>()
      const reset = () => {
        if (!active) return
        const frame = active
        active = null
        gsap.to(frame, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: .42,
          ease: 'power3.out',
          overwrite: 'auto',
          clearProps: 'transform',
          onComplete: () => { tilted.delete(frame) },
        })
      }
      const move = (event: PointerEvent) => {
        if (event.pointerType === 'touch' || !(event.target instanceof Element)) return
        const target = event.target.closest<HTMLElement>('[data-motion-frame]')
        const frame = target?.querySelector<HTMLElement>('.trat-midia__frame')
        if (frame !== active) reset()
        if (!frame || !target) return
        active = frame
        tilted.add(frame)
        const rect = target.getBoundingClientRect()
        const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5))
        const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5))
        gsap.to(frame, {
          rotateX: -y * 15, rotateY: x * 18, scale: 1.035,
          transformPerspective: 940, duration: .36, ease: 'power3.out', overwrite: 'auto',
        })
      }
      if (context.conditions.pointer) {
        stage.addEventListener('pointermove', move, { passive: true })
        stage.addEventListener('pointerleave', reset)
      }

      return () => {
        reveal.disconnect()
        stage.removeEventListener('pointermove', move)
        stage.removeEventListener('pointerleave', reset)
        for (const tw of ativosTw) {
          tw.kill()
          tw.restaurar()
        }
        ativosTw.clear()
        for (const frame of tilted) {
          gsap.killTweensOf(frame)
          gsap.set(frame, { clearProps: 'transform' })
        }
        tilted.clear()
      }
    })
    return () => media.revert()
  }, [rootRef, mediaKey])
}
