/** Signed position around an infinite carousel. Cards wrap only while hidden. */
export function slideOffset(index: number, progress: number, total: number) {
  if (total < 1) return 0
  const offset = ((index - progress) % total + total) % total
  return offset > total / 2 ? offset - total : offset
}

export function slideAppearance(offset: number) {
  const distance = Math.abs(offset)
  return {
    scale: Math.max(0.82, 1 - distance * 0.055),
    opacity: Math.max(0, Math.min(1, (2.5 - distance) * 2)),
    zIndex: Math.round(30 - distance * 4),
  }
}

export function slideIndex(progress: number, total: number) {
  return total > 0 ? ((Math.round(progress) % total) + total) % total : 0
}

/** One completed gesture selects one card; cancellations never select another. */
export function swipeTarget(start: number, distance: number, advance: boolean) {
  return Math.round(start) + (advance ? (distance < 0 ? 1 : -1) : 0)
}
