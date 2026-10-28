import type { SVGProps } from 'react'

/** lucide:square-arrow-out-up-right, verified through the Iconify API (ISC). */
export function ActionArrow({ size = 20, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return <svg data-icon="lucide:square-arrow-out-up-right" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6m10 0-9 9m3-9h6v6" />
  </svg>
}
