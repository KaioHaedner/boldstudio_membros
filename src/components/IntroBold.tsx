import { useEffect, useRef, useState } from 'react'

type Phase = 'carregando' | 'frase' | 'saindo'

const prefersReduce =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Intro/abertura da home institucional:
// 1) efeito 3D "carregando" (moeda girando) por ~3s
// 2) frase "Solta o Rec"
// 3) some revelando a home.
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
  const [phase, setPhase] = useState<Phase>('carregando')
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
      // Versao curta e estatica: mostra o carregando e abre a home.
      timers.push(window.setTimeout(finish, 1400))
      return () => timers.forEach(clearTimeout)
    }

    // Timeline (~6.3s): carregando (efeito 3D, 3s) -> frase (Solta/O/Rec) -> sai
    timers.push(window.setTimeout(() => setPhase('frase'), 3000))
    timers.push(window.setTimeout(() => setPhase('saindo'), 5800))
    timers.push(window.setTimeout(finish, 6300))
    // Timeout de seguranca: nunca deixar o usuario preso na intro.
    timers.push(window.setTimeout(finish, 8000))

    return () => timers.forEach(clearTimeout)
  }, [show])

  if (!show) return null

  return (
    <div
      role="status"
      aria-label="Carregando"
      className={`intro-overlay ${phase === 'saindo' ? 'intro-saindo' : ''}`}
    >
      {phase === 'carregando' && (
        <div className="intro-carregando">
          <img
            className="intro-coin"
            src="/brand/moeda-3d.webp"
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <img src="/brand/logo-boldstudio.webp" alt="Bold Studio Brasil" />
          <p>Carregando sua experiência Bold</p>
        </div>
      )}

      {phase === 'frase' && (
        <div className="intro-frase">
          <span style={{ animationDelay: '0s' }}>SOLTA</span>
          <span className="intro-frase-o" style={{ animationDelay: '0.9s' }}>O</span>
          <span className="intro-rec-line" style={{ animationDelay: '1.8s' }}>
            <span className="intro-rec-led" aria-hidden="true" />
            REC
          </span>
        </div>
      )}
    </div>
  )
}
