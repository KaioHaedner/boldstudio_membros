type Callbacks = {
  begin: () => void
  move: (distance: number) => void
  finish: (advance: boolean) => void
  width: () => number
}

/** Stable, untransformed gesture target. Native vertical scroll is never blocked. */
export function bindCardSwipe(stage: HTMLElement, callbacks: Callbacks) {
  let pointer: number | null = null
  let x = 0
  let y = 0
  let timestamp = 0
  let distance = 0
  let axis: 'horizontal' | 'vertical' | null = null

  const release = () => {
    const id = pointer
    pointer = null
    axis = null
    if (id !== null && stage.hasPointerCapture?.(id)) stage.releasePointerCapture(id)
  }
  const down = (event: PointerEvent) => {
    if (pointer !== null || event.button !== 0 || !event.isPrimary) return
    pointer = event.pointerId
    x = event.clientX
    y = event.clientY
    timestamp = event.timeStamp
    distance = 0
    axis = null
    callbacks.begin()
  }
  const move = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return
    const dx = event.clientX - x
    const dy = event.clientY - y
    if (!axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return
      // Require clear horizontal intent; diagonal gestures belong to scrolling.
      axis = Math.abs(dx) > Math.abs(dy) * 1.25 ? 'horizontal' : 'vertical'
      if (axis === 'vertical') {
        release()
        callbacks.finish(false)
        return
      }
      try { stage.setPointerCapture(event.pointerId) } catch { /* detached pointer */ }
    }
    if (event.cancelable) event.preventDefault()
    distance = dx
    callbacks.move(dx)
  }
  const up = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return
    const duration = Math.max(1, event.timeStamp - timestamp)
    const advance = axis === 'horizontal' && (
      Math.abs(distance) > Math.max(40, callbacks.width() * 0.12) ||
      (Math.abs(distance) / duration > 0.35 && Math.abs(distance) > 24)
    )
    release()
    callbacks.finish(advance)
  }
  const cancel = (event?: PointerEvent) => {
    if (pointer === null || (event && event.pointerId !== pointer)) return
    release()
    // pointercancel / lost capture / backgrounding NEVER means "next card".
    callbacks.finish(false)
  }
  const visibility = () => { if (document.hidden) cancel() }
  stage.addEventListener('pointerdown', down)
  stage.addEventListener('lostpointercapture', cancel)
  window.addEventListener('pointermove', move, { passive: false })
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', cancel)
  document.addEventListener('visibilitychange', visibility)
  // Named listener so StrictMode/remounts cannot leave a global handler behind.
  const blur = () => cancel()
  window.addEventListener('blur', blur)
  window.addEventListener('resize', blur)
  return () => {
    release()
    stage.removeEventListener('pointerdown', down)
    stage.removeEventListener('lostpointercapture', cancel)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', cancel)
    window.removeEventListener('blur', blur)
    window.removeEventListener('resize', blur)
    document.removeEventListener('visibilitychange', visibility)
  }
}
