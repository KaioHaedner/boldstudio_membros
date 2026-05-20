import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Module {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  display_order: number
  active: boolean
}

export function useModules() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    supabase
      .from('modules')
      .select('id, title, description, cover_url, display_order, active')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        if (error) setError(error.message)
        else setModules((data ?? []) as Module[])
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { modules, loading, error }
}

export function useModule(moduleId: string | undefined) {
  const [module, setModule] = useState<Module | null>(null)
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
      .from('modules')
      .select('id, title, description, cover_url, display_order, active')
      .eq('id', moduleId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        if (error) setError(error.message)
        else setModule(data as Module | null)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [moduleId])

  return { module, loading, error }
}
