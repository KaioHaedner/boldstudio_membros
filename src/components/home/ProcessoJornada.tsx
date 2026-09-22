import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { JORNADA_ICONES_LOCAIS } from '@/data/jornada'

// Jornada do cliente: uma luz corre o caminho e cada etapa só existe a partir do
// instante em que ela passa. Terminou, apaga tudo e recomeça.
//
// Os dois formatos são diferentes de propósito. No desktop a largura sobra, e a
// serpentina (vai, curva, volta, curva, vai) aproveita ela. No celular não tem
// largura nenhuma pra dividir entre 4 ou 5 etapas, então o caminho desce
// ondulando e cada etapa ganha uma faixa só dela, com o número e o nome ao lado.

type No = { x: number; y: number }

type Caminho = { caminho: string; nos: No[]; altura: number }

// ---------- desktop: serpentina ----------

function montarSerpentina(
  largura: number,
  margem: number,
  raio: number,
  espacoEntreLinhas: number,
  porLinha: number[],
  // recuo extra das pontas: o ponto já assenta na reta com o raio, mas o rótulo
  // dele ainda alcançava a curva que desce pra próxima fileira
  folga = 0,
  // quanto a linha passa do último ícone, pra seta caber fora do disco dele
  sobraFinal = 60,
  // folga de cima e de baixo, separada da lateral: os nomes da primeira fileira
  // sobem bastante e invadiam o título da seção
  margemTopo = margem
): Caminho {
  const esq = margem
  const dir = largura - margem
  const ys = porLinha.map((_, linha) => margemTopo + linha * espacoEntreLinhas)

  // As pontas recuam o tamanho do raio. Sem isso o ponto da ponta cai no canto
  // exato que a curva arredonda: a linha passa por dentro e o ícone fica solto,
  // fora do traço. Recuado, todo ponto assenta num trecho reto.
  const nos: No[] = []
  porLinha.forEach((quantidade, linha) => {
    const paraDireita = linha % 2 === 0
    const util = largura - (margem + raio + folga) * 2
    const passo = quantidade > 1 ? util / (quantidade - 1) : 0
    for (let i = 0; i < quantidade; i++) {
      const avanco = margem + raio + folga + passo * i
      nos.push({ x: paraDireita ? avanco : largura - avanco, y: ys[linha] })
    }
  })

  // Começa exatamente no primeiro ícone: antes o traço nascia na margem e a luz
  // aparecia num pedaço de linha antes da primeira etapa, como se estivesse
  // solta.
  const primeiro = nos[0]
  const ultimo = nos[nos.length - 1]
  const ultimaParaDireita = (porLinha.length - 1) % 2 === 0
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

  return { caminho: partes.join(' '), nos, altura: ys[ys.length - 1] + margemTopo }
}

// ---------- celular: descida ondulada ----------

// Curva suave passando por todos os pontos (Catmull-Rom convertido em Bézier).
// É o que dá a ondulação contínua em vez de cantos.
function curvaSuave(pontos: No[]) {
  if (pontos.length < 2) return ''
  const partes = [`M ${pontos[0].x} ${pontos[0].y}`]
  for (let i = 0; i < pontos.length - 1; i++) {
    const anterior = pontos[i - 1] ?? pontos[i]
    const atual = pontos[i]
    const proximo = pontos[i + 1]
    const seguinte = pontos[i + 2] ?? proximo
    const c1 = {
      x: atual.x + (proximo.x - anterior.x) / 6,
      y: atual.y + (proximo.y - anterior.y) / 6,
    }
    const c2 = {
      x: proximo.x - (seguinte.x - atual.x) / 6,
      y: proximo.y - (seguinte.y - atual.y) / 6,
    }
    partes.push(`C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${proximo.x} ${proximo.y}`)
  }
  return partes.join(' ')
}

function montarDescida(
  largura: number,
  quantidade: number,
  opcoes: { topo: number; passo: number; amplitude: number; periodo: number; sobraFinal: number; base: number }
): Caminho {
  const { topo, passo, amplitude, periodo, sobraFinal, base } = opcoes
  const centro = largura / 2
  const nos: No[] = Array.from({ length: quantidade }, (_, i) => ({
    x: centro + amplitude * Math.sin((i * 2 * Math.PI) / periodo),
    y: topo + i * passo,
  }))
  const ultimo = nos[nos.length - 1]
  return {
    caminho: curvaSuave([...nos, { x: ultimo.x, y: ultimo.y + sobraFinal }]),
    nos,
    altura: ultimo.y + sobraFinal + base,
  }
}

// 13 etapas: 4 + 5 + 4 no desktop, uma embaixo da outra no celular.
const DESKTOP = montarSerpentina(1200, 90, 60, 290, [4, 5, 4], 80, 60, 130)
const MOBILE = montarDescida(360, 13, {
  topo: 46,
  passo: 96,
  amplitude: 46,
  periodo: 5,
  sobraFinal: 54,
  base: 44,
})

