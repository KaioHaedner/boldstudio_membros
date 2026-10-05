import { Footer } from '@/shared/components/Footer'
import { getArea } from '@/shared/lib/area'
import type { AuthShellProps } from '@/shared/auth/types'
import { AcademyAuthLayout } from '@/apps/academy/components/AuthLayout'
import { AdminAuthLayout } from '@/apps/admin/components/AuthLayout'
import { CrewAuthLayout } from '@/apps/crew/components/AuthLayout'

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
