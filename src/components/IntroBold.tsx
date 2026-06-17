import { useEffect, useRef, useState } from 'react'

// Quais cubos (indices 0..14, grade 3x5) ficam ACESOS em cada digito.
const DIGIT_MAPS: Record<number, number[]> = {
  3: [0, 1, 2, 5, 6, 7, 8, 11, 12, 13, 14],
  2: [0, 1, 2, 5, 6, 7, 8, 9, 12, 13, 14],
  1: [1, 3, 4, 7, 10, 12, 13, 14],
}

const EQ_DELAYS = [0, 0.18, 0.36, 0.12, 0.28]

type Phase = 'contando' | 'frase' | 'carregando' | 'saindo'

const prefersReduce =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Intro/abertura da home institucional: contador 3-2-1 com cubos 3D,
// transicao "Solta o Rec", logo + carregando, e some revelando a home.
// Roda 1x por sessao (sessionStorage). Sempre termina (timeout de seguranca).
export function IntroBold({ onFinish }: { onFinish?: () => void }) {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return !sessionStorage.getItem('bold_intro_exibida')
    } catch {
      return false
    }
  })
  const [phase, setPhase] = useState<Phase>(prefersReduce ? 'carregando' : 'contando')
  const [digito, setDigito] = useState(3)
  const onFinishRef = useRef(onFinish)
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    if (!show) return

    const timers: number[] = []
    const finish = () => {
      try {
        sessionStorage.setItem('bold_intro_exibida', '1')
      } catch {
        /* ignora */
      }
      onFinishRef.current?.()
      setShow(false)
    }

    if (prefersReduce) {
      // Versao curta e estatica: mostra logo/carregando e abre a home.
      timers.push(window.setTimeout(finish, 1400))
      return () => timers.forEach(clearTimeout)
    }

    // Timeline (~10s): 3 -> 2 -> 1 -> frase (Solta/O/Rec um a um) -> carregando -> sai
    timers.push(window.setTimeout(() => setDigito(2), 1200))
    timers.push(window.setTimeout(() => setDigito(1), 2400))
    timers.push(window.setTimeout(() => setPhase('frase'), 3600))
    timers.push(window.setTimeout(() => setPhase('carregando'), 7600))
    timers.push(window.setTimeout(() => setPhase('saindo'), 9400))
    timers.push(window.setTimeout(finish, 10000))
    // Timeout de seguranca: nunca deixar o usuario preso na intro.
    timers.push(window.setTimeout(finish, 12000))

    return () => timers.forEach(clearTimeout)
  }, [show])

  if (!show) return null

  const acesos = new Set(DIGIT_MAPS[digito] ?? [])

  return (
    <div
      role="status"
      aria-label="Carregando"
      className={`intro-overlay ${phase === 'saindo' ? 'intro-saindo' : ''}`}
    >
      {(phase === 'contando' || phase === 'frase') && (
        <div className={`intro-grid ${phase === 'frase' ? 'cubos-saindo' : ''}`}>
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className={`intro-cube ${acesos.has(i) ? 'on' : 'off'}`}>
              <div className="face face-on" />
              <div className="face face-off" />
            </div>
          ))}
        </div>
      )}

      {phase === 'frase' && (
        <div className="intro-frase">
          <span style={{ animationDelay: '0s' }}>SOLTA</span>
          <span className="intro-frase-o" style={{ animationDelay: '0.9s' }}>O</span>
          <span style={{ animationDelay: '1.8s' }}>REC</span>
        </div>
      )}

      {phase === 'carregando' && (
        <div className="intro-carregando">
          <img src="/brand/logo-boldstudio.webp" alt="Bold Studio Brasil" />
          <div className="intro-eq" aria-hidden="true">
            {EQ_DELAYS.map((d, i) => (
              <span key={i} style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
          <p>Carregando sua experiência Bold</p>
        </div>
      )}
    </div>
  )
}
