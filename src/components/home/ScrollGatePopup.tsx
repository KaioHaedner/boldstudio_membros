import { X } from 'lucide-react'
import { ShinyButton } from '@/components/ShinyButton'

type ScrollGatePopupProps = {
  open: boolean
  title: string
  subtitle: string
  buttonLabel: string
  secondsLeft: number
  onAccept: () => void
  onSkip: () => void
}

// Popup no estilo da marca (preto + amarelo Bold) usado pelo useScrollGate.
// X ou clique fora = usuario quer acelerar (pula direto pra proxima secao,
// mesmo comportamento de deixar o tempo acabar sem responder).
export function ScrollGatePopup({
  open,
  title,
  subtitle,
  buttonLabel,
  secondsLeft,
  onAccept,
  onSkip,
}: ScrollGatePopupProps) {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onSkip}
      className="pointer-events-auto fixed inset-0 z-[200] flex items-center justify-center bg-bold-black/80 px-6 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-bold-yellow/30 bg-bold-gray p-8 text-center shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)]"
      >
        <button
          type="button"
          onClick={onSkip}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-bold-white/50 transition-colors hover:text-bold-yellow"
        >
          <X size={20} />
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-bold-yellow">{subtitle}</p>
        <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-bold-white sm:text-3xl">
          {title}
        </h3>
        <div className="mt-7 flex justify-center">
          <ShinyButton onClick={onAccept}>{buttonLabel}</ShinyButton>
        </div>
        <p className="mt-5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-bold-white/40">
          Continuando em {secondsLeft}s...
        </p>
      </div>
    </div>
  )
}
