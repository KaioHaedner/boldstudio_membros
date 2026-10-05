import { PoweredByBold } from '@/shared/components/PoweredByBold'
import { HeaderLogo, VersionTag } from '@/shared/components/AuthLayoutParts'
import type { AuthShellProps } from '@/shared/auth/types'

export function CrewAuthLayout({ title, subtitle, children }: AuthShellProps) {
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

