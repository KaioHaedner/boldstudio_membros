import { useCallback, useEffect, useRef, useState } from 'react'
import type { ScrollTrigger } from '@/lib/gsap'

// "Portao" de scroll pra secoes pinadas muito longas (Crew, Cases): ao tentar
// rolar pra baixo estando em `gateProgress` ou alem (2o->3o item), bloqueia
// ESSE gesto de scroll (wheel/touch), trava por `lockSeconds` e mostra um
// popup perguntando se o usuario quer ver o resto. "Quero ver" -> libera na
// hora. Nao respondeu ate o tempo acabar (ou fechou no X / clicou fora) ->
// pula pro fim da secao (proxima secao).
//
// Importante: NAO reage a onUpdate/refresh do ScrollTrigger (proximo a posicao
// de scroll DEPOIS dela mudar) — isso disparava o portao sozinho durante
// remedicoes internas do GSAP, sem o usuario ter rolado de verdade. Em vez
// disso intercepta o proprio gesto de wheel/touch ANTES do scroll acontecer.
export function useScrollGate(gateProgress: number, lockSeconds = 7) {
  const [gateOpen, setGateOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(lockSeconds)
  const resolvedRef = useRef(false)
  const gateOpenRef = useRef(false)
  const stRef = useRef<ScrollTrigger | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  const attach = useCallback((st: ScrollTrigger) => {
    stRef.current = st
  }, [])

  const clearTimers = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    timeoutRef.current = null
    intervalRef.current = null
  }

  const skip = useCallback(() => {
    resolvedRef.current = true
    gateOpenRef.current = false
    clearTimers()
    setGateOpen(false)
    const st = stRef.current
    if (st) window.scrollTo({ top: st.end + 1, behavior: 'smooth' })
  }, [])

  const accept = useCallback(() => {
    resolvedRef.current = true
    gateOpenRef.current = false
    clearTimers()
    setGateOpen(false)
  }, [])

  const openGate = useCallback(() => {
    gateOpenRef.current = true
    setSecondsLeft(lockSeconds)
    setGateOpen(true)
    timeoutRef.current = window.setTimeout(() => {
      if (!resolvedRef.current) skip()
    }, lockSeconds * 1000)
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
  }, [lockSeconds, skip])

  // Intercepta o gesto de scroll ANTES dele mover a pagina.
  useEffect(() => {
    const handle = (event: Event, scrollingDown: boolean) => {
      if (resolvedRef.current) return
      if (gateOpenRef.current) {
        event.preventDefault()
        return
      }
      if (!scrollingDown) return
      const st = stRef.current
      if (!st || st.progress < gateProgress) return
      event.preventDefault()
      openGate()
    }

    const onWheel = (event: WheelEvent) => handle(event, event.deltaY > 0)

    let touchStartY = 0
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? touchStartY
      handle(event, touchStartY - currentY > 0)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [gateProgress, openGate])

  useEffect(() => () => clearTimers(), [])

  return { gateOpen, secondsLeft, attach, skip, accept }
}
