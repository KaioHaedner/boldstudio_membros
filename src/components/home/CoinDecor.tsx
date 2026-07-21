import { cn } from '@/lib/utils'

export const COIN_IMG =
  'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/brand/BOLDSTUDIO_COIN.webp'

interface CoinDecorProps {
  /** Posição/tamanho/opacidade via utilitários Tailwind (absolute). */
  className?: string
  /** Rotação estática em graus. */
  rotate?: number
  /** Duração do float, em segundos (varia pra não ficar sincronizado). */
  floatDuration?: number
}

// Símbolo da BoldStudio usado como elemento decorativo espalhado pelo site.
// Fica atrás do conteúdo (pointer-events-none) e flutua suavemente.
export function CoinDecor({ className, rotate = 0, floatDuration = 7 }: CoinDecorProps) {
  return (
    <img
      src={COIN_IMG}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={cn('coin-bob pointer-events-none absolute select-none', className)}
      style={{ rotate: `${rotate}deg`, animationDuration: `${floatDuration}s` }}
    />
  )
}
