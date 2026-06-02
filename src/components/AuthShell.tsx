import { StudioVideoBg } from '@/components/StudioVideoBg'
import { CameraRays, CameraEmitter } from '@/components/CameraEmitter'
import { PoweredByBold } from '@/components/PoweredByBold'
import { getArea } from '@/lib/area'
import { APP_VERSION } from '@/lib/version'

interface AuthShellProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

// Academy: video de fundo + camera. Demais areas: camera puro (fundo preto).
export function AuthShell(props: AuthShellProps) {
  const area = getArea()
  if (area === 'admin' || area === 'crew') return <CameraAuthLayout {...props} />
  return <AcademyCameraLayout {...props} />
}

// Bloco do form com efeito camera (emissor + raios + blur)
function CameraForm({ title, subtitle, children, badge }: AuthShellProps & { badge?: string }) {
  // No academy, o badge "Academy" substitui o titulo "Entrar"
  const showTitle = !(badge && title === 'Entrar')
  return (
    <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
      <div className="cam-form w-full">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img
            src="/brand/logo-primary.png"
            alt="bold."
            className="h-8 w-auto drop-shadow-[0_0_16px_rgba(255,215,18,0.35)]"
            draggable={false}
          />
          {badge && <span className="text-xl font-extrabold tracking-tight text-bold-yellow">{badge}</span>}
        </div>
        {showTitle && <p className="cam-label">{title}</p>}
        {subtitle && <p className="text-center text-sm text-bold-white/70 -mt-1">{subtitle}</p>}
        <div className="space-y-4 mt-1">{children}</div>
        <PoweredByBold className="flex justify-center mt-3" />
        <VersionTag />
      </div>
      <CameraRays />
      <CameraEmitter />
    </div>
  )
}

/* ============== ACADEMY — video de fundo + form camera (blur) de canto + texto Bold ============== */
function AcademyCameraLayout(props: AuthShellProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-bold-black text-bold-white flex items-center justify-center md:justify-end px-4 md:px-16 py-12">
      <StudioVideoBg />
      <div className="absolute inset-0 bg-gradient-to-t from-bold-black/60 via-bold-black/15 to-bold-black/30 pointer-events-none" />

      {/* Texto da Bold rente ao card (centralizado vertical) com blur */}
      <div className="hidden md:block absolute left-10 top-1/2 -translate-y-1/2 z-10 max-w-md rounded-2xl border border-bold-white/10 bg-bold-black/35 backdrop-blur-2xl p-6 shadow-2xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-bold-yellow font-bold mb-2">academy</p>
        <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight">
          Audiovisual do básico ao avançado.
        </h2>
        <p className="mt-2 text-sm text-bold-white/75 max-w-xs">
          Captação, equipamento, proposta, negociação e vendas. Em vídeos diretos ao ponto.
        </p>
      </div>

      <CameraForm {...props} badge="Academy" />
    </div>
  )
}

/* ============== ADMIN / CREW — camera puro (fundo preto) ============== */
function CameraAuthLayout(props: AuthShellProps) {
  return (
    <div className="min-h-screen relative bg-bold-black text-bold-white flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_88%,rgba(255,215,18,0.10),transparent_60%)] pointer-events-none" />
      <CameraForm {...props} />
    </div>
  )
}

function VersionTag() {
  return (
    <p className="mt-5 text-center text-[10px] text-bold-white/30 uppercase tracking-widest">
      BoldStudios v{APP_VERSION}
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
