import { cn } from '@/lib/utils'

// Vídeo do estúdio (Supabase Storage público). Fica nítido cobrindo a tela;
// o blur fica nos painéis de vidro por cima (form e título), não aqui.
const STUDIO_VIDEO_URL =
  'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/avatars/VD_BOLD_01.mp4'

export function StudioVideoBg({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-bold-black', className)}>
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={STUDIO_VIDEO_URL} type="video/mp4" />
      </video>
    </div>
  )
}
