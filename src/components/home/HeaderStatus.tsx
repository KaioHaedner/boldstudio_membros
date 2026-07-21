import { useEffect, useState } from 'react'

interface Geo {
  city: string
  region: string
  country: string
  timezone: string
}

// Localização (via IP do visitante) + relógio ao vivo, centralizado no header.
// Fica só no desktop (lg+); no mobile não há espaço entre logo e menu.
export function HeaderStatus() {
  const [geo, setGeo] = useState<Geo | null>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let cancelled = false
    fetch('https://ipwho.is/')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data || data.success === false) return
        setGeo({
          city: data.city ?? '',
          region: data.region_code ?? data.region ?? '',
          country: data.country_code ?? '',
          timezone: data.timezone?.id ?? data.timezone ?? undefined,
        })
      })
      .catch(() => {
        /* geo indisponível: componente simplesmente não aparece */
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  if (!geo || !geo.city) return null

  const tz = geo.timezone || undefined
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: tz })
    .format(now)
    .replace('.', '')
    .toUpperCase()
  const time = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz,
  }).format(now)
  const place = [geo.city, geo.region, geo.country]
    .filter(Boolean)
    .join(' · ')
    .toUpperCase()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full border border-bold-yellow/25 bg-black/35 px-5 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-bold-yellow shadow-[0_12px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-saturate-150 lg:flex"
    >
      <span>{place}</span>
      <span className="h-3 w-px bg-bold-yellow/30" />
      <span>
        {weekday} {time}
      </span>
    </div>
  )
}
