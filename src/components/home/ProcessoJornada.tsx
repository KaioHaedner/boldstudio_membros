import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { JORNADA_ICONES_LOCAIS } from '@/data/jornada'

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
  folga = 0,
  // quanto a linha passa do último ícone, pra seta caber fora do disco dele
  sobraFinal = 60,
  // folga de cima e de baixo. Separada da margem lateral porque o nome e o
  // apoio da primeira fileira sobem bastante, e com a margem lateral esses
  // textos invadiam o título da seção
  margemTopo = margem
): Serpentina {
  const esq = margem
  const dir = largura - margem
  const ys = porLinha.map((_, linha) => margemTopo + linha * espacoEntreLinhas)

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

  // Comeca exatamente no primeiro icone: antes o traco nascia na margem e a luz
  // aparecia num pedaco de linha antes da primeira etapa, como se estivesse
  // solta. A ponta final sobra um pouco depois do ultimo icone, so pra seta
  // caber fora do disco.
  const primeiro = nos[0]
  const ultimo = nos[nos.length - 1]
  const ultimaParaDireita = (porLinha.length - 1) % 2 === 0
  // sobra o bastante pro disco do último ícone não cobrir a seta de chegada
  const fimDaLinha = ultimo.x + (ultimaParaDireita ? sobraFinal : -sobraFinal)
  const partes = [`M ${primeiro.x} ${ys[0]}`]
  ys.forEach((y, linha) => {
    const ultima = linha === ys.length - 1
    const paraDireita = linha % 2 === 0
    if (ultima) {
      partes.push(`H ${fimDaLinha}`)
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
    altura: ys[ys.length - 1] + margemTopo,
    menorX: Math.min(...nos.map((n) => n.x)),
    maiorX: Math.max(...nos.map((n) => n.x)),
  }
}

// 13 etapas: 4 + 5 + 4 no desktop, de duas em duas no celular.
// 260 e 178 de distância entre fileiras: abaixo disso o nome de uma etapa
// encontra o da fileira seguinte, porque agora cada uma carrega nome e apoio
const DESKTOP = montarSerpentina(1200, 90, 60, 260, [4, 5, 4], 80, 60, 140)
const MOBILE = montarSerpentina(360, 24, 30, 178, [4, 5, 4], 4, 40, 86)

export function ProcessoJornada({
  etapas,
  apoio,
}: {
  etapas: readonly string[]
  apoio: readonly string[]
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const pathMobileRef = useRef<SVGPathElement>(null)
  const luzDesktopRef = useRef<SVGGElement>(null)
  const luzMobileRef = useRef<SVGGElement>(null)
  // Com "reduzir movimento" a jornada já nasce inteira acesa, sem animar.
  const [estatico] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
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

    // Nada de estado do React por quadro: a 60fps isso redesenhava os 13 nós
    // inteiros sessenta vezes por segundo e a animação engasgava. Aqui o quadro
    // só escreve atributo direto no DOM, e cada etapa só é tocada no quadro em
    // que ela realmente muda.
    const setas = ['url(#jornada-seta)', 'url(#jornada-seta-m)']
    let setaAcesa = false
    const grupos = Array.from(wrap.querySelectorAll<SVGGElement>('.processo-jornada__no'))
    const acesos = new Set<SVGGElement>()
    const luzes = [luzDesktopRef.current, luzMobileRef.current]

    // fração do caminho em que cada etapa acende, na ordem do percurso
    const porGrupo = grupos.map((g) => {
      const indice = Number(g.dataset.indice ?? '0')
      return (indice + 0.5) / etapas.length
    })

    const estado = { p: 0 }

    // Roda em loop: a luz corre a jornada inteira, segura um instante no fim e
    // recomeça do zero, apagando tudo de novo. Pausa fora da tela pra não
    // gastar bateria à toa.
    const tween = gsap.to(estado, {
      p: 1,
      duration: 10,
      ease: 'none',
      repeat: -1,
      repeatDelay: 1.4,
      paused: true,
      onUpdate: () => {
        caminhos.forEach((caminho, i) => {
          caminho.style.strokeDashoffset = String(comprimentos[i] * (1 - estado.p))
          // +6: o traço tem ponta arredondada e brilho, então o fim que o olho
          // enxerga fica um pouco à frente do fim geométrico
          const ponto = caminho.getPointAtLength(
            Math.min(comprimentos[i], comprimentos[i] * estado.p + 6)
          )
          const luz = luzes[i]
          if (luz) luz.setAttribute('transform', `translate(${ponto.x} ${ponto.y})`)
        })
        // a seta de chegada só existe quando a linha termina de desenhar
        const chegou = estado.p > 0.995
        if (chegou !== setaAcesa) {
          setaAcesa = chegou
          caminhos.forEach((caminho, i) => {
            if (chegou) caminho.setAttribute('marker-end', setas[i])
            else caminho.removeAttribute('marker-end')
          })
        }
        grupos.forEach((g, i) => {
          const deveAcender = estado.p >= porGrupo[i]
          if (deveAcender === acesos.has(g)) return
          if (deveAcender) { acesos.add(g); g.dataset.aceso = 'true' }
          else { acesos.delete(g); g.dataset.aceso = 'false' }
        })
      },
      onRepeat: () => {
        acesos.forEach((g) => { g.dataset.aceso = 'false' })
        acesos.clear()
        setaAcesa = false
        caminhos.forEach((caminho) => caminho.removeAttribute('marker-end'))
      },
    })

    luzes.forEach((l) => l?.style.setProperty('opacity', '1'))

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) tween.play()
        else tween.pause()
      },
      { threshold: 0.2 }
    )
    io.observe(wrap)

    return () => {
      io.disconnect()
      tween.kill()
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

  // Com 5 etapas numa linha de 360 de largura, o rótulo inteiro não cabe numa
  // linha só. Quebra no espaço mais perto do meio, que dá duas linhas de
  // tamanho parecido em vez de uma comprida e uma solta.
  const emDuasLinhas = (texto: string) => {
    if (texto.length <= 12) return [texto]
    const meio = texto.length / 2
    let corte = -1
    for (let i = 0; i < texto.length; i++) {
      if (texto[i] !== ' ') continue
      if (corte < 0 || Math.abs(i - meio) < Math.abs(corte - meio)) corte = i
    }
    if (corte < 0) return [texto]
    return [texto.slice(0, corte), texto.slice(corte + 1)]
  }

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
          <radialGradient id="jornada-halo">
            <stop offset="0%" stopColor="#fde100" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#fde100" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fde100" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* A seta só entra no fim: o markerEnd é desenhado na ponta geométrica
            do caminho e apareceria lá desde o começo. */}
        <path
          ref={pathRef}
          d={DESKTOP.caminho}
          className="processo-jornada__linha"
        />

        {/* A luz corre na ponta da linha. Ela é movida por transform direto no
            DOM, e o halo usa gradiente em vez de blur: filtro borrado num
            elemento que anda todo quadro custa caro e travava a animação. */}
        <g ref={luzDesktopRef} className="processo-jornada__luz">
          <circle r="38" fill="url(#jornada-halo)" />
          <circle r="11" className="processo-jornada__luz-nucleo" />
        </g>

        {DESKTOP.nos.map((no, i) => (
          <g key={etapas[i] ?? i} className="processo-jornada__no" data-indice={i} data-aceso={estatico}>
            {/* disco preto tapa a linha atrás do ícone, senão o traço cruza o
                desenho; o ícone acende junto com a etapa */}
            <circle cx={no.x} cy={no.y} r="37" className="processo-jornada__disco" />
            <image
              href={JORNADA_ICONES_LOCAIS[i]}
              x={no.x - 32}
              y={no.y - 32}
              width="64"
              height="64"
              className="processo-jornada__icone"
              preserveAspectRatio="xMidYMid meet"
            />
            {/* alterna acima/abaixo: com 5 etapas numa linha os rotulos
                vizinhos quase se encostavam no mesmo nivel */}
            <text
              x={no.x}
              y={no.y + (i % 2 === 0 ? (apoio[i] ? -98 : -66) : 78)}
              className="processo-jornada__rotulo"
              textAnchor="middle"
            >
              {etapas[i]}
            </text>
            {apoio[i] ? (
              <text
                x={no.x}
                y={no.y + (i % 2 === 0 ? -66 : 110)}
                className="processo-jornada__apoio"
                textAnchor="middle"
              >
                {apoio[i]}
              </text>
            ) : null}
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
          <radialGradient id="jornada-halo-m">
            <stop offset="0%" stopColor="#fde100" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#fde100" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fde100" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          ref={pathMobileRef}
          d={MOBILE.caminho}
          className="processo-jornada__linha"
        />

        <g ref={luzMobileRef} className="processo-jornada__luz">
          <circle r="26" fill="url(#jornada-halo-m)" />
          <circle r="8" className="processo-jornada__luz-nucleo" />
        </g>

        {MOBILE.nos.map((no, i) => (
          <g key={`m-${etapas[i] ?? i}`} className="processo-jornada__no" data-indice={i} data-aceso={estatico}>
            <circle cx={no.x} cy={no.y} r="22" className="processo-jornada__disco" />
            <image
              href={JORNADA_ICONES_LOCAIS[i]}
              x={no.x - 19}
              y={no.y - 19}
              width="38"
              height="38"
              className="processo-jornada__icone"
              preserveAspectRatio="xMidYMid meet"
            />
            {/* alterna acima/abaixo pra dois rótulos da mesma linha não colidirem */}
            <text
              x={no.x}
              y={no.y + (i % 2 === 0 ? (apoio[i] ? -66 : -42) : 42)}
              className="processo-jornada__rotulo processo-jornada__rotulo--mobile"
              textAnchor={ancora(no.x, MOBILE)}
            >
              {emDuasLinhas(etapas[i] ?? '').map((linha, l, todas) => (
                <tspan
                  key={linha}
                  x={no.x}
                  dy={l === 0 ? (i % 2 === 0 ? -(todas.length - 1) * 11 : 0) : 11}
                >
                  {linha}
                </tspan>
              ))}
            </text>
            {apoio[i] ? (
              <text
                x={no.x}
                y={no.y + (i % 2 === 0 ? -42 : 42 + 26)}
                className="processo-jornada__apoio processo-jornada__apoio--mobile"
                textAnchor={ancora(no.x, MOBILE)}
              >
                {emDuasLinhas(apoio[i]).map((linha, l) => (
                  <tspan key={linha} x={no.x} dy={l === 0 ? 0 : 10}>
                    {linha}
                  </tspan>
                ))}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  )
}
