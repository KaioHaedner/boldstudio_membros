/** Decorative signature below the footer. Clip with CSS; preserve the source. */
export function FooterWordmark() {
  return (
    <div className="footer-wordmark bg-black" data-footer-signature aria-hidden="true">
      <div className="footer-wordmark__crop">
        <img
          src="/brand/BoldStudio_logo_vetorizada_branca.svg"
          alt=""
          width={890}
          height={279}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  )
}
