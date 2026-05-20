import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const DEFAULT_STORAGE_KEY = 'bold:splash-shown'
const DEFAULT_DURATION_MS = 5000

interface SplashScreenProps {
  onFinish?: () => void
  forceShow?: boolean
  storageKey?: string
  durationMs?: number
}

export function SplashScreen({
  onFinish,
  forceShow = false,
  storageKey = DEFAULT_STORAGE_KEY,
  durationMs = DEFAULT_DURATION_MS,
}: SplashScreenProps) {
  const [shouldShow, setShouldShow] = useState<boolean>(() => {
    if (forceShow) return true
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(storageKey) !== '1'
  })
  const [fadingOut, setFadingOut] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!shouldShow) return
    const timer = window.setTimeout(() => {
      setFadingOut(true)
      window.setTimeout(() => {
        sessionStorage.setItem(storageKey, '1')
        setShouldShow(false)
        onFinish?.()
      }, 400)
    }, durationMs)

    return () => window.clearTimeout(timer)
  }, [shouldShow, onFinish, storageKey, durationMs])

  if (!shouldShow) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-bold-black transition-opacity duration-500',
        fadingOut ? 'opacity-0' : 'opacity-100'
      )}
      aria-hidden={fadingOut}
    >
      <video
        ref={videoRef}
        src="/brand/loader.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="w-[min(60vw,520px)] h-auto"
      />
    </div>
  )
}
