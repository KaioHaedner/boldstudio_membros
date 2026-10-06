const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// A custom overlay needs the same keyboard/scroll lifecycle as a modal. This
// does not change its visual styling or its existing open/close actions.
export function bindDialogBehavior(panel: HTMLElement, close: () => void): () => void {
  const previousFocus = document.activeElement as HTMLElement | null
  const previousOverflow = document.body.style.overflow
  const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
    .filter((element) => element.tabIndex >= 0 && !element.closest('[inert], [hidden]'))

  document.body.style.overflow = 'hidden'
  ;(focusables()[0] ?? panel).focus({ preventScroll: true })

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }
    if (event.key !== 'Tab') return
    const elements = focusables()
    const first = elements[0] ?? panel
    const last = elements.at(-1) ?? panel
    if (!panel.contains(document.activeElement) || elements.length === 0) {
      event.preventDefault()
      ;(event.shiftKey ? last : first).focus({ preventScroll: true })
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus({ preventScroll: true })
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus({ preventScroll: true })
    }
  }
  document.addEventListener('keydown', onKeyDown)

  return () => {
    document.removeEventListener('keydown', onKeyDown)
    document.body.style.overflow = previousOverflow
    if (previousFocus?.isConnected) previousFocus.focus?.({ preventScroll: true })
  }
}
