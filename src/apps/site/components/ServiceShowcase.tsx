import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Play } from 'lucide-react'
import { IPhoneFrame } from '@/shared/components/IPhoneFrame'

export type ServiceFilm = { id: string; title: string; logo?: string; poster: string; src: string; format: 'vertical' | 'horizontal' }

function Film({ film, playing, onPlay, onStop }: { film: ServiceFilm; playing: boolean; onPlay: () => void; onStop: () => void }) {
  const container = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (!playing || !container.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) onStop()
    })
    observer.observe(container.current)
    const visibility = () => { if (document.hidden) onStop() }
    const player = video.current
    document.addEventListener('visibilitychange', visibility)
    return () => {
      observer.disconnect(); document.removeEventListener('visibilitychange', visibility)
      if (player) { player.pause(); player.removeAttribute('src'); player.load() }
    }
  }, [playing, onStop])
  return <div ref={container} className={`service-film service-film--${film.format}`}>
    {playing ? <video ref={video} src={film.src} preload="none" poster={film.poster} aria-label={film.title} controls playsInline /> :
      <button type="button" onClick={() => {
        // Mount and request playback inside the user's gesture (also on Safari).
        flushSync(onPlay)
        void video.current?.play().catch(() => {})
      }} aria-label={`Reproduzir ${film.title}`}>
        <img src={film.poster} alt="" loading="lazy" decoding="async" />
        <span className="service-film__play"><Play size={28} fill="currentColor" aria-hidden="true" /></span>
      </button>}
  </div>
}

export function ServiceShowcase({ films, title }: { films: ServiceFilm[]; title: string }) {
  const vertical = films.filter(film => film.format === 'vertical')
  const horizontal = films.filter(film => film.format === 'horizontal')
  const [selected, setSelected] = useState(0)
  // One mounted player at a time: selecting another stops the previous transfer.
  const [playing, setPlaying] = useState<string | null>(null)
  const stop = useCallback(() => setPlaying(null), [])
  const active = horizontal[Math.min(selected, horizontal.length - 1)]
  if (!films.length) return null
  return <section className="service-showcase">
    <h2 className="text-center text-sm font-bold uppercase tracking-[.25em]">{title}</h2>
    {vertical.length > 0 && <div className="service-showcase__phones">
      {vertical.map(film => <figure key={film.id}>
        <IPhoneFrame><div className="device-screen service-phone-screen"><Film film={film} playing={playing === `phone-${film.id}`} onPlay={() => setPlaying(`phone-${film.id}`)} onStop={stop} /></div></IPhoneFrame>
        <figcaption>{film.logo ? <img className="service-client-logo" src={film.logo} alt={film.title} loading="lazy" /> : film.title}</figcaption>
      </figure>)}
    </div>}
    {active && <>
      <div className="service-showcase__wide"><Film key={active.id} film={active} playing={playing === `wide-${active.id}`} onPlay={() => setPlaying(`wide-${active.id}`)} onStop={stop} /></div>
      <div className="service-showcase__choices" aria-label="Selecionar trabalho">
        {horizontal.map((film, index) => <button type="button" key={film.id} aria-label={film.title} aria-pressed={active.id === film.id} onClick={() => { setPlaying(null); setSelected(index) }}>{film.logo ? <img className="service-client-logo" src={film.logo} alt="" loading="lazy" /> : film.title}</button>)}
      </div>
    </>}
  </section>
}
