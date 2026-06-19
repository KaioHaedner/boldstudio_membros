import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/i18n/I18nContext'
import { LANGS } from '@/i18n/translations'

// Seletor de idioma com bandeiras (flagcdn). Dropdown compacto no Header.
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Selecionar idioma"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-bold-white/85 transition-colors hover:border-bold-yellow/50"
      >
        <img
          src={`https://flagcdn.com/${current.flag}.svg`}
          alt=""
          aria-hidden="true"
          className="h-3.5 w-5 rounded-[2px] object-cover"
        />
        <span className="text-xs font-bold">{current.label}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.4rem)] z-50 flex min-w-[9rem] flex-col gap-0.5 rounded-lg border border-white/10 bg-bold-gray/95 p-1.5 backdrop-blur-xl">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left transition-colors ${
                l.code === lang ? 'bg-bold-yellow/15 text-bold-yellow' : 'text-bold-white/80 hover:bg-white/5'
              }`}
            >
              <img
                src={`https://flagcdn.com/${l.flag}.svg`}
                alt=""
                aria-hidden="true"
                className="h-3.5 w-5 rounded-[2px] object-cover"
              />
              <span className="text-xs font-medium">{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
