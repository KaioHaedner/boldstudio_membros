// Background interativo: gradient mesh radial + obturador BOLD rotacionando devagar.
// 100% CSS/SVG, zero JS animation libs, performance excelente.

export function LoginBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-bold-black">
      {/* Gradient mesh radial */}
      <div className="absolute inset-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-bold-yellow/15 blur-[120px] animate-blob-1" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-bold-yellow/10 blur-[140px] animate-blob-2" />
        <div className="absolute top-[40%] left-[55%] w-[35vw] h-[35vw] rounded-full bg-amber-500/10 blur-[100px] animate-blob-3" />
      </div>

      {/* Obturador rotacionando lentamente, opacity baixa */}
      <svg
        viewBox="0 0 64 64"
        className="absolute opacity-[0.06] w-[min(110vh,110vw)] h-[min(110vh,110vw)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-rotate-slow"
        aria-hidden="true"
      >
        <g transform="translate(32 32)">
          <path d="M 0 -22 L 11 -19 L 6 -6 L -6 -6 L -11 -19 Z" fill="#FFD712" transform="rotate(0)" />
          <path d="M 0 -22 L 11 -19 L 6 -6 L -6 -6 L -11 -19 Z" fill="#FFD712" transform="rotate(60)" />
          <path d="M 0 -22 L 11 -19 L 6 -6 L -6 -6 L -11 -19 Z" fill="#FFD712" transform="rotate(120)" />
          <path d="M 0 -22 L 11 -19 L 6 -6 L -6 -6 L -11 -19 Z" fill="#FFD712" transform="rotate(180)" />
          <path d="M 0 -22 L 11 -19 L 6 -6 L -6 -6 L -11 -19 Z" fill="#FFD712" transform="rotate(240)" />
          <path d="M 0 -22 L 11 -19 L 6 -6 L -6 -6 L -11 -19 Z" fill="#FFD712" transform="rotate(300)" />
        </g>
      </svg>

      {/* Particulas amarelas flutuantes */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute block w-1 h-1 rounded-full bg-bold-yellow/40 animate-float-particle"
            style={{
              left: `${(i * 83) % 100}%`,
              top: `${(i * 47) % 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${10 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Grain overlay subtil */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.5'/></svg>\")",
        }}
      />
    </div>
  )
}
