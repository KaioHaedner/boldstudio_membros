import { useSearchParams } from 'react-router-dom'
import { LoginBackground } from '@/components/LoginBackground'
import { VideoBackground } from '@/components/VideoBackground'
import { StudioVideoBg } from '@/components/StudioVideoBg'
import { APP_VERSION } from '@/lib/version'
import { cn } from '@/lib/utils'

export type LoginLayout = 'center' | 'split' | 'full-video'

const VALID_LAYOUTS: LoginLayout[] = ['center', 'split', 'full-video']
const DEFAULT_LAYOUT: LoginLayout = 'split'

export function useLoginLayout(): LoginLayout {
  const [params] = useSearchParams()
  const s = params.get('style')
  return VALID_LAYOUTS.includes(s as LoginLayout) ? (s as LoginLayout) : DEFAULT_LAYOUT
}

interface AuthShellProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function AuthShell(props: AuthShellProps) {
  const layout = useLoginLayout()

  return (
    <>
      {layout === 'split' && <SplitLayout {...props} />}
      {layout === 'center' && <CenterLayout {...props} />}
      {layout === 'full-video' && <FullVideoLayout {...props} />}
      <LayoutSwitcher current={layout} />
    </>
  )
}

/* ============== LAYOUT 1: CENTER (atual) ============== */
function CenterLayout({ title, subtitle, children }: AuthShellProps) {
  return (
    <>
      <LoginBackground />
      <div className="min-h-screen text-bold-white flex items-center justify-center px-4 py-12 relative">
        <div className="w-full max-w-sm relative z-10">
          <HeaderLogo title={title} subtitle={subtitle} />
          <div className="glass-card rounded-lg p-6">{children}</div>
          <VersionTag />
        </div>
      </div>
    </>
  )
}

/* ============== LAYOUT 2: SPLIT (vídeo do estúdio nítido + painéis de vidro no form e no título) ============== */
function SplitLayout({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen relative overflow-hidden text-bold-white flex items-center justify-center md:justify-end px-4 md:px-16 py-12">
      {/* Vídeo do estúdio cobrindo a tela (nítido) */}
      <StudioVideoBg />

      {/* Overlay bem suave só pra dar contraste — não borra o vídeo */}
      <div className="absolute inset-0 bg-gradient-to-t from-bold-black/55 via-bold-black/10 to-bold-black/25 pointer-events-none" />

      {/* Painel de vidro com o título (canto inferior esquerdo, desktop) */}
      <div className="hidden md:block absolute bottom-10 left-10 z-10 max-w-md rounded-2xl border border-bold-white/10 bg-bold-black/35 backdrop-blur-2xl p-6 shadow-2xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-bold-yellow font-bold mb-2">
          boldstudio
        </p>
        <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight">
          Audiovisual do básico ao avançado.
        </h2>
        <p className="mt-2 text-sm text-bold-white/75 max-w-xs">
          Captação, equipamento, proposta, negociação e vendas. Em vídeos diretos ao ponto.
        </p>
      </div>

      {/* Painel de vidro com o formulário (blur ofusca o vídeo atrás) */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-bold-white/10 bg-bold-black/45 backdrop-blur-2xl p-6 md:p-8 shadow-2xl">
        <HeaderLogo title={title} subtitle={subtitle} compact />
        <div className="space-y-4">{children}</div>
        <VersionTag />
      </div>
    </div>
  )
}

/* ============== LAYOUT 3: FULL-VIDEO (motion graphics ocupa tudo, formulário centralizado) ============== */
function FullVideoLayout({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen relative text-bold-white flex items-center justify-center px-4 py-12 overflow-hidden">
      <VideoBackground />

      <div className="w-full max-w-sm relative z-10">
        <HeaderLogo title={title} subtitle={subtitle} />
        <div className="glass-card rounded-lg p-6">{children}</div>
        <VersionTag />
      </div>
    </div>
  )
}

/* ============== HELPERS ============== */
function HeaderLogo({
  title,
  subtitle,
  compact,
}: {
  title: string
  subtitle?: string
  compact?: boolean
}) {
  return (
    <div className={cn('flex flex-col items-center', compact ? 'mb-6' : 'mb-8')}>
      <img
        src="/brand/logo-primary.png"
        alt="bold."
        className={cn(
          'w-auto mb-5 drop-shadow-[0_4px_20px_rgba(255,215,18,0.3)] select-none',
          compact ? 'h-10' : 'h-12'
        )}
        draggable={false}
      />
      <h1 className={cn('font-extrabold tracking-tight', compact ? 'text-xl' : 'text-2xl')}>
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-bold-white/60 text-center">{subtitle}</p>}
    </div>
  )
}

function VersionTag() {
  return (
    <p className="mt-6 text-center text-[10px] text-bold-white/30 uppercase tracking-widest">
      bold. v{APP_VERSION}
    </p>
  )
}

/* ============== SWITCHER (canto inferior direito) ============== */
function LayoutSwitcher({ current }: { current: LoginLayout }) {
  const [, setParams] = useSearchParams()

  const items: { id: LoginLayout; label: string }[] = [
    { id: 'center', label: 'Centro' },
    { id: 'split', label: 'Split' },
    { id: 'full-video', label: 'Video BG' },
  ]

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex gap-0.5 p-1 rounded-full bg-bold-black/85 backdrop-blur-md border border-bold-white/15 shadow-lg"
      data-cursor-hover
    >
      <span className="px-2 py-1 text-[9px] uppercase tracking-widest text-bold-yellow font-bold self-center">
        layout
      </span>
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => setParams({ style: it.id })}
          className={cn(
            'px-3 py-1.5 rounded-full text-[11px] font-semibold transition',
            current === it.id
              ? 'bg-bold-yellow text-bold-black'
              : 'text-bold-white/60 hover:text-bold-white hover:bg-bold-white/5'
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}

/* ============== Field exportado pra compatibilidade ============== */
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
      <span className="text-xs uppercase tracking-wider text-bold-white/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md bg-bold-black border border-bold-white/15 px-3 py-2.5 text-bold-white placeholder-bold-white/30 focus:outline-none focus:border-bold-yellow focus:ring-1 focus:ring-bold-yellow"
      />
    </label>
  )
}
