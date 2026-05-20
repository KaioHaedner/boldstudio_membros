import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  label: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  required?: boolean
  placeholder?: string
  minLength?: number
}

export function PasswordInput({
  label,
  value,
  onChange,
  autoComplete = 'current-password',
  required,
  placeholder,
  minLength,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

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
          className="w-full rounded-md bg-bold-black border border-bold-white/15 px-3 py-2.5 pr-11 text-bold-white placeholder-bold-white/30 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow"
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
    </label>
  )
}
