// DOM controller shared by the React players and covered with fake-DOM tests.
// No src until the video is visible. Pausing retains the browser's buffer/cache.
export function observeVideo(video: HTMLVideoElement, src: string, autoplay: boolean) {
  let visible = false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  const economical = connection?.saveData || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const sync = () => {
    if (!visible || document.hidden) {
      video.pause()
      return
    }
    // Decorative players keep their poster in data-saving/reduced-motion mode.
    if (autoplay && economical && !video.controls) return
    if (!video.getAttribute('src')) video.setAttribute('src', src)
    if (autoplay && !economical) void video.play().catch(() => {})
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    sync()
  }, { threshold: 0.15 })
  observer.observe(video)
  document.addEventListener('visibilitychange', sync)
  return () => {
    observer.disconnect()
    document.removeEventListener('visibilitychange', sync)
    video.pause()
    video.removeAttribute('src')
    video.load()
  }
}
