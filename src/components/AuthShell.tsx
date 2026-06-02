import { CameraRays, CameraEmitter } from '@/components/CameraEmitter'
import { APP_VERSION } from '@/lib/version'

interface AuthShellProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

// Tema unico "camera" pra todas as telas de login/auth (Bold).
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen relative bg-bold-black text-bold-white flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* glow de fundo na base (luz da camera) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_88%,rgba(255,215,18,0.10),transparent_60%)] pointer-events-none" />

      <div className="relative flex flex-col items-center w-full max-w-sm">
        <div className="cam-form w-full">
          <img src="/brand/logo-primary.png" alt="bold." className="h-9 w-auto mx-auto mb-2 drop-shadow-[0_0_16px_rgba(255,215,18,0.35)]" draggable={false} />
          <p className="cam-label">{title}</p>
          {subtitle && <p className="text-center text-sm text-bold-white/70 -mt-1">{subtitle}</p>}
          <div className="space-y-4 mt-1">{children}</div>
          <VersionTag />
        </div>
        <CameraRays />
        <CameraEmitter />
      </div>
    </div>
  )
}

function VersionTag() {
  return (
    <p className="mt-5 text-center text-[10px] text-bold-white/30 uppercase tracking-widest">
      bold. v{APP_VERSION}
    </p>
  )
}

/* Field exportado pra compatibilidade com as paginas de auth */
export function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
  placeholder,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-bold-white/70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md bg-bold-black/60 border border-bold-white/20 px-3 py-2.5 text-bold-white placeholder-bold-white/40 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow"
      />
    </label>
  )
}
