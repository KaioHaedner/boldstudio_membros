import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Play } from 'lucide-react'
import { IPhoneFrame } from '@/shared/components/IPhoneFrame'

export type ServiceFilm = {
  id: string; title: string; logo?: string; poster: string; src: string; format: 'vertical' | 'horizontal'
  description?: string; duration?: number; uploadDate?: string; caption?: string
  variants?: { src: string; width: number; height: number; bytes: number }[]
}

function Film({ film, playing, onPlay, onStop }: { film: ServiceFilm; playing: boolean; onPlay: () => void; onStop: () => void }) {
  const container = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [quality, setQuality] = useState('auto')
  const [source, setSource] = useState(film.src)
  const [error, setError] = useState('')
  const variants = film.variants ?? []
  const hlsSource = source.endsWith('.m3u8')
  const nativeHls = typeof document !== 'undefined' && !!document.createElement('video').canPlayType('application/vnd.apple.mpegurl')
  useEffect(() => {
    if (!playing || !container.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) onStop()
    })
    observer.observe(container.current)
    const visibility = () => { if (document.hidden) onStop() }
    const player = video.current
    let cancelled = false
    let hls: import('hls.js').default | undefined
    if (player && hlsSource && !nativeHls) {
      // Only import the streaming runtime and fetch segments after a play click.
      void import('hls.js').then(({ default: Hls }) => {
        if (cancelled) return
        if (!Hls.isSupported()) throw new Error('HLS unavailable')
        hls = new Hls({ maxBufferLength: 12, maxMaxBufferLength: 24, backBufferLength: 0, maxBufferSize: 8 * 1024 * 1024 })
        hls.on(Hls.Events.MANIFEST_PARSED, () => { if (!cancelled) void player.play().catch(() => {}) })
        hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal && !cancelled) { setError('Não foi possível reproduzir. Tente outra qualidade.'); onStop() } })
        hls.attachMedia(player)
        hls.loadSource(source)
      }).catch(() => { if (!cancelled) { setError('Não foi possível reproduzir. Tente outra qualidade.'); onStop() } })
    }
    document.addEventListener('visibilitychange', visibility)
    return () => {
      observer.disconnect(); document.removeEventListener('visibilitychange', visibility)
      cancelled = true
      hls?.destroy()
      if (player) { player.pause(); player.removeAttribute('src'); player.load() }
    }
  }, [playing, onStop, source, hlsSource, nativeHls])
  return <div ref={container} className={`service-film service-film--${film.format}`}>
    {playing ? <video ref={video} src={hlsSource && !nativeHls ? undefined : source} preload="none" poster={film.poster} aria-label={film.title} controls playsInline onError={() => { setError('Não foi possível reproduzir. Tente outra qualidade.'); onStop() }} /> :
      <button type="button" onClick={() => {
        const automatic = film.format === 'vertical' || matchMedia('(max-width: 767px)').matches ? variants[0]?.src : film.src
        const nextSource = quality === 'auto' ? automatic ?? film.src : quality
        // Mount and request playback inside the user's gesture (also on Safari).
        flushSync(() => { setError(''); setSource(nextSource); onPlay() })
        void video.current?.play().catch(() => {})
      }} aria-label={`Reproduzir ${film.title}`}>
        <img src={film.poster} alt="" loading="lazy" decoding="async" />
        <span className="service-film__play"><Play size={28} fill="currentColor" aria-hidden="true" /></span>
      </button>}
    {error && <span role="alert" className="service-film__error">{error}</span>}
    {film.format === 'horizontal' && variants.length > 1 && <label className="service-film__quality">
      <span className="sr-only">Qualidade de {film.title}</span>
      <select aria-label={`Qualidade de ${film.title}`} value={quality} onChange={event => { onStop(); setQuality(event.target.value) }}>
        <option value="auto">Auto</option>
        {variants.map(variant => <option key={variant.src} value={variant.src}>{Math.min(variant.width,variant.height) >= 2160 ? '4K' : `${Math.min(variant.width,variant.height)}p`}</option>)}
      </select>
    </label>}
  </div>
}

export function ServiceShowcase({ films, title, pageUrl }: { films: ServiceFilm[]; title: string; pageUrl?: string }) {
  const vertical = films.filter(film => film.format === 'vertical')
  const horizontal = films.filter(film => film.format === 'horizontal')
  const [selected, setSelected] = useState(0)
  // One mounted player at a time: selecting another stops the previous transfer.
  const [playing, setPlaying] = useState<string | null>(null)
  const stop = useCallback(() => setPlaying(null), [])
  const active = horizontal[Math.min(selected, horizontal.length - 1)]
  const structured = horizontal.filter(film => film.description && film.duration && film.uploadDate).map(film => ({
    '@context': 'https://schema.org', '@type': 'VideoObject', '@id': pageUrl ? `${pageUrl}#${film.id}` : undefined, name: film.title,
    description: film.description, thumbnailUrl: `https://boldstudiobrasil.com${film.poster}`,
    contentUrl: `https://boldstudiobrasil.com${film.src}`, uploadDate: film.uploadDate,
    duration: `PT${Math.round(film.duration!)}S`, creator: { '@type': 'Organization', name: 'Bold Studio Brasil' },
  }))
  if (!films.length) return null
  return <section className="service-showcase">
    {structured.length > 0 && <script type="application/ld+json">{JSON.stringify(structured).replace(/</g, '\\u003c')}</script>}
    <h2 className="text-center text-sm font-bold uppercase tracking-[.25em]">{title}</h2>
    {vertical.length > 0 && <div className="service-showcase__phones">
      {vertical.map(film => <figure key={film.id}>
        <IPhoneFrame><div className="device-screen service-phone-screen"><Film film={film} playing={playing === `phone-${film.id}`} onPlay={() => setPlaying(`phone-${film.id}`)} onStop={stop} /></div></IPhoneFrame>
        <figcaption>{film.logo ? <><img className="service-client-logo" src={film.logo} alt={film.title} loading="lazy" />{film.caption && <span className="service-client-detail">{film.caption}</span>}</> : film.title}</figcaption>
      </figure>)}
    </div>}
    {active && <>
      <div className="service-showcase__wide"><Film key={active.id} film={active} playing={playing === `wide-${active.id}`} onPlay={() => setPlaying(`wide-${active.id}`)} onStop={stop} /></div>
      <div className="service-showcase__choices" aria-label="Selecionar trabalho">
        {horizontal.map((film, index) => <button type="button" key={film.id} aria-label={film.title} aria-pressed={active.id === film.id} onClick={() => { setPlaying(null); setSelected(index) }}>{film.logo ? <><img className="service-client-logo" src={film.logo} alt="" loading="lazy" />{film.caption && <span className="service-client-detail">{film.caption}</span>}</> : film.title}</button>)}
      </div>
    </>}
  </section>
}
