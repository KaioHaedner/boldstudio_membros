import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'bold_cookie_consent'

type Consent = {
  essential: true
  functional: boolean
  analytics: boolean
  ts: number
}

function Toggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <label className={`flex items-start justify-between gap-4 ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
      <span>
        <span className="block text-sm font-semibold text-bold-white">{label}</span>
        <span className="block text-xs text-bold-white/55">{description}</span>
      </span>
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? 'bg-bold-yellow' : 'bg-bold-white/20'
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-bold-black transition-transform ${checked ? 'translate-x-4' : ''}`}
        />
      </span>
    </label>
  )
}

export function CookieBar() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return !localStorage.getItem(STORAGE_KEY)
    } catch {
      return true
    }
  })
  const [managing, setManaging] = useState(false)
  const [functional, setFunctional] = useState(true)
  const [analytics, setAnalytics] = useState(false)

  function persist(consent: Omit<Consent, 'ts'>) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consent, ts: Date.now() }))
    } catch {
      /* localStorage indisponivel: apenas fecha a barra nesta sessao */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4">
      <div className="liquid-glass mx-auto max-w-3xl rounded-2xl p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 shrink-0 text-bold-yellow" size={22} />
          <div className="flex-1">
            <p className="text-sm font-bold text-bold-white">A gente usa cookies</p>
            <p className="mt-1 text-xs text-bold-white/60">
              Usamos cookies essenciais para o site funcionar e, com sua permissão, cookies funcionais e
              analíticos para melhorar sua experiência. Saiba mais na{' '}
              <Link to="/cookies" className="text-bold-yellow hover:underline">Política de Cookies</Link>.
            </p>
          </div>
        </div>

        {managing && (
          <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
            <Toggle
              label="Essenciais"
              description="Necessários para o site funcionar. Sempre ativos."
              checked
              disabled
            />
            <Toggle
              label="Funcionais"
              description="Lembram suas preferências e melhoram a experiência."
              checked={functional}
              onChange={setFunctional}
            />
            <Toggle
              label="Analíticos"
              description="Ajudam a entender o uso do site, de forma agregada."
              checked={analytics}
              onChange={setAnalytics}
            />
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {!managing ? (
            <>
              <button
                type="button"
                onClick={() => setManaging(true)}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-bold-white/80 transition-colors hover:border-bold-yellow/50 hover:text-bold-yellow"
              >
                Gerenciar
              </button>
              <button
                type="button"
                onClick={() => persist({ essential: true, functional: true, analytics: true })}
                className="rounded-full bg-bold-yellow px-5 py-2.5 text-sm font-bold text-bold-black transition-transform hover:scale-[1.02]"
              >
                Aceitar todos
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => persist({ essential: true, functional: false, analytics: false })}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-bold-white/80 transition-colors hover:border-bold-yellow/50 hover:text-bold-yellow"
              >
                Só essenciais
              </button>
              <button
                type="button"
                onClick={() => persist({ essential: true, functional, analytics })}
                className="rounded-full bg-bold-yellow px-5 py-2.5 text-sm font-bold text-bold-black transition-transform hover:scale-[1.02]"
              >
                Salvar preferências
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
