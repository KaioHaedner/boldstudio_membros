import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoaderProps {
  fullscreen?: boolean
  size?: number
  label?: string
}

export function Loader({ fullscreen = false, size = 32, label }: LoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-bold-yellow',
        fullscreen && 'fixed inset-0 z-40 bg-bold-black/95'
      )}
    >
      <Loader2 className="animate-spin" size={size} />
      {label && <span className="text-sm text-bold-white/70">{label}</span>}
    </div>
  )
}
