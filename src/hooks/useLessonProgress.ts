import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface LessonProgress {
  user_id: string
  lesson_id: string
  watched: boolean
  watched_at: string | null
  percent: number
}

export function useModuleProgress(moduleId: string | undefined) {
  const { user } = useAuth()
  const [progressByLessonId, setProgressByLessonId] = useState<Record<string, LessonProgress>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id || !moduleId) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)

    supabase
      .from('lesson_progress')
      .select('user_id, lesson_id, watched, watched_at, percent, lessons!inner(module_id)')
      .eq('user_id', user.id)
      .eq('lessons.module_id', moduleId)
      .then(({ data }) => {
        if (!active) return
        const byId: Record<string, LessonProgress> = {}
        ;(data ?? []).forEach((row) => {
          byId[row.lesson_id] = row as unknown as LessonProgress
        })
        setProgressByLessonId(byId)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user?.id, moduleId])

  return { progressByLessonId, loading }
}

export function useLessonProgress(lessonId: string | undefined) {
  const { user } = useAuth()
  const [progress, setProgress] = useState<LessonProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id || !lessonId) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)

    supabase
      .from('lesson_progress')
      .select('user_id, lesson_id, watched, watched_at, percent')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return
        setProgress(data as LessonProgress | null)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user?.id, lessonId])

  const markWatched = useCallback(async () => {
    if (!user?.id || !lessonId) return
    const next: LessonProgress = {
      user_id: user.id,
      lesson_id: lessonId,
      watched: true,
      watched_at: new Date().toISOString(),
      percent: 100,
    }
    const { error } = await supabase.from('lesson_progress').upsert(next, {
      onConflict: 'user_id,lesson_id',
    })
    if (!error) setProgress(next)
    return { error: error?.message ?? null }
  }, [user?.id, lessonId])

  const updatePercent = useCallback(
    async (percent: number) => {
      if (!user?.id || !lessonId) return
      const clamped = Math.max(0, Math.min(100, Math.round(percent)))
      const next: LessonProgress = {
        user_id: user.id,
        lesson_id: lessonId,
        watched: clamped >= 95,
        watched_at: clamped >= 95 ? new Date().toISOString() : (progress?.watched_at ?? null),
        percent: clamped,
      }
      const { error } = await supabase.from('lesson_progress').upsert(next, {
        onConflict: 'user_id,lesson_id',
      })
      if (!error) setProgress(next)
      return { error: error?.message ?? null }
    },
    [user?.id, lessonId, progress?.watched_at]
  )

  return { progress, loading, markWatched, updatePercent }
}
