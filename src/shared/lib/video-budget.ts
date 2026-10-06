// DOM controller shared by the React players and covered with fake-DOM tests.
// No src until the video is visible. Pausing retains the browser's buffer/cache.
const owners = new WeakMap<HTMLVideoElement, object>()

export function observeVideo(video: HTMLVideoElement, src: string, autoplay: boolean) {
  const owner = {}
  owners.set(video, owner)
  // Source changes release the old transfer; reconnecting this same element
  // with the same URL (React StrictMode/effect changes) retains its buffer.
  if (video.getAttribute('src') && video.getAttribute('src') !== src) {
    video.removeAttribute('src')
    video.load()
  }
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
    if (video.getAttribute('src') !== src) video.setAttribute('src', src)
    if (autoplay && !economical) void video.play().catch(() => {})
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    sync()
  }, { threshold: 0.15 })
  observer.observe(video)
  document.addEventListener('visibilitychange', sync)
  let disposed = false
  return () => {
    if (disposed) return
    disposed = true
    observer.disconnect()
    document.removeEventListener('visibilitychange', sync)
    video.pause()
    // React can reconnect an effect synchronously. Wait one microtask before
    // unloading so its development double mount cannot restart the download.
    queueMicrotask(() => {
      if (owners.get(video) !== owner) return
      owners.delete(video)
      video.removeAttribute('src')
      video.load()
    })
  }
}
