import { Mouse, Pointer } from 'lucide-react'

/** A gesture cue, not a link: press, drag sideways, then switch input device. */
export function DragHint({ label }: { label: string }) {
  return <span className="drag-hint" role="img" aria-label={label}>
    <svg className="drag-hint__trail" viewBox="0 0 132 64" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="drag-hint__line" d="M104 18H34" />
      <path className="drag-hint__arrow" d="m41 11-7 7 7 7" />
    </svg>
    <span className="drag-hint__device drag-hint__touch" aria-hidden="true"><Pointer size={32} strokeWidth={1.7} /><span className="drag-hint__press" /></span>
    <span className="drag-hint__device drag-hint__mouse" aria-hidden="true"><Mouse size={32} strokeWidth={1.7} /><span className="drag-hint__press" /></span>
  </span>
}
