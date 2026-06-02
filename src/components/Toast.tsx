import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastData {
  id: number
  type: ToastType
  title: string
  message?: string
}

interface ToastContextValue {
  notify: (type: ToastType, title: string, message?: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>')
  return ctx
}

// Cores por tipo de efeito
const STYLES: Record<ToastType, { icon: typeof CheckCircle2; box: string; bar: string }> = {
  success: { icon: CheckCircle2, box: 'border-green-500/40 bg-green-500/12', bar: 'bg-green-500' },
  error: { icon: XCircle, box: 'border-red-500/40 bg-red-500/12', bar: 'bg-red-500' },
  info: { icon: Info, box: 'border-bold-yellow/40 bg-bold-yellow/12', bar: 'bg-bold-yellow' },
  warning: { icon: AlertTriangle, box: 'border-amber-500/40 bg-amber-500/12', bar: 'bg-amber-500' },
}

const ICON_COLOR: Record<ToastType, string> = {
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-bold-yellow',
  warning: 'text-amber-400',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const notify = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, type, title, message }])
      setTimeout(() => remove(id), 4500)
    },
    [remove]
  )

  const value: ToastContextValue = {
    notify,
    success: (t, m) => notify('success', t, m),
    error: (t, m) => notify('error', t, m),
    info: (t, m) => notify('info', t, m),
    warning: (t, m) => notify('warning', t, m),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)] pointer-events-none">
        {toasts.map((t) => {
          const s = STYLES[t.type]
          const Icon = s.icon
          return (
            <div
              key={t.id}
              className={`pointer-events-auto relative overflow-hidden rounded-lg border backdrop-blur-md p-3.5 pr-9 shadow-xl flex items-start gap-2.5 animate-toast-in ${s.box}`}
            >
              <Icon size={18} className={`shrink-0 mt-0.5 ${ICON_COLOR[t.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-bold-white">{t.title}</p>
                {t.message && <p className="text-xs text-bold-white/70 mt-0.5">{t.message}</p>}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="absolute top-2.5 right-2.5 text-bold-white/40 hover:text-bold-white transition"
                aria-label="Fechar"
              >
                <X size={14} />
              </button>
              <span className={`absolute bottom-0 left-0 h-0.5 ${s.bar} animate-toast-bar`} />
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
