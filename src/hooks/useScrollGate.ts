import { useCallback, useEffect, useRef, useState } from 'react'
import type { ScrollTrigger } from '@/lib/gsap'

// "Portao" de scroll pra secoes pinadas muito longas (Crew, Cases): ao cruzar
// `gateProgress`, trava o scroll (`lockSeconds`) e mostra um popup perguntando
// se o usuario quer ver o resto. "Quero ver" -> libera na hora. Nao respondeu
// ate o tempo acabar (ou fechou no X / clicou fora) -> pula pro fim da secao.
//
// Historico: a v1 interceptava o gesto de wheel/touch com
// event.preventDefault() ANTES do scroll acontecer — fragil em touch (iOS/
// Android decidem se um gesto vai rolar a pagina logo no primeiro touchmove;
// bloquear condicionalmente so nos eventos seguintes da mesma gesture fica
// inconsistente entre navegadores, sentia como trava/lag). A v2 tentou reagir
// ao evento nativo `scroll` do window, mas isso corre por fora do ScrollTrigger
// — dependendo da ordem de registro dos listeners, o `self.progress` lido
// nesse evento podia estar um frame atrasado em relacao ao que o GSAP acabou
// de calcular, entao o gate as vezes nao disparava.
//
// Essa versao (v3) nao registra nenhum listener proprio: quem chama
// `checkProgress(self.progress)` e o proprio `onUpdate` do ScrollTrigger da
// secao (Crew/Cases), que ja roda em sincronia com o scroll de verdade
// (mouse, touch ou trackpad — GSAP normaliza os tres). Ao cruzar o gate,
// volta pra posicao exata (snap) e trava com overflow:hidden.
export function useScrollGate(gateProgress: number, lockSeconds = 7) {
  const [gateOpen, setGateOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(lockSeconds)
  const resolvedRef = useRef(false)
  const gateOpenRef = useRef(false)
  const stRef = useRef<ScrollTrigger | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const lastProgressRef = useRef(0)

  const attach = useCallback((st: ScrollTrigger) => {
    stRef.current = st
  }, [])

  const clearTimers = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    timeoutRef.current = null
    intervalRef.current = null
  }

  // overflow:hidden no html+body bloqueia scroll de forma identica em
  // wheel/touch/teclado/scrollbar, sem depender de preventDefault por tipo
  // de gesto.
  const lockScroll = () => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  }
  const unlockScroll = () => {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }

  const skip = useCallback(() => {
    resolvedRef.current = true
    gateOpenRef.current = false
    clearTimers()
    unlockScroll()
    setGateOpen(false)
    const st = stRef.current
    if (st) window.scrollTo({ top: st.end + 1, behavior: 'smooth' })
  }, [])

  const accept = useCallback(() => {
    resolvedRef.current = true
    gateOpenRef.current = false
    clearTimers()
    unlockScroll()
    setGateOpen(false)
  }, [])

  const openGate = useCallback(() => {
    gateOpenRef.current = true
    setSecondsLeft(lockSeconds)
    setGateOpen(true)
    lockScroll()
    timeoutRef.current = window.setTimeout(() => {
      if (!resolvedRef.current) skip()
    }, lockSeconds * 1000)
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
  }, [lockSeconds, skip])

  // Chamado a cada onUpdate do ScrollTrigger da secao (self.progress).
  const checkProgress = useCallback(
    (progress: number) => {
      const scrollingForward = progress > lastProgressRef.current
      lastProgressRef.current = progress
      if (resolvedRef.current || gateOpenRef.current || !scrollingForward) return
      if (progress < gateProgress) return
      const st = stRef.current
      if (st) {
        const target = st.start + gateProgress * (st.end - st.start)
        window.scrollTo({ top: target })
      }
      openGate()
    },
    [gateProgress, openGate]
  )

  useEffect(() => () => {
    clearTimers()
    unlockScroll()
  }, [])

  return { gateOpen, secondsLeft, attach, skip, accept, checkProgress }
}
