import { StudioVideoBg } from '@/apps/academy/components/StudioVideoBg'
import { PoweredByBold } from '@/shared/components/PoweredByBold'
import { VersionTag } from '@/shared/components/AuthLayoutParts'
import type { AuthShellProps } from '@/shared/auth/types'

export function AcademyAuthLayout({ title, subtitle, children }: AuthShellProps) {
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

