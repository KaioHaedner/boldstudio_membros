import { useEffect, type RefObject } from 'react'
import { gsap } from '@/lib/gsap'

type CardSwapOptions = {
  delay?: number
  skewAmount?: number
  pauseOnHover?: boolean
}

type Slot = { x: number; y: number; z: number; zIndex: number }

// O leque e centralizado: sem o desconto de metade, a pilha inteira pende pra
// direita/pra cima e os cards de tras vazam pra fora da secao (no mobile isso
// cortava os cards na borda da tela). O CSS reserva essa mesma folga na largura
// e na altura do card, entao o leque cabe dentro do stage.
function makeSlot(index: number, distX: number, distY: number, total: number): Slot {
  const fanX = (total - 1) * distX
  const fanY = (total - 1) * distY
  return {
    x: index * distX - fanX / 2,
    y: -index * distY + fanY / 2,
    z: -index * distX * 1.5,
    zIndex: total - index,
  }
}

// Porta o efeito "Card Swap 3D" (stack de cards em perspectiva com troca
// automatica via GSAP) para dentro do fluxo normal da pagina: ao contrario do
// sticky/portao anterior, nao trava nem intercepta o scroll — os cards giram
// sozinhos enquanto a secao esta visivel (IntersectionObserver liga/desliga o
// ciclo) e o usuario rola por cima livremente.
export function useCardSwap(
  containerRef: RefObject<HTMLElement | null>,
  { delay = 4200, skewAmount = 2.5, pauseOnHover = true }: CardSwapOptions = {}
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = Array.from(container.querySelectorAll<HTMLElement>('.crew-card'))
    const total = cards.length
    if (total < 2) return

    // Distancias do leque vêm do CSS (--card-swap-x/y) pra que uma media query
    // sozinha controle o tamanho do leque E a folga reservada no card, sem os
    // dois valores se desencontrarem entre JS e CSS.
    const readFan = () => {
      const styles = getComputedStyle(container)
      return {
        x: parseFloat(styles.getPropertyValue('--card-swap-x')) || 20,
        y: parseFloat(styles.getPropertyValue('--card-swap-y')) || 24,
      }
    }
    let { x: cardDistance, y: verticalDistance } = readFan()

    function place(el: HTMLElement, slot: Slot) {
      gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skewAmount,
        zIndex: slot.zIndex,
        force3D: true,
      })
    }

    cards.forEach((card, i) => place(card, makeSlot(i, cardDistance, verticalDistance, total)))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const order = Array.from({ length: total }, (_, i) => i)
    let timeline: ReturnType<typeof gsap.timeline> | null = null
    let interval: number | null = null

    function swap() {
      if (order.length < 2) return
      const front = order[0]
      const rest = order.slice(1)
      const frontEl = cards[front]
      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total)
      // container ja foi checado no inicio do efeito e e const — o `!` so evita
      // que o TS reclame por nao estreitar o tipo dentro do closure.
      const dropDistance = container!.getBoundingClientRect().height + 80

      timeline = gsap.timeline()

      // Manda o card da frente pro fundo da pilha JA NO INICIO (zIndex) — ele
      // sai por baixo dos outros enquanto desce, em vez de ficar por cima
      // escondendo o proximo card ate o fim da animacao.
      timeline.set(frontEl, { zIndex: backSlot.zIndex }, 0)
      timeline.to(frontEl, { y: '+=' + dropDistance, duration: 0.85, ease: 'power2.in' }, 0)
      timeline.set(frontEl, { x: backSlot.x, y: backSlot.y, z: backSlot.z }, '>')

      rest.forEach((cardIndex, i) => {
        const el = cards[cardIndex]
        const slot = makeSlot(i, cardDistance, verticalDistance, total)
        timeline!.set(el, { zIndex: slot.zIndex }, 0)
        timeline!.to(
          el,
          { x: slot.x, y: slot.y, z: slot.z, duration: 0.9, ease: 'elastic.out(0.7,0.9)' },
          i * 0.08
        )
      })

      timeline.call(() => {
        order.shift()
        order.push(front)
      })
    }

    // Reaplica a posicao canonica de cada card conforme a ordem atual — usado
    // ao retomar o ciclo pra garantir estado limpo mesmo se a ultima troca foi
    // interrompida no meio (usuario saiu de vista rolando rapido, por exemplo).
    function resync() {
      order.forEach((cardIndex, slotIndex) => {
        place(cards[cardIndex], makeSlot(slotIndex, cardDistance, verticalDistance, total))
      })
    }

    function start() {
      if (interval) return
      timeline?.kill()
      resync()
      swap()
      interval = window.setInterval(swap, delay)
    }

    function stop() {
      if (interval) window.clearInterval(interval)
      interval = null
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.3 }
    )
    io.observe(container)

    // Girar o celular / redimensionar troca a media query e o tamanho do stage,
    // e as posicoes ficam em px — sem isso a pilha fica torta depois do resize.
    const onResize = () => {
      const fan = readFan()
      cardDistance = fan.x
      verticalDistance = fan.y
      resync()
    }
    window.addEventListener('resize', onResize)

    const onEnter = () => stop()
    const onLeave = () => start()
    if (pauseOnHover) {
      container.addEventListener('mouseenter', onEnter)
      container.addEventListener('mouseleave', onLeave)
    }

    return () => {
      io.disconnect()
      stop()
      timeline?.kill()
      window.removeEventListener('resize', onResize)
      container.removeEventListener('mouseenter', onEnter)
      container.removeEventListener('mouseleave', onLeave)
    }
  }, [containerRef, delay, skewAmount, pauseOnHover])
}
