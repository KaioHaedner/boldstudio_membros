import { useEffect, useState } from 'react'
import { ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/I18nContext'

const LINKS = [
  { href: '#home', key: 'home' },
  { href: '#sobre', key: 'sobre' },
  { href: '#servicos', key: 'servicos' },
  { href: '#crew', key: 'crew' },
  { href: '#cases', key: 'reels' },
  { href: '#processo', key: 'processo' },
  { href: '#clientes', key: 'clientes' },
  { href: '#contato', key: 'contato' },
] as const

// Acesso rapido: aba discreta na margem esquerda que abre atalhos para as
// secoes da home + "Ir ao Topo".
export function QuickNav() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  // So aparece depois que o usuario rola (o header, agora nao-fixo, ja saiu do topo).
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // No mobile so ativa a partir da 2a secao (#sobre) — no hero ele cobria
      // outros elementos. No desktop mantem o gatilho por rolagem da 1a tela.
      const isMobile = window.innerWidth <= 1000
      let active: boolean
      if (isMobile) {
        const sobre = document.querySelector('#sobre')
        active = sobre
          ? sobre.getBoundingClientRect().top <= window.innerHeight * 0.5
          : window.scrollY > window.innerHeight
      } else {
        active = window.scrollY > window.innerHeight * 0.6
      }
      setScrolled(active)
      if (!active) setOpen(false)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  function go(href: string) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }
  function toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <div
      className={cn(
        'quicknav-root fixed left-0 top-1/2 z-[90] flex -translate-y-1/2 items-center transition-all duration-300 ease-out',
        scrolled ? 'opacity-100' : 'pointer-events-none -translate-x-12 opacity-0'
      )}
    >
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          open ? 'w-44 opacity-100' : 'w-0 opacity-0'
        )}
      >
        <nav className="quicknav-panel flex w-44 flex-col gap-1 rounded-r-2xl border border-l-0 border-bold-yellow/20 bg-bold-gray p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
          <button
            type="button"
            onClick={toTop}
            className="flex items-center gap-2 rounded-lg bg-bold-yellow/15 px-3 py-2 text-sm font-semibold text-bold-yellow transition-colors hover:bg-bold-yellow/25"
          >
            <ArrowUp size={15} /> {t.quicknav.toTop}
          </button>
          <div className="my-1 h-px bg-white/10" />
          {LINKS.map((l) => (
            <button
              key={l.href}
              type="button"
              onClick={() => go(l.href)}
              className="rounded-lg px-3 py-2 text-left text-sm text-bold-white/80 transition-colors hover:bg-white/5 hover:text-bold-yellow"
            >
              {t.nav[l.key]}
            </button>
          ))}
        </nav>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t.quicknav.close : t.quicknav.open}
        aria-expanded={open}
        className={cn(
          'quicknav-toggle flex h-16 w-7 items-center justify-center rounded-r-lg bg-bold-yellow text-bold-black shadow-[0_8px_25px_-6px_rgba(255,215,18,0.6)] transition-all hover:w-8',
          !open && 'quicknav-tab'
        )}
      >
        {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </div>
  )
}
