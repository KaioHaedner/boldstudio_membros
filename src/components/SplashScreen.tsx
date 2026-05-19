import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const SESSION_KEY = 'bold:splash-shown'
const SPLASH_DURATION_MS = 5000

interface SplashScreenProps {
  onFinish?: () => void
  forceShow?: boolean
}

export function SplashScreen({ onFinish, forceShow = false }: SplashScreenProps) {
  const [shouldShow, setShouldShow] = useState<boolean>(() => {
    if (forceShow) return true
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(SESSION_KEY) !== '1'
  })
  const [fadingOut, setFadingOut] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!shouldShow) return
    const timer = window.setTimeout(() => {
      setFadingOut(true)
      window.setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, '1')
        setShouldShow(false)
        onFinish?.()
      }, 400)
    }, SPLASH_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [shouldShow, onFinish])

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
