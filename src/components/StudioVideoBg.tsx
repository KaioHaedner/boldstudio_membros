import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// Vídeo do estúdio, servido via proxy api.boldstudiobrasil.com (esconde o
// Supabase de origem). Fica nítido cobrindo a tela; o blur fica nos painéis
// de vidro por cima (form e título), não aqui.
const STUDIO_VIDEO_URL = 'https://api.boldstudiobrasil.com/api/media?b=avatars&f=VD_BOLD_01.mp4'

const MAX_RETRIES = 3

export function StudioVideoBg({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // O Supabase de origem (antigo, sem acesso ao dashboard) falha de forma
    // intermitente. O <video> nao tenta de novo por conta propria quando a
    // primeira carga falha — sem isso ele fica travado mostrando nada.
    let retries = 0
    const onError = () => {
      if (retries >= MAX_RETRIES) return
      retries += 1
      window.setTimeout(() => video.load(), 500 * retries)
    }
    video.addEventListener('error', onError)
    video.addEventListener('stalled', onError)
    return () => {
      video.removeEventListener('error', onError)
      video.removeEventListener('stalled', onError)
    }
  }, [])

  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-bold-black', className)}>
      <video
        ref={videoRef}
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
