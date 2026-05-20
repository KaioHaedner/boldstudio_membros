// Motion graphics BOLD: ondas de luz amarelas, partículas e obturador rotativo.
// Substitui um MP4 cinematic quando ainda não há vídeo real do estúdio.
// Performance: 100% CSS + SVG, zero JS animation libs, sem fetch de mídia.

export function VideoBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-bold-black pointer-events-none">
      {/* Camada 1: gradiente radial central pulsando */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[160vw] h-[160vh] rounded-full bg-bold-yellow/[0.08] blur-[120px] animate-pulse-slow" />
      </div>

      {/* Camada 2: ondas de luz horizontais */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="waveYellow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD712" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFD712" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFD712" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="waveAmber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE54B" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFE54B" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFE54B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ondas (curvas Bezier suaves animadas) */}
        <path
          d="M -100 400 Q 300 320 600 400 T 1300 400"
          stroke="url(#waveYellow)"
          strokeWidth="1.5"
          fill="none"
          className="animate-wave-1"
        />
        <path
          d="M -100 450 Q 300 530 600 450 T 1300 450"
          stroke="url(#waveAmber)"
          strokeWidth="1"
          fill="none"
          className="animate-wave-2"
        />
        <path
          d="M -100 350 Q 300 250 600 350 T 1300 350"
          stroke="url(#waveYellow)"
          strokeWidth="0.8"
          fill="none"
          className="animate-wave-3"
        />
        <path
          d="M -100 500 Q 300 580 600 500 T 1300 500"
          stroke="url(#waveAmber)"
          strokeWidth="0.6"
          fill="none"
          className="animate-wave-1"
        />
      </svg>

      {/* Camada 3: obturador BOLD girando bem devagar */}
      <svg
        viewBox="0 0 64 64"
        className="absolute opacity-[0.05] w-[min(120vh,120vw)] h-[min(120vh,120vw)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-rotate-slow"
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

      {/* Camada 4: partículas flutuando */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full bg-bold-yellow animate-particle-float"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              left: `${(i * 37) % 100}%`,
              top: `${(i * 73) % 100}%`,
              opacity: 0.3 + (i % 4) * 0.15,
              animationDelay: `${(i * 0.4) % 12}s`,
              animationDuration: `${14 + (i % 6) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Camada 5: vignette escuro nas bordas */}
      <div className="absolute inset-0 bg-radial-vignette" />
    </div>
  )
}
