import { useEffect, useRef, type VideoHTMLAttributes } from 'react'
import { observeVideo } from '@/shared/lib/video-budget'

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'preload' | 'children'> & { src: string }

export function BudgetVideo({ src, autoPlay = false, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    return observeVideo(video, src, autoPlay)
  }, [src, autoPlay])
  // autoPlay is managed by the controller, not the HTML parser. preload=none
  // alone does not prevent downloading when the native autoplay flag is set.
  return <video {...props} ref={ref} preload="none" data-budget-video="true" />
}
