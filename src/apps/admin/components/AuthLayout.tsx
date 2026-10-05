import { PoweredByBold } from '@/shared/components/PoweredByBold'
import { HeaderLogo, VersionTag } from '@/shared/components/AuthLayoutParts'
import type { AuthShellProps } from '@/shared/auth/types'

export function AdminAuthLayout({ title, subtitle, children }: AuthShellProps) {
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

