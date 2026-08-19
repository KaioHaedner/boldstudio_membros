import { useEffect, useState } from 'react'

interface Geo {
  city: string
  region: string
  country: string
  timezone: string
}

// Localização (via IP do visitante) + relógio ao vivo, pequeno, embaixo da
// logo no canto esquerdo do header (a pedido do cliente, 2026-08-18).
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
      className="pointer-events-none hidden items-center gap-1.5 whitespace-nowrap text-[0.6rem] font-bold uppercase tracking-[0.14em] text-bold-yellow/80 lg:flex"
    >
      <span>{place}</span>
      <span className="h-2 w-px bg-bold-yellow/30" />
      <span>
        {weekday} {time}
      </span>
    </div>
  )
}
