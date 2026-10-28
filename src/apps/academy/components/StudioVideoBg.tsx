import { cn } from '@/shared/lib/utils'
import { BudgetVideo } from '@/shared/components/BudgetVideo'

// Trecho estático de 10s, copiado do melhor arquivo recuperado sem recodificar.
// Preserva os 1276 × 720 originais e usa o controle de visibilidade do BudgetVideo.
const STUDIO_VIDEO_URL = '/media/previews/bold-studio-hero-hq-720-v1.mp4'

export function StudioVideoBg({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-bold-black', className)}>
      <BudgetVideo
        src={STUDIO_VIDEO_URL}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/brand/logo-boldstudio.webp"
        aria-hidden="true"
      />
    </div>
  )
}
