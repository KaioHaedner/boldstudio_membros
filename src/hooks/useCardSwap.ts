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
    const stageElement = container

    const cards = Array.from(container.querySelectorAll<HTMLElement>('.crew-card'))
    const total = cards.length
    if (total < 2) return
    const originalStyles = cards.map((card) => card.getAttribute('style'))
    const restoreStyles = () => cards.forEach((card, index) => {
      const style = originalStyles[index]
      if (style === null) card.removeAttribute('style')
      else card.setAttribute('style', style)
    })

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
        rotationX: 0,
        scale: 1,
        transformOrigin: '50% 50%',
        zIndex: slot.zIndex,
        force3D: true,
      })
    }

    cards.forEach((card, i) => place(card, makeSlot(i, cardDistance, verticalDistance, total)))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const order = Array.from({ length: total }, (_, i) => i)
    let timeline: ReturnType<typeof gsap.timeline> | null = null
    let interval: number | null = null
    let visible = false
    let hovered = false

    function swap() {
      if (order.length < 2 || timeline?.isActive()) return
      // Rotaciona a fila JA, no inicio da troca. Antes isso acontecia num
      // timeline.call() no fim da animacao, entao existia uma janela em que o
      // card novo ja estava visivel na frente mas order[0] ainda apontava pro
      // antigo — e o arrasto, que usa order[0], simplesmente nao respondia.
      // Em maquina lenta essa janela esticava e o card parecia travado.
      const front = order.shift() as number
      order.push(front)
      const rest = order.slice(0, total - 1)
      const frontEl = cards[front]
      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total)
      const containerRect = stageElement.getBoundingClientRect()
      const stageCenterX = containerRect.left + containerRect.width / 2
      // Como x e relativo ao centro do stage, este alvo leva a borda esquerda
      // do card alem da margem direita da viewport em qualquer breakpoint.
      const exitX = window.innerWidth - stageCenterX + frontEl.offsetWidth / 2 + 48

      timeline = gsap.timeline()

      // O primeiro card sai inteiro pela margem direita. So depois de estar
      // fora da tela ele e colocado no ultimo slot, ja atras dos demais.
      timeline.set(frontEl, { zIndex: total + 10 }, 0)
      timeline.to(frontEl, {
        x: exitX,
        y: backSlot.y,
        z: 72,
        rotationZ: 3,
        duration: 0.82,
        ease: 'power3.in',
      }, 0)
      timeline.set(frontEl, {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        rotationZ: 0,
        zIndex: backSlot.zIndex,
      }, 0.9)

      rest.forEach((cardIndex, i) => {
        const el = cards[cardIndex]
        const slot = makeSlot(i, cardDistance, verticalDistance, total)
        timeline!.set(el, { zIndex: slot.zIndex }, 0)
        timeline!.to(
          el,
          { x: slot.x, y: slot.y, z: slot.z, duration: 0.58, ease: 'power2.inOut' },
          i * 0.02
        )
      })

    }

    // Reaplica a ordem atual ao redimensionar, depois de cancelar a animacao
    // que ainda usava as medidas anteriores.
    function resync() {
      order.forEach((cardIndex, slotIndex) => {
        place(cards[cardIndex], makeSlot(slotIndex, cardDistance, verticalDistance, total))
      })
    }

    // So agenda, nao troca na hora. Antes um swap saia daqui, entao soltar o
    // card depois de arrastar (o gesto ja troca por conta propria) pulava duas
    // cartas de uma vez, e tirar o mouse de cima trocava sem ninguem pedir.
    // Como o intervalo nasce zerado, o gesto manual tambem devolve o tempo
    // cheio antes da proxima troca automatica.
    function start() {
      if (interval || reduceMotion || !visible || hovered) return
      interval = window.setInterval(swap, delay)
    }

    function stop() {
      if (interval) window.clearInterval(interval)
      interval = null
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0.3 }
    )
    io.observe(container)

    // Girar o celular / redimensionar troca a media query e o tamanho do stage,
    // e as posicoes ficam em px — sem isso a pilha fica torta depois do resize.
    const onResize = () => {
      timeline?.kill()
      const fan = readFan()
      cardDistance = fan.x
      verticalDistance = fan.y
      resync()
    }
    window.addEventListener('resize', onResize)

    // Hover pausa as proximas trocas, mas deixa o card atual completar o arco.
    const onEnter = () => { hovered = true; stop() }
    const onLeave = () => { hovered = false; start() }
    if (pauseOnHover) {
      container.addEventListener('mouseenter', onEnter)
      container.addEventListener('mouseleave', onLeave)
    }

    // --- Arrasto manual do card da frente ---
    // Puxar o card pro lado e soltar passa pro proximo; soltar antes do limite
    // devolve ele pro lugar. Enquanto o dedo esta na tela o ciclo automatico
    // fica parado, e volta a rodar quando solta. O CSS poe touch-action: pan-y
    // nos cards, entao o gesto horizontal e nosso e o vertical continua
    // rolando a pagina normalmente.
    let arrastando = false
    let inicioX = 0
    let inicioY = 0
    let deslocamento = 0
    let ponteiro: number | null = null
    // null enquanto o dedo nao andou o bastante pra dizer se o gesto e de
    // trocar de card ou de rolar a pagina.
    let direcao: 'horizontal' | 'vertical' | null = null

    const cardDaFrente = () => cards[order[0]]

    const onPointerDown = (evento: PointerEvent) => {
      if (reduceMotion) return
      // Aceita o gesto pela AREA do palco, e nao por quem esta no topo da
      // pilha de hit-test. Escutando so no container o pointerdown nao chegava
      // (os cards usam preserve-3d e translateZ, e qualquer camada por cima
      // engolia o evento), entao o dedo nao pegava o card.
      const area = stageElement.getBoundingClientRect()
      const dentroDoPalco =
        evento.clientX >= area.left &&
        evento.clientX <= area.right &&
        evento.clientY >= area.top &&
        evento.clientY <= area.bottom
      if (!dentroDoPalco) return
      // O dedo sempre tem prioridade: se uma troca estiver rodando, ela e
      // cortada e a pilha volta pras posicoes da ordem atual. Antes o gesto era
      // ignorado enquanto a animacao corria, entao dois deslizes seguidos
      // perdiam o segundo e o card parecia travado.
      if (timeline?.isActive()) {
        timeline.kill()
        resync()
      }
      // Qualquer ponto do palco serve pra pegar o card da frente. Exigir que o
      // toque comecasse dentro dele deixava gestos legitimos sem resposta
      // quando a pilha estava no meio de um reposicionamento.
      const alvo = cardDaFrente()
      arrastando = true
      ponteiro = evento.pointerId
      inicioX = evento.clientX
      inicioY = evento.clientY
      deslocamento = 0
      direcao = null
      stop()
      // setPointerCapture lanca se o ponteiro ja nao estiver ativo; nao pode
      // derrubar o resto do gesto por causa disso
      try { alvo.setPointerCapture?.(evento.pointerId) } catch { /* ignora */ }
    }

    const onPointerMove = (evento: PointerEvent) => {
      if (!arrastando || evento.pointerId !== ponteiro) return
      const dx = evento.clientX - inicioX
      const dy = evento.clientY - inicioY

      // Primeiro decide a intencao do gesto. Sem isso o card acompanhava
      // qualquer tremida de dedo enquanto a pessoa so queria rolar a pagina,
      // e a pilha balancava junto com o scroll.
      if (direcao === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        direcao = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
        if (direcao === 'vertical') {
          // e rolagem, nao troca de card: devolve a pagina pro usuario
          arrastando = false
          ponteiro = null
          start()
          return
        }
      }

      deslocamento = dx
      const slot = makeSlot(0, cardDistance, verticalDistance, total)
      gsap.set(cardDaFrente(), {
        x: slot.x + deslocamento,
        rotationZ: deslocamento * 0.02,
        zIndex: total + 10,
      })
    }

    const onPointerUp = (evento: PointerEvent) => {
      if (!arrastando || evento.pointerId !== ponteiro) return
      arrastando = false
      ponteiro = null
      const eraHorizontal = direcao === 'horizontal'
      direcao = null
      const alvo = cardDaFrente()
      const limite = Math.max(60, alvo.offsetWidth * 0.22)

      if (eraHorizontal && Math.abs(deslocamento) > limite) {
        swap()
      } else if (eraHorizontal) {
        const slot = makeSlot(0, cardDistance, verticalDistance, total)
        gsap.to(alvo, {
          x: slot.x,
          rotationZ: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => gsap.set(alvo, { zIndex: slot.zIndex }),
        })
      }
      start()
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      io.disconnect()
      stop()
      timeline?.kill()
      window.removeEventListener('resize', onResize)
      container.removeEventListener('mouseenter', onEnter)
      container.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      restoreStyles()
    }
  }, [containerRef, delay, skewAmount, pauseOnHover])
}
