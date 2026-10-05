import { cn } from '@/shared/lib/utils'
import { media } from '@/shared/lib/media'
import { BudgetVideo } from '@/shared/components/BudgetVideo'
import { videoPreview } from '@/shared/lib/video-preview'

// Vídeo do estúdio, servido via proxy api.boldstudiobrasil.com (esconde o
// Supabase de origem). Fica nítido cobrindo a tela; o blur fica nos painéis
// de vidro por cima (form e título), não aqui.
const STUDIO_VIDEO_URL = media('avatars', 'VD_BOLD_01.mp4')

export function StudioVideoBg({ className }: { className?: string }) {
  const preview = videoPreview(STUDIO_VIDEO_URL)
  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-bold-black', className)}>
      <BudgetVideo
        src={preview || STUDIO_VIDEO_URL}
        className="h-full w-full object-cover"
        autoPlay={Boolean(preview)}
        muted
        loop
        playsInline
        poster="/brand/logo-boldstudio.webp"
        aria-hidden="true"
      />
    </div>
  )
}
