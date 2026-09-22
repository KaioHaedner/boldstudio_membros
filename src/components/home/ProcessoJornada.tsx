import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

// Jornada do cliente: caminho em serpentina que se desenha sozinho quando a
// seção entra na tela, acendendo etapa por etapa. Antes eram três imagens .webp
// com linha, pontos e rótulos achatados no pixel, o que impedia acender ponto a
// ponto — por isso virou SVG de verdade.
//
// O percurso começa na esquerda, vai até a direita, desce e volta, desce e vai
// de novo, terminando com a seta. Duas geometrias com o mesmo formato: no
// desktop poucas linhas bem largas, no celular mais linhas com duas etapas
// cada, porque treze etapas numa linha só ficam ilegíveis.

type No = { x: number; y: number }

type Serpentina = { caminho: string; nos: No[]; altura: number; menorX: number; maiorX: number }

function montarSerpentina(
  largura: number,
  margem: number,
  raio: number,
  espacoEntreLinhas: number,
  porLinha: number[],
  // recuo extra das pontas: o ponto ja assenta na reta com o raio, mas o rotulo
  // dele ainda alcancava a curva que desce pra proxima linha
  folga = 0
): Serpentina {
  const esq = margem
  const dir = largura - margem
  const ys = porLinha.map((_, linha) => margem + linha * espacoEntreLinhas)

  // As pontas recuam o tamanho do raio. Sem isso o ponto da ponta cai no canto
  // exato que a curva arredonda: a linha passa por dentro e a bolinha fica
  // solta, fora do traço. Recuado, todo ponto assenta num trecho reto.
  const nos: No[] = []
  porLinha.forEach((quantidade, linha) => {
    const paraDireita = linha % 2 === 0
    const util = largura - (margem + raio + folga) * 2
    // com um ponto só na linha ele fica no começo dela, não no meio
    const passo = quantidade > 1 ? util / (quantidade - 1) : 0
    for (let i = 0; i < quantidade; i++) {
      const avanco = margem + raio + folga + passo * i
      nos.push({ x: paraDireita ? avanco : largura - avanco, y: ys[linha] })
    }
  })

  const partes = [`M ${esq} ${ys[0]}`]
  ys.forEach((y, linha) => {
    const ultima = linha === ys.length - 1
    const paraDireita = linha % 2 === 0
    const fim = paraDireita ? dir : esq
    if (ultima) {
      partes.push(`H ${fim}`)
      return
    }
    // reta até quase o canto, curva de 90°, desce, curva de novo
    const proximo = ys[linha + 1]
    if (paraDireita) {
      partes.push(`H ${dir - raio}`)
      partes.push(`A ${raio} ${raio} 0 0 1 ${dir} ${y + raio}`)
      partes.push(`V ${proximo - raio}`)
      partes.push(`A ${raio} ${raio} 0 0 1 ${dir - raio} ${proximo}`)
    } else {
      partes.push(`H ${esq + raio}`)
      partes.push(`A ${raio} ${raio} 0 0 0 ${esq} ${y + raio}`)
      partes.push(`V ${proximo - raio}`)
      partes.push(`A ${raio} ${raio} 0 0 0 ${esq + raio} ${proximo}`)
    }
  })

  return {
    caminho: partes.join(' '),
    nos,
    altura: ys[ys.length - 1] + margem,
    menorX: Math.min(...nos.map((n) => n.x)),
    maiorX: Math.max(...nos.map((n) => n.x)),
  }
}

// 13 etapas: 4 + 5 + 4 no desktop, de duas em duas no celular.
const DESKTOP = montarSerpentina(1200, 90, 60, 190, [4, 5, 4], 80)
const MOBILE = montarSerpentina(360, 55, 38, 108, [2, 2, 2, 2, 2, 2, 1])

