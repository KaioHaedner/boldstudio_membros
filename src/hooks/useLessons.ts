import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface LessonMaterial {
  label: string
  url: string
  type?: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  description: string | null
  panda_video_id: string | null
  materials: LessonMaterial[]
  display_order: number
  duration_sec: number | null
  active: boolean
}

export function useLessons(moduleId: string | undefined) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!moduleId) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)

    supabase
      .from('lessons')
      .select(
        'id, module_id, title, description, panda_video_id, materials, display_order, duration_sec, active'
      )
      .eq('module_id', moduleId)
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        if (error) setError(error.message)
        else setLessons((data ?? []) as Lesson[])
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [moduleId])

  return { lessons, loading, error }
}

export function useLesson(lessonId: string | undefined) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lessonId) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)

    supabase
      .from('lessons')
      .select(
        'id, module_id, title, description, panda_video_id, materials, display_order, duration_sec, active'
      )
      .eq('id', lessonId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        if (error) setError(error.message)
        else setLesson(data as Lesson | null)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [lessonId])

  return { lesson, loading, error }
}
