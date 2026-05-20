import { useEffect, useState } from 'react'
import { checkPwnedPassword } from '@/lib/hibp'

export type PwnedStatus = 'idle' | 'checking' | 'safe' | 'pwned' | 'error'

export interface PwnedResult {
  status: PwnedStatus
  count: number
}

export function usePwnedCheck(password: string, debounceMs = 600): PwnedResult {
  const [result, setResult] = useState<PwnedResult>({ status: 'idle', count: 0 })

  useEffect(() => {
    if (!password || password.length < 4) {
      setResult({ status: 'idle', count: 0 })
      return
    }

    setResult({ status: 'checking', count: 0 })
    const timer = window.setTimeout(async () => {
      const count = await checkPwnedPassword(password)
      if (count < 0) setResult({ status: 'error', count: 0 })
      else if (count === 0) setResult({ status: 'safe', count: 0 })
      else setResult({ status: 'pwned', count })
    }, debounceMs)

    return () => window.clearTimeout(timer)
  }, [password, debounceMs])

  return result
}
