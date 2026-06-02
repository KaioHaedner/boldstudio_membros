import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavButtons3DProps {
  onPrev?: () => void
  onNext?: () => void
  prevDisabled?: boolean
  nextDisabled?: boolean
  className?: string
}

// Botoes 3D (estilo "tecla") pra navegar entre aulas/modulos. Cores da Bold.
export function NavButtons3D({ onPrev, onNext, prevDisabled, nextDisabled, className }: NavButtons3DProps) {
  return (
    <div className={`flex justify-center gap-4 ${className ?? ''}`}>
      <button type="button" className="btn3d" onClick={onPrev} disabled={prevDisabled} aria-label="Anterior">
        <div className="btn3d-top">
          <ChevronLeft size={22} strokeWidth={3} />
        </div>
        <div className="btn3d-bottom" />
        <div className="btn3d-base" />
      </button>

      <button type="button" className="btn3d" onClick={onNext} disabled={nextDisabled} aria-label="Próximo">
        <div className="btn3d-top">
          <ChevronRight size={22} strokeWidth={3} />
        </div>
        <div className="btn3d-bottom" />
        <div className="btn3d-base" />
      </button>
    </div>
  )
}
