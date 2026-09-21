import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

// Jornada do cliente: caminho em S que se desenha sozinho quando a seção entra
// na tela, acendendo etapa por etapa. Antes eram três imagens .webp com linha,
// pontos e rótulos achatados no pixel, o que impedia acender ponto a ponto —
// por isso virou SVG de verdade.
//
// Duas geometrias: no desktop o S de três linhas, no mobile uma linha vertical
// (treze etapas em serpentina não cabem em 375px de forma legível). As duas
// compartilham o mesmo progresso 0..1 da animação.

const LARGURA = 1200
const ALTURA = 560
const MARGEM = 70
const RAIO = 60

// Quantos pontos em cada uma das três linhas do S, na ordem do caminho.
const POR_LINHA = [4, 5, 4]
const LINHAS_Y = [130, 310, 490]

type No = { x: number; y: number; linha: number }

// Monta os pontos seguindo o sentido de cada linha: a 1ª vai pra direita, a 2ª
// volta, a 3ª vai pra direita de novo.
function montarNos(): No[] {
  const nos: No[] = []
  POR_LINHA.forEach((quantidade, linha) => {
    const paraDireita = linha % 2 === 0
    const util = LARGURA - MARGEM * 2
    const passo = util / (quantidade - 1)
    for (let i = 0; i < quantidade; i++) {
      const avanco = MARGEM + passo * i
      nos.push({ x: paraDireita ? avanco : LARGURA - avanco, y: LINHAS_Y[linha], linha })
    }
  })
  return nos
}

// Caminho em S: reta, curva de 90° pra descer, reta no sentido oposto, e assim
// por diante. Os arcos usam RAIO para o canto não sair quadrado.
function montarCaminho(): string {
  const esq = MARGEM
  const dir = LARGURA - MARGEM
  const [y1, y2, y3] = LINHAS_Y
  return [
    `M ${esq} ${y1}`,
    `H ${dir - RAIO}`,
    `A ${RAIO} ${RAIO} 0 0 1 ${dir} ${y1 + RAIO}`,
    `V ${y2 - RAIO}`,
    `A ${RAIO} ${RAIO} 0 0 1 ${dir - RAIO} ${y2}`,
    `H ${esq + RAIO}`,
    `A ${RAIO} ${RAIO} 0 0 0 ${esq} ${y2 + RAIO}`,
    `V ${y3 - RAIO}`,
    `A ${RAIO} ${RAIO} 0 0 0 ${esq + RAIO} ${y3}`,
    `H ${dir}`,
  ].join(' ')
}

const NOS = montarNos()
const CAMINHO = montarCaminho()

export function ProcessoJornada({ etapas }: { etapas: readonly string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  // Com "reduzir movimento" a jornada já nasce inteira acesa, sem animar.
  const [progresso, setProgresso] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0
  )

  useEffect(() => {
    const wrap = wrapRef.current
    const path = pathRef.current
    if (!wrap || !path) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const comprimento = path.getTotalLength()
    path.style.strokeDasharray = String(comprimento)
    path.style.strokeDashoffset = String(comprimento)

    const estado = { p: 0 }
    let tween: gsap.core.Tween | null = null

    // Toca uma vez, quando a seção aparece. Antes a linha vinha presa a um pin
    // de ScrollTrigger; sem o pin a seção fica bem mais curta e a animação
    // acontece sozinha, como o cliente pediu.
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting || tween) return
        io.disconnect()
        tween = gsap.to(estado, {
          p: 1,
          duration: 3.4,
          ease: 'none',
          onUpdate: () => {
            path.style.strokeDashoffset = String(comprimento * (1 - estado.p))
            setProgresso(estado.p)
          },
        })
      },
      { threshold: 0.25 }
    )
    io.observe(wrap)

    return () => {
      io.disconnect()
      tween?.kill()
    }
  }, [])

  // Fração do caminho onde cada ponto acende. Distribui na ordem do caminho,
  // com uma folga no fim pra última etapa acender antes da seta chegar.
  const fracaoDoNo = (indice: number) => (indice + 0.5) / NOS.length

  return (
    <div ref={wrapRef} className="processo-jornada">
      {/* Desktop: o S */}
      <svg
        className="processo-jornada__svg"
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        role="img"
        aria-label={etapas.join(', ')}
      >
        <defs>
          <marker id="jornada-seta" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto">
            <path d="M 0 1 L 9 6 L 0 11 z" fill="#fde100" />
          </marker>
        </defs>

        {/* trilho apagado, sempre visível */}
        <path d={CAMINHO} className="processo-jornada__trilho" />
        {/* Trilho aceso, desenhado pela animação. A seta só entra no fim: o
            markerEnd é desenhado na ponta geométrica do caminho e apareceria
            lá desde o começo, antes da linha chegar. */}
        <path
          ref={pathRef}
          d={CAMINHO}
          className="processo-jornada__linha"
          markerEnd={progresso > 0.99 ? 'url(#jornada-seta)' : undefined}
        />

        {NOS.map((no, i) => {
          const aceso = progresso >= fracaoDoNo(i)
          return (
            <g key={etapas[i] ?? i} className="processo-jornada__no" data-aceso={aceso}>
              <circle cx={no.x} cy={no.y} r="13" className="processo-jornada__bolinha" />
              <text x={no.x} y={no.y - 34} className="processo-jornada__rotulo" textAnchor="middle">
                {etapas[i]}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Mobile: mesma jornada em coluna */}
      <ol className="processo-jornada__lista">
        {etapas.map((etapa, i) => (
          <li key={etapa} className="processo-jornada__item" data-aceso={progresso >= fracaoDoNo(i)}>
            <span className="processo-jornada__marcador" aria-hidden="true" />
            <span className="processo-jornada__texto">{etapa}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
