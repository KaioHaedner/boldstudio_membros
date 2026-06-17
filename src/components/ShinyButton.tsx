import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ShinyButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

// CTA com borda conica animada (estilo "shiny"). O CSS vive em src/index.css
// (.shiny-cta) — adaptado de styled-jsx/Next para CSS global do Vite.
// Usar APENAS no CTA principal de cada secao (max. 1 por tela).
export function ShinyButton({ children, onClick, className, type = 'button', disabled }: ShinyButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn('shiny-cta', className)}>
      <span>{children}</span>
    </button>
  )
}
