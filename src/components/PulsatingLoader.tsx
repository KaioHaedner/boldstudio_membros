import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const STORAGE_KEY = 'bold_loader_exibido'
const DURATION_MS = 5000

// Loader de "pulsing dots" exibido em tela cheia por 5s APENAS no primeiro
// acesso da sessao. Navegacao interna nao reexibe (sessionStorage).
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

  const dots = [0, 0.3, 0.6]

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
      <div className="flex space-x-3">
        {dots.map((delay, i) =>
          reduzirMovimento ? (
            <div key={i} className="h-3 w-3 rounded-full" style={{ backgroundColor: '#FFD712' }} />
          ) : (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: '#FFD712' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, ease: 'easeInOut', repeat: Infinity, delay }}
            />
          )
        )}
      </div>
    </div>
  )
}
