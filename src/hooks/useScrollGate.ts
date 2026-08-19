import { useCallback, useEffect, useRef, useState } from 'react'
import type { ScrollTrigger } from '@/lib/gsap'

// "Portao" de scroll pra secoes pinadas muito longas (Crew, Cases): ao cruzar
// `gateProgress`, trava o scroll (`lockSeconds`) e mostra um popup perguntando
// se o usuario quer ver o resto. "Quero ver" -> libera na hora. Nao respondeu
// ate o tempo acabar (ou fechou no X / clicou fora) -> pula pro fim da secao.
//
// Historico:
// v1 interceptava o gesto de wheel/touch com event.preventDefault() ANTES do
// scroll acontecer — fragil em touch (iOS/Android decidem se um gesto vai
// rolar a pagina logo no primeiro touchmove; bloquear condicionalmente so
// nos eventos seguintes da mesma gesture fica inconsistente).
//
// v2 trocou pra reagir ao evento nativo `scroll` do window, mas isso corre
// por fora do ScrollTrigger — dependendo da ordem de registro dos
// listeners, o `self.progress` lido podia estar um frame atrasado, o gate
// as vezes nao disparava.
//
// v3 passou a reagir ao proprio `onUpdate` do ScrollTrigger da secao
// (chamado via `checkProgress`), o que resolveu a deteccao — mas ainda
// travava com overflow:hidden, que NAO e suficiente no iOS Safari: um fling
// (scroll com inercia) ja em andamento continua sendo aplicado pelo motor de
// momentum do proprio Safari por varios frames mesmo com overflow:hidden, e
// so parava depois de "vazar" bastante — foi isso que fez o popup do Crew
// abrir com a secao de Cases ja visivel atras.
//
// v4 (essa): ao cruzar o gate, congela o body com position:fixed exatamente
// na posicao alvo (tecnica padrao de scroll-lock robusta a iOS — usada por
// bibliotecas como body-scroll-lock). Isso corta a inercia na hora, porque o
// body deixa de participar do scroll do documento; a posicao "atual" vira
// so um `top` negativo, imune a deltas de momentum que ainda estejam
// chegando.
export function useScrollGate(gateProgress: number, lockSeconds = 7) {
  const [gateOpen, setGateOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(lockSeconds)
  const resolvedRef = useRef(false)
  const gateOpenRef = useRef(false)
  const stRef = useRef<ScrollTrigger | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const lastProgressRef = useRef(0)
  const lockYRef = useRef(0)

  const attach = useCallback((st: ScrollTrigger) => {
    stRef.current = st
  }, [])

  const clearTimers = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    timeoutRef.current = null
    intervalRef.current = null
  }

  const lockScrollAt = (y: number) => {
    lockYRef.current = y
    document.documentElement.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${y}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
  }

  const unlockScroll = () => {
    document.documentElement.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
  }

  const skip = useCallback(() => {
    resolvedRef.current = true
    gateOpenRef.current = false
    clearTimers()
    const y = lockYRef.current
    unlockScroll()
    window.scrollTo(0, y)
    setGateOpen(false)
    const st = stRef.current
    window.scrollTo({ top: st ? st.end + 1 : y, behavior: 'smooth' })
  }, [])

  const accept = useCallback(() => {
    resolvedRef.current = true
    gateOpenRef.current = false
    clearTimers()
    const y = lockYRef.current
    unlockScroll()
    window.scrollTo(0, y)
    setGateOpen(false)
  }, [])

  const openGate = useCallback(
    (y: number) => {
      gateOpenRef.current = true
      setSecondsLeft(lockSeconds)
      setGateOpen(true)
      lockScrollAt(y)
      timeoutRef.current = window.setTimeout(() => {
        if (!resolvedRef.current) skip()
      }, lockSeconds * 1000)
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => Math.max(0, s - 1))
      }, 1000)
    },
    [lockSeconds, skip]
  )

  // Chamado a cada onUpdate do ScrollTrigger da secao (self.progress).
  const checkProgress = useCallback(
    (progress: number) => {
      const scrollingForward = progress > lastProgressRef.current
      lastProgressRef.current = progress
      if (resolvedRef.current || gateOpenRef.current || !scrollingForward) return
      if (progress < gateProgress) return
      const st = stRef.current
      const target = st ? st.start + gateProgress * (st.end - st.start) : window.scrollY
      openGate(target)
    },
    [gateProgress, openGate]
  )

  useEffect(() => () => {
    clearTimers()
    unlockScroll()
  }, [])

  return { gateOpen, secondsLeft, attach, skip, accept, checkProgress }
}
