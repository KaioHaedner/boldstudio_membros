import { useState, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react'
import type { PwnedResult } from '@/hooks/usePwnedCheck'

interface PasswordInputProps {
  label: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  required?: boolean
  placeholder?: string
  minLength?: number
  pwned?: PwnedResult
}

export function PasswordInput({
  label,
  value,
  onChange,
  autoComplete = 'current-password',
  required,
  placeholder,
  minLength,
  pwned,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  const status = pwned?.status ?? 'idle'

  let borderClass = 'border-bold-white/15 focus:border-bold-yellow focus:ring-bold-yellow'
  if (status === 'pwned') borderClass = 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
  else if (status === 'safe') borderClass = 'border-green-500/40 focus:border-green-500 focus:ring-green-500'

  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-bold-white/60">{label}</span>
      <div className="mt-1 relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          minLength={minLength}
          className={`w-full rounded-md bg-bold-black border px-3 py-2.5 pr-11 text-bold-white placeholder-bold-white/30 focus:outline-none focus:ring-1 transition ${borderClass}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-bold-white/40 hover:text-bold-yellow hover:bg-bold-white/5 transition"
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {pwned && status !== 'idle' && (
        <PwnedHint status={status} count={pwned.count} />
      )}
    </label>
  )
}

function PwnedHint({ status, count }: { status: PwnedResult['status']; count: number }) {
  let icon: ReactNode = null
  let className = ''
  let text = ''

  switch (status) {
    case 'checking':
      icon = <Loader2 size={12} className="animate-spin" />
      className = 'text-bold-white/40'
      text = 'Verificando se a senha está em vazamentos...'
      break
    case 'safe':
      icon = <CheckCircle2 size={12} />
      className = 'text-green-400'
      text = 'Senha não encontrada em vazamentos públicos.'
      break
    case 'pwned':
      icon = <AlertTriangle size={12} />
      className = 'text-red-400'
      text =
        count > 1000
          ? `Senha vazou ${count.toLocaleString('pt-BR')} vezes em vazamentos públicos. Escolha outra.`
          : `Senha encontrada em vazamentos públicos. Escolha outra mais segura.`
      break
    case 'error':
      icon = <AlertTriangle size={12} />
      className = 'text-amber-400'
      text = 'Não foi possível verificar a senha agora (tente de novo).'
      break
  }

  return (
    <p className={`mt-1.5 flex items-start gap-1.5 text-[11px] ${className}`}>
      <span className="mt-px shrink-0">{icon}</span>
      <span>{text}</span>
    </p>
  )
}
