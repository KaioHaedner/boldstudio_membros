import { APP_VERSION } from '@/shared/lib/version'
import { cn } from '@/shared/lib/utils'

export function HeaderLogo({
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

export function VersionTag() {
  return (
    <p className="mt-6 text-center text-[10px] text-bold-white/30 uppercase tracking-widest">
      bold. v{APP_VERSION}
    </p>
  )
}

