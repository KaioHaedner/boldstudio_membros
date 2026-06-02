import { Aperture } from 'lucide-react'

// Selo "Powered by" no estilo brutalist, com o obturador de camera (cara da Bold).
// Mostra "Powered By / Kaio H. & BoldStudio" no hover.
export function PoweredByBold({ className }: { className?: string }) {
  return (
    <div className={className}>
      <button type="button" className="brutalist-btn" aria-label="Powered by Kaio H. e BoldStudio">
        <div className="brutalist-logo">
          <Aperture className="brutalist-icon" size={32} strokeWidth={1.5} />
        </div>
        <div className="brutalist-text">
          <span>Powered By</span>
          <span>Kaio H. &amp; BoldStudio</span>
        </div>
      </button>
    </div>
  )
}
