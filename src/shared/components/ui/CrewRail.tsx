import { useEffect, useRef, type ReactNode } from 'react'

export function CrewRail({ heading, children, label }: {
  heading: ReactNode; children: ReactNode; label: string
}) {
  const viewport = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = viewport.current!
    let pointer: number | null = null
    let startX = 0
    let startScroll = 0
    const down = (event: PointerEvent) => {
      // Touch and trackpads retain native scrolling; only mouse dragging is custom.
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      pointer = event.pointerId
      startX = event.clientX
      startScroll = element.scrollLeft
      element.setPointerCapture(pointer)
      element.dataset.dragging = 'true'
    }
    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointer) return
      event.preventDefault()
      element.scrollLeft = startScroll + startX - event.clientX
    }
    const end = () => {
      const id = pointer
      pointer = null
      delete element.dataset.dragging
      if (id !== null && element.hasPointerCapture(id)) element.releasePointerCapture(id)
    }
    element.addEventListener('pointerdown', down)
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerup', end)
    element.addEventListener('pointercancel', end)
    element.addEventListener('lostpointercapture', end)
    window.addEventListener('blur', end)
    return () => {
      end()
      element.removeEventListener('pointerdown', down)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerup', end)
      element.removeEventListener('pointercancel', end)
      element.removeEventListener('lostpointercapture', end)
      window.removeEventListener('blur', end)
    }
  }, [])

  return <div className="crew-horizontal">
    <div className="crew-horizontal__sticky">
      <div ref={viewport} className="crew-horizontal__viewport" role="region" aria-label={label} tabIndex={0}>
      <div className="crew-horizontal__track">
        {heading}
        {children}
      </div>
      </div>
    </div>
  </div>
}
