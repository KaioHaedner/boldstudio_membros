import { useEffect, useRef, type VideoHTMLAttributes } from 'react'
import { observeVideo } from '@/shared/lib/video-budget'
import { videoPreview } from '@/shared/lib/video-preview'

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'preload' | 'children'> & { src: string }

export function BudgetVideo({ src, autoPlay = false, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  // Decorative players never need the remote original. Resolve the local,
  // optimized clip here as a safety net for new callers, not only in pages.
  const source = autoPlay ? videoPreview(src) || src : src
  useEffect(() => {
    const video = ref.current
    if (!video) return
    return observeVideo(video, source, autoPlay)
  }, [source, autoPlay])
  // autoPlay is managed by the controller, not the HTML parser. preload=none
  // alone does not prevent downloading when the native autoplay flag is set.
  return <video {...props} ref={ref} preload="none" data-budget-video="true" />
}