export function ProcessoJornada({ etapas }: { etapas: readonly string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const pathMobileRef = useRef<SVGPathElement>(null)
  const luzDesktopRef = useRef<SVGGElement>(null)
  const luzMobileRef = useRef<SVGGElement>(null)
  // Com "reduzir movimento" a jornada já nasce inteira acesa, sem animar.
  const [estatico] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // os dois caminhos são desenhados juntos; só um está visível por vez, mas
    // assim o mesmo progresso serve para ambos
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
          if (deveAcender) {
            acesos.add(g)
            g.dataset.aceso = 'true'
          } else {
            acesos.delete(g)
            g.dataset.aceso = 'false'
          }
        })
      },
      onRepeat: () => {
        acesos.forEach((g) => {
          g.dataset.aceso = 'false'
        })
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
  }, [etapas.length])

  // Lado de cada nome no desktop. É lista, e não fórmula, porque foi decidido
  // etapa por etapa pelo cliente: a alternância quebra na Pós-Produção, que ele
  // quis acima junto com a Captações.
  const ACIMA = [
    false, // Reunião Inicial
    true, //  Apresentação da Proposta
    false, // Onboard Cliente
    true, //  Referências e Moodboard
    false, // Desenvolvimento de Roteiros
    true, //  Cronograma de Captações
    false, // PPM
    true, //  Captações
    true, //  Pós-Produção
    false, // Entrega de Material Prévio
    true, //  Rodada de Ajustes
    false, // Entrega de Material Final
    true, //  Fechamento e Feedback
  ]
  const acimaDoNo = (i: number) => ACIMA[i] ?? i % 2 === 1

  // No celular o nome vai pro lado de fora da onda, que é onde sobra espaço, e
  // quebra em duas linhas quando é comprido — numa tela de 360 nenhum nome
  // inteiro cabe de uma vez.
  const emDuasLinhas = (texto: string) => {
    if (texto.length <= 14) return [texto]
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

        <path ref={pathRef} d={DESKTOP.caminho} className="processo-jornada__linha" />

        {/* A luz corre na ponta da linha. É movida por transform direto no DOM,
            e o halo usa gradiente em vez de blur: filtro borrado num elemento
            que anda todo quadro custa caro e travava a animação. */}
        <g ref={luzDesktopRef} className="processo-jornada__luz">
          <circle r="38" fill="url(#jornada-halo)" />
          <circle r="11" className="processo-jornada__luz-nucleo" />
        </g>

        {DESKTOP.nos.map((no, i) => (
          <g key={etapas[i] ?? i} className="processo-jornada__no" data-indice={i} data-aceso={estatico}>
            {/* o disco preto tapa a linha atrás do ícone, senão o traço cruza o
                desenho */}
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
            {/* alterna acima/abaixo: com 5 etapas numa fileira, os nomes
                vizinhos se encostavam no mesmo nível */}
            <text
              x={no.x}
              y={no.y + (acimaDoNo(i) ? -62 : 76)}
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
          <radialGradient id="jornada-halo-m">
            <stop offset="0%" stopColor="#fde100" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#fde100" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fde100" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path ref={pathMobileRef} d={MOBILE.caminho} className="processo-jornada__linha" />

        <g ref={luzMobileRef} className="processo-jornada__luz">
          <circle r="26" fill="url(#jornada-halo-m)" />
          <circle r="8" className="processo-jornada__luz-nucleo" />
        </g>

        {MOBILE.nos.map((no, i) => {
          // o texto fica do lado de fora da onda, que é onde sobra largura
          const paraDireita = no.x < 180
          const alvoX = no.x + (paraDireita ? 34 : -34)
          const linhas = emDuasLinhas(etapas[i] ?? '')
          return (
            <g key={`m-${etapas[i] ?? i}`} className="processo-jornada__no" data-indice={i} data-aceso={estatico}>
              <circle cx={no.x} cy={no.y} r="24" className="processo-jornada__disco" />
              <image
                href={JORNADA_ICONES_LOCAIS[i]}
                x={no.x - 21}
                y={no.y - 21}
                width="42"
                height="42"
                className="processo-jornada__icone"
                preserveAspectRatio="xMidYMid meet"
              />
              <text
                x={alvoX}
                y={no.y + (linhas.length > 1 ? -3 : 5)}
                className="processo-jornada__rotulo processo-jornada__rotulo--mobile"
                textAnchor={paraDireita ? 'start' : 'end'}
              >
                {linhas.map((linha, l) => (
                  <tspan key={linha} x={alvoX} dy={l === 0 ? 0 : 15}>
                    {linha}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
