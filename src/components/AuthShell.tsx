import { StudioVideoBg } from '@/components/StudioVideoBg'
import { PoweredByBold } from '@/components/PoweredByBold'
import { Footer } from '@/components/Footer'
import { getArea } from '@/lib/area'
import { APP_VERSION } from '@/lib/version'
import { cn } from '@/lib/utils'

interface AuthShellProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

// Cada subdominio tem um tema de entrada proprio. Footer padrao abaixo em todas.
export function AuthShell(props: AuthShellProps) {
  const area = getArea()
  const layout =
    area === 'admin' ? <AdminAuthLayout {...props} /> : area === 'crew' ? <CrewAuthLayout {...props} /> : <AcademyAuthLayout {...props} />
  return (
    <>
      {layout}
      <Footer />
    </>
  )
}

/* ============== ACADEMY — video de fundo + paineis de vidro ============== */
function AcademyAuthLayout({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen relative overflow-hidden text-bold-white flex items-center justify-center md:justify-end px-4 md:px-16 py-12">
      <StudioVideoBg />
      <div className="absolute inset-0 bg-gradient-to-t from-bold-black/55 via-bold-black/10 to-bold-black/25 pointer-events-none" />

      <div className="hidden md:block absolute bottom-10 left-10 z-10 max-w-md rounded-2xl border border-bold-white/10 bg-bold-black/35 backdrop-blur-2xl p-6 shadow-2xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-bold-yellow font-bold mb-2">academy</p>
        <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight">Audiovisual do básico ao avançado.</h2>
        <p className="mt-2 text-sm text-bold-white/75 max-w-xs">
          Captação, equipamento, proposta, negociação e vendas. Em vídeos diretos ao ponto.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-2xl border-2 border-bold-yellow/50 bg-bold-black/45 backdrop-blur-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2">
            <img
              src="/brand/logo-primary.png"
              alt="bold."
              className="h-10 w-auto drop-shadow-[0_4px_20px_rgba(255,215,18,0.3)] select-none"
              draggable={false}
            />
            <span className="text-2xl font-extrabold tracking-tight text-bold-yellow">Academy</span>
          </div>
          {title !== 'Entrar' && <h1 className="mt-2 text-xl font-extrabold tracking-tight">{title}</h1>}
          {subtitle && <p className="mt-1 text-sm text-bold-white/60 text-center">{subtitle}</p>}
        </div>
        <div className="space-y-4">{children}</div>
        <PoweredByBold className="flex justify-center mt-5" />
        <VersionTag />
      </div>
    </div>
  )
}

/* ============== ADMIN — apresentacao sobria com "ADMIN" em destaque ============== */
function AdminAuthLayout({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen flex bg-bold-black text-bold-white">
      {/* Lado esquerdo: marca ADMIN (sem video, sobrio) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative flex-col justify-center px-12 lg:px-20 border-r border-bold-white/10 overflow-hidden">
        {/* fundo: grid sutil + glow amarelo */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#FFD712 1px, transparent 1px), linear-gradient(90deg, #FFD712 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-bold-yellow/[0.07] blur-[120px]" />

        <div className="relative z-10">
          <img src="/brand/logo-primary.png" alt="bold." className="h-9 w-auto mb-8" draggable={false} />
          <p className="text-[11px] uppercase tracking-[0.4em] text-bold-yellow font-bold mb-3">painel de controle</p>
          <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tight leading-none">ADMIN</h1>
          <p className="mt-6 text-bold-white/55 max-w-sm text-sm">
            Acesso restrito aos administradores da BOLD Studio. Gestão de alunos, conteúdo,
            segurança e operação.
          </p>
        </div>
      </div>

      {/* Lado direito: formulario */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-6 flex items-center gap-2">
            <img src="/brand/logo-primary.png" alt="bold." className="h-7 w-auto" />
            <span className="text-2xl font-extrabold tracking-tight text-bold-yellow">ADMIN</span>
          </div>
          <HeaderLogo title={title} subtitle={subtitle} compact hideLogoOnMobile />
          <div className="space-y-4">{children}</div>
          <PoweredByBold className="flex justify-center mt-5" />
          <VersionTag />
        </div>
      </div>
    </div>
  )
}

/* ============== CREW — foto da equipe (placeholder ate ter as fotos reais) ============== */
function CrewAuthLayout({ title, subtitle, children }: AuthShellProps) {
  const membros = ['Pedro', 'Miguel', 'William', 'Equipe', 'Bold', 'Crew']
  return (
    <div className="min-h-screen flex bg-bold-black text-bold-white">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative flex-col justify-center px-12 lg:px-20 border-r border-bold-white/10 overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full bg-bold-yellow/[0.06] blur-[120px]" />
        <div className="relative z-10">
          <img src="/brand/logo-primary.png" alt="bold." className="h-9 w-auto mb-8" draggable={false} />
          <p className="text-[11px] uppercase tracking-[0.4em] text-bold-yellow font-bold mb-3">time interno</p>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-none mb-8">CREW</h1>
          {/* Grid de fotos (placeholder com iniciais ate subir as fotos reais) */}
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {membros.map((m) => (
              <div
                key={m}
                className="aspect-square rounded-xl bg-bold-gray border border-bold-white/10 flex items-center justify-center text-bold-white/40 text-xs font-semibold"
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <HeaderLogo title={title} subtitle={subtitle} compact />
          <div className="space-y-4">{children}</div>
          <PoweredByBold className="flex justify-center mt-5" />
          <VersionTag />
        </div>
      </div>
    </div>
  )
}

/* ============== HELPERS ============== */
function HeaderLogo({
  title,
  subtitle,
  compact,
  hideLogoOnMobile,
}: {
  title: string
  subtitle?: string
  compact?: boolean
  hideLogoOnMobile?: boolean
}) {
  return (
    <div className={cn('flex flex-col items-center', compact ? 'mb-6' : 'mb-8')}>
      <img
        src="/brand/logo-primary.png"
        alt="bold."
        className={cn(
          'w-auto mb-5 drop-shadow-[0_4px_20px_rgba(255,215,18,0.3)] select-none',
          compact ? 'h-10' : 'h-12',
          hideLogoOnMobile && 'hidden md:block'
        )}
        draggable={false}
      />
      <h1 className={cn('font-extrabold tracking-tight', compact ? 'text-xl' : 'text-2xl')}>{title}</h1>
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