export function ProcessoJornada({ etapas }: { etapas: readonly string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const pathMobileRef = useRef<SVGPathElement>(null)
  // Com "reduzir movimento" a jornada já nasce inteira acesa, sem animar.
  const [progresso, setProgresso] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0
  )

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // os dois caminhos (desktop e celular) são desenhados juntos; só um está
    // visível por vez, mas assim o progresso serve para ambos
    const caminhos = [pathRef.current, pathMobileRef.current].filter(Boolean) as SVGPathElement[]
    const comprimentos = caminhos.map((p) => p.getTotalLength())
    caminhos.forEach((p, i) => {
      p.style.strokeDasharray = String(comprimentos[i])
      p.style.strokeDashoffset = String(comprimentos[i])
    })

    const estado = { p: 0 }
    let tween: gsap.core.Tween | null = null

    // Toca uma vez, quando a seção aparece.
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting || tween) return
        io.disconnect()
        tween = gsap.to(estado, {
          p: 1,
          duration: 3.4,
          ease: 'none',
          onUpdate: () => {
            caminhos.forEach((p, i) => {
              p.style.strokeDashoffset = String(comprimentos[i] * (1 - estado.p))
            })
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

  // So no celular: centralizar o rotulo no ponto jogaria metade dele pra fora
  // da tela e por cima da curva, entao quem esta na ponta ancora pra dentro.
  // No desktop a margem do viewBox absorve essa metade, e ancorar na ponta so
  // empurrava o rotulo da borda por cima do vizinho.
  const ancora = (x: number, s: Serpentina) => {
    if (x <= s.menorX + 1) return 'start' as const
    if (x >= s.maiorX - 1) return 'end' as const
    return 'middle' as const
  }

  // Fração do caminho onde cada ponto acende, na ordem do percurso.
  const fracaoDoNo = (indice: number) => (indice + 0.5) / etapas.length

  return (
    <div ref={wrapRef} className="processo-jornada">
      <svg
        className="processo-jornada__svg"
        viewBox={`0 0 1200 ${DESKTOP.altura}`}
        role="img"
        aria-label={etapas.join(', ')}
      >
        <defs>
          <marker id="jornada-seta" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto">
            <path d="M 0 1 L 9 6 L 0 11 z" fill="#fde100" />
          </marker>
        </defs>

        <path d={DESKTOP.caminho} className="processo-jornada__trilho" />
        {/* A seta só entra no fim: o markerEnd é desenhado na ponta geométrica
            do caminho e apareceria lá desde o começo. */}
        <path
          ref={pathRef}
          d={DESKTOP.caminho}
          className="processo-jornada__linha"
          markerEnd={progresso > 0.99 ? 'url(#jornada-seta)' : undefined}
        />

        {DESKTOP.nos.map((no, i) => (
          <g key={etapas[i] ?? i} className="processo-jornada__no" data-aceso={progresso >= fracaoDoNo(i)}>
            <circle cx={no.x} cy={no.y} r="13" className="processo-jornada__bolinha" />
            {/* alterna acima/abaixo: com 5 etapas numa linha os rotulos
                vizinhos quase se encostavam no mesmo nivel */}
            <text
              x={no.x}
              y={no.y + (i % 2 === 0 ? -34 : 46)}
              className="processo-jornada__rotulo"
              textAnchor="middle"
            >
              {etapas[i]}
            </text>
          </g>
        ))}
      </svg>

      <svg
        className="processo-jornada__svg-mobile"
        viewBox={`0 0 360 ${MOBILE.altura}`}
        role="img"
        aria-label={etapas.join(', ')}
      >
        <defs>
          <marker id="jornada-seta-m" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto">
            <path d="M 0 1 L 9 6 L 0 11 z" fill="#fde100" />
          </marker>
        </defs>

        <path d={MOBILE.caminho} className="processo-jornada__trilho" />
        <path
          ref={pathMobileRef}
          d={MOBILE.caminho}
          className="processo-jornada__linha"
          markerEnd={progresso > 0.99 ? 'url(#jornada-seta-m)' : undefined}
        />

        {MOBILE.nos.map((no, i) => (
          <g key={`m-${etapas[i] ?? i}`} className="processo-jornada__no" data-aceso={progresso >= fracaoDoNo(i)}>
            <circle cx={no.x} cy={no.y} r="10" className="processo-jornada__bolinha" />
            {/* alterna acima/abaixo pra dois rótulos da mesma linha não colidirem */}
            <text
              x={no.x}
              y={no.y + (i % 2 === 0 ? -22 : 30)}
              className="processo-jornada__rotulo processo-jornada__rotulo--mobile"
              textAnchor={ancora(no.x, MOBILE)}
            >
              {etapas[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
