import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const STORAGE_KEY = 'bold_loader_exibido'
const DURATION_MS = 5000

// 5 barras de equalizer com delays diferentes pra parecer visualizacao de audio.
const BARS = [0, 0.18, 0.36, 0.12, 0.28]
// alturas fixas pro modo sem animacao (perfil estatico de equalizer)
const ESTATICAS = [0.6, 0.95, 0.5, 1, 0.7]

// Loader de "equalizer" (barras de audio) exibido em tela cheia por 5s APENAS
// no primeiro acesso da sessao. Navegacao interna nao reexibe (sessionStorage).
export default function PulsatingLoader() {
  const [visivel, setVisivel] = useState(() => {
    if (typeof window === 'undefined') return false
    return !sessionStorage.getItem(STORAGE_KEY)
  })
  const reduzirMovimento = useReducedMotion()

  useEffect(() => {
    if (!visivel) return
    const timer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setVisivel(false)
    }, DURATION_MS)
    return () => clearTimeout(timer)
  }, [visivel])

  if (!visivel) return null

  return (
    <div
      role="status"
      aria-label="Carregando"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
    >
      <img
        src="/brand/logo-boldstudio.webp"
        alt="Bold Studio Brasil"
        className="mb-10 h-9 w-auto object-contain"
      />
      <div className="flex h-14 items-end gap-1.5">
        {BARS.map((delay, i) =>
          reduzirMovimento ? (
            <div
              key={i}
              className="w-2.5 rounded-full bg-bold-yellow"
              style={{ height: `${ESTATICAS[i] * 100}%` }}
            />
          ) : (
            <motion.div
              key={i}
              className="w-2.5 rounded-full bg-bold-yellow"
              style={{ height: '100%', transformOrigin: 'bottom' }}
              animate={{ scaleY: [0.3, 1, 0.45, 0.85, 0.3] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay }}
            />
          )
        )}
      </div>
    </div>
  )
}
