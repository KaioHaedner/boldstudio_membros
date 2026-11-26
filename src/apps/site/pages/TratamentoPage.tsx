import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useBioButtonAuras } from '@/shared/hooks/useBioButtonAuras'
import { useTratamentoMotion } from './useTratamentoMotion'
import './TratamentoPage.css'
import {
  BLOCOS,
  CAMERA,
  CAPA,
  FOTOGRAFIA,
  LINKS_BOLD,
  MIDIAS,
  SOBRE,
  SOM,
  estadoTratamentoInicial,
  normalizarEstadoTratamento,
  type BlocoTexto,
  type EstadoTratamento,
} from '@/apps/site/data/tratamentos'

// Só existe o tratamento da John Deere por enquanto; a rota já aceita o nome do
// cliente para o próximo.
const LOGO_BOLD = '/brand/bold-logo-apresentacao.png'
const CLIENTES_OK = ['jhondeere']

type Layout = 'tratores' | 'bold'
type SectionTone = 'white' | 'black' | 'yellow'

function isSectionTone(valor: string | undefined): valor is SectionTone {
  return valor === 'white' || valor === 'black' || valor === 'yellow'
}

function lerEstadoSalvo(chave: string): EstadoTratamento {
  try {
    const bruto = localStorage.getItem(chave)
    if (bruto) return normalizarEstadoTratamento(JSON.parse(bruto))
  } catch {
    /* sem armazenamento ou JSON inválido: segue com a ordem do documento */
  }
  return estadoTratamentoInicial()
}

// ---------- parallax ----------
// Um único ouvinte de scroll para a página inteira: só mexe nos elementos que
// estão na tela e só escreve uma variável CSS (transform, que não pesa).
function useParalaxe(raiz: RefObject<HTMLElement | null>, chave: string) {
  useEffect(() => {
    const raizEl = raiz.current
    if (!raizEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const visiveis = new Set<HTMLElement>()
    const alvos = raizEl.querySelectorAll<HTMLElement>('[data-par]')
    const capa = raizEl.querySelector<HTMLElement>('#capa')
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          const el = e.target as HTMLElement
          if (e.isIntersecting) visiveis.add(el)
          else visiveis.delete(el)
        })
        pede()
      },
      { rootMargin: '20% 0px' },
    )
    let quadro = 0
    const desenha = () => {
      quadro = 0
      const vh = window.innerHeight
      visiveis.forEach((el) => {
        const r = el.getBoundingClientRect()
        const p = (r.top + r.height / 2 - vh / 2) / vh
        const v = Number(el.dataset.vel || '1')
        const alcance = el.closest('#obrigado') ? 50 : 96
        el.style.setProperty('--py', `${(-p * v * alcance).toFixed(1)}px`)
      })
    }
    const pede = () => {
      if (!quadro) quadro = requestAnimationFrame(desenha)
    }
    const moveCapa = (event: PointerEvent) => {
      if (!capa || event.pointerType === 'touch') return
      const rect = capa.getBoundingClientRect()
      capa.style.setProperty('--capa-x', `${((event.clientX - rect.left) / rect.width - .5) * 48}px`)
      capa.style.setProperty('--capa-y', `${((event.clientY - rect.top) / rect.height - .5) * 36}px`)
    }
    const limpaCapa = () => {
      capa?.style.removeProperty('--capa-x')
      capa?.style.removeProperty('--capa-y')
    }
    alvos.forEach(el => io.observe(el))
    capa?.addEventListener('pointermove', moveCapa, { passive: true })
    capa?.addEventListener('pointerleave', limpaCapa)
    window.addEventListener('scroll', pede, { passive: true })
    window.addEventListener('resize', pede)
    pede()
    return () => {
      window.removeEventListener('scroll', pede)
      window.removeEventListener('resize', pede)
      cancelAnimationFrame(quadro)
      io.disconnect()
      alvos.forEach(el => el.style.removeProperty('--py'))
      capa?.removeEventListener('pointermove', moveCapa)
      capa?.removeEventListener('pointerleave', limpaCapa)
      limpaCapa()
    }
  }, [raiz, chave])
}

// ---------- mídia ----------
function Midia({
  id,
  proporcao,
  indice,
  selecionavel,
  selecionada,
  aoSelecionar,
}: {
  id: string
  proporcao: string
  indice: number
  selecionavel: boolean
  selecionada: boolean
  aoSelecionar: (id: string) => void
}) {
  const m = Object.hasOwn(MIDIAS, id) ? MIDIAS[id] : undefined
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = videoRef.current
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) void v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
    return () => { io.disconnect(); v.pause() }
  }, [])
  if (!m) return null
  const vel = 0.7 + ((indice * 37) % 7) / 10
  return (
    <figure
      className={`trat-midia${selecionada ? ' is-selecionada' : ''}${selecionavel ? ' is-selecionavel' : ''}`}
      style={{ aspectRatio: proporcao }}
      data-par
      data-vel={vel}
      data-motion-frame
      data-midia={id}
    >
      <div className="trat-midia__frame">
      <div className="trat-midia__inner">
        {m.tipo === 'video' ? (
          <video ref={videoRef} src={m.src} poster={m.poster} muted loop playsInline preload="none" draggable={false} />
        ) : (
          <img src={m.src} alt="" loading="lazy" decoding="async" draggable={false} />
        )}
      </div>
      </div>
      {selecionavel && (
        <button type="button" className="trat-midia__escolher" aria-label={`Selecionar mídia ${id.slice(1)}`}
          aria-pressed={selecionada} onClick={() => aoSelecionar(id)}>
          <span className="trat-midia__selo" aria-hidden="true">{id.slice(1)}</span>
        </button>
      )}
    </figure>
  )
}

// ---------- YouTube (API oficial: player e oEmbed) ----------
type YTPlayer = { destroy: () => void }
type YTGlobal = { Player: new (el: HTMLElement, op: Record<string, unknown>) => YTPlayer }
declare global {
  interface Window {
    YT?: YTGlobal
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiYT: Promise<YTGlobal> | null = null
function carregarApiYT(): Promise<YTGlobal> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!apiYT) {
    apiYT = new Promise((ok, falhou) => {
      const anterior = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        anterior?.()
        if (window.YT?.Player) ok(window.YT)
      }
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      s.onerror = () => {
        apiYT = null
        falhou(new Error('Falha ao carregar YouTube IFrame API'))
      }
      document.head.appendChild(s)
    })
  }
  return apiYT
}

function VideoYouTube({ id, aviso }: { id: string; aviso?: string }) {
  const [ativo, setAtivo] = useState(false)
  const [capa, setCapa] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)
  const alvoRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ativo || !alvoRef.current) return
    let player: YTPlayer | null = null
    let vivo = true
    void carregarApiYT()
      .then((YT) => {
        if (!vivo || !alvoRef.current) return
        const el = document.createElement('div')
        alvoRef.current.appendChild(el)
        player = new YT.Player(el, {
          videoId: id,
          width: '100%',
          height: '100%',
          playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        })
      })
      .catch(() => {
        if (vivo) setAtivo(false)
      })
    return () => {
      vivo = false
      player?.destroy()
    }
  }, [ativo, id])

  return (
    <div className="trat-yt">
      {aviso && (
        <p className="trat-aviso" role="note">
          <span className="trat-aviso__icone" aria-hidden="true">!</span>
          <strong>Importante:</strong>
          <span>{aviso}</span>
        </p>
      )}
      <div className="trat-yt__quadro">
        {ativo ? (
          <div ref={alvoRef} className="trat-yt__player" />
        ) : (
          <button type="button" className="trat-yt__capa" onClick={() => setAtivo(true)} aria-label="Reproduzir vídeo">
            <img src={capa} alt="" loading="lazy" onError={() => setCapa(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)} />
            <span className="trat-yt__play" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

// ícone de link externo: quadradinho aberto com a seta diagonal saindo
function IconeExterno() {
  return (
    <svg className="trat-icone" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  )
}

// ícones das marcas, cada um na cor oficial da própria marca
function IconeMarca({ tipo }: { tipo: string }) {
  const tracos = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <span className={`trat-marca trat-marca--${tipo}`} aria-hidden="true">
      {tipo === 'site' && <img src="/brand/favicon-96.png" alt="" />}
      {tipo === 'instagram' && (
        <svg viewBox="0 0 24 24" {...tracos}>
          <path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
          <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />
          <path d="M16.5 7.5v.01" />
        </svg>
      )}
      {tipo === 'whatsapp' && (
        <svg viewBox="0 0 24 24" {...tracos}>
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
      )}
      {tipo === 'email' && (
        <svg viewBox="0 0 24 24" {...tracos}>
          <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      )}
    </span>
  )
}

// Ondas finas que fluem devagar no fundo. O desenho tem o dobro da largura e
// anda metade dela, então o laço fecha sem emenda; só transform, que não pesa.
const ONDAS = Array.from({ length: 7 }, (_, i) => {
  const y = 70 + i * 76
  const a = 18 + i * 6
  return {
    d: `M 0 ${y} Q 150 ${y - a} 300 ${y} T 600 ${y} T 900 ${y} T 1200 ${y} T 1500 ${y} T 1800 ${y} T 2100 ${y} T 2400 ${y}`,
    o: 0.35 + i * 0.09,
  }
})

function Ondas() {
  return (
    <svg className="trat-ondas" viewBox="0 0 2400 600" preserveAspectRatio="none" aria-hidden="true">
      {ONDAS.map((o, i) => <path key={i} d={o.d} style={{ opacity: o.o }} />)}
    </svg>
  )
}

function Secao({ id, tone, children }: { id: string; tone: SectionTone; children: React.ReactNode }) {
  return (
    <section id={id} className="trat-secao" data-trat-tone={tone}>
      <Ondas />
      <div className="trat-secao__miolo">{children}</div>
    </section>
  )
}

function Titulo({ texto }: { texto: string }) {
  return <h2 className="trat-titulo">{texto}</h2>
}

function Texto({ partes }: { partes: string[] }) {
  return (
    <div className="trat-corpo">
      {partes.map((texto, indice) => <p key={indice}>{texto}</p>)}
    </div>
  )
}

function Falas({ falas }: { falas: NonNullable<BlocoTexto['exemplo']> }) {
  return (
    <div className="trat-falas">
      {falas.map(({ fala, texto }, indice) => (
        <blockquote key={indice}>
          <strong>{fala}</strong>
          <p>{texto}</p>
        </blockquote>
      ))}
    </div>
  )
}

// Mídias grandes: no máximo duas por linha. A de destaque ocupa a largura toda.
function Galeria({ ids, cheia = 'primeira', render }: {
  ids: string[]
  cheia?: 'primeira' | 'ultima' | 'todas'
  render: (id: string, indice: number) => React.ReactNode
}) {
  if (ids.length === 0) return null
  const linhas: string[][] = []
  if (cheia === 'todas') ids.forEach(id => linhas.push([id]))
  else {
    const resto = [...ids]
    const destaque = cheia === 'ultima' ? resto.pop() : resto.shift()
    if (cheia === 'primeira' && destaque) linhas.push([destaque])
    while (resto.length) linhas.push(resto.length === 1 ? [resto.shift()!] : [resto.shift()!, resto.shift()!])
    if (cheia === 'ultima' && destaque) linhas.push([destaque])
  }
  let n = 0
  return (
    <div className="trat-galeria">
      {linhas.map((linha, i) => (
        <div key={i} className="trat-faixa" style={{ '--colunas': linha.length } as CSSProperties}>
          {linha.map(id => render(id, n++))}
        </div>
      ))}
    </div>
  )
}

function Carrossel({ ids, render }: { ids: string[]; render: (id: string, indice: number) => React.ReactNode }) {
  const [passo, setPasso] = useState(0)
  useEffect(() => {
    if (ids.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setPasso(s => (s + 1) % ids.length), 3200)
    return () => window.clearInterval(t)
  }, [ids.length])
  if (ids.length === 0) return null
  const meio = Math.floor(Math.min(ids.length, 3) / 2)
  return (
    <div className="trat-carrossel" style={{ '--itens': ids.length } as CSSProperties}>
      {ids.map((id, i) => {
        const posicao = (i - passo + ids.length) % ids.length
        return (
          <div key={id} className={`trat-carrossel__item${posicao === meio ? ' is-centro' : ''}`} style={{ order: posicao }}>
            {render(id, i)}
          </div>
        )
      })}
    </div>
  )
}

function Sugestao({ rotulo, intro, falas, solta, lado }: {
  rotulo: string
  intro?: string
  falas: NonNullable<BlocoTexto['exemplo']>
  solta?: boolean
  lado?: boolean
}) {
  return (
    <div className={`trat-sugestao${solta ? ' trat-sugestao--solta' : ''}${lado ? ' trat-sugestao--lado' : ''}`}>
      <p className="trat-sugestao__rotulo">
        {solta && <svg className="trat-sugestao__seta" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="m205.66 149.66l-72 72a8 8 0 0 1-11.32 0l-72-72a8 8 0 0 1 11.32-11.32L120 196.69V40a8 8 0 0 1 16 0v156.69l58.34-58.35a8 8 0 0 1 11.32 11.32"/></svg>}
        {rotulo}
      </p>
      {intro && <p className="trat-sugestao__intro">{intro}</p>}
      <Falas falas={falas} />
    </div>
  )
}

function BlocoView({
  bloco, ids, controle, selecionada, aoSelecionar,
}: {
  bloco: BlocoTexto
  ids: string[]
  controle: boolean
  selecionada: string | null
  aoSelecionar: (id: string) => void
}) {
  const midia = (id: string, indice: number) => {
    const item = Object.hasOwn(MIDIAS, id) ? MIDIAS[id] : undefined
    if (!item) return null
    return (
      <Midia key={id} id={id} proporcao="16 / 9" indice={indice}
        selecionavel={controle} selecionada={selecionada === id} aoSelecionar={aoSelecionar} />
    )
  }
  const topoEmDestaque = bloco.id === 'tom'
  const cabecalho = (
    <header className={`trat-cabecalho${topoEmDestaque ? ' trat-cabecalho--topico' : ''}`}>
      <p className="trat-eyebrow">{topoEmDestaque ? bloco.eyebrow.replace(' & ', ' &\n') : bloco.eyebrow}</p>
      <Titulo texto={bloco.titulo} />
    </header>
  )
  const video = bloco.video && <VideoYouTube key={bloco.video} id={bloco.video} aviso={bloco.aviso} />
  const sugestao = bloco.exemplo && bloco.sugestao && (
    <Sugestao rotulo={bloco.sugestao.rotulo} intro={bloco.sugestao.intro} falas={bloco.exemplo} solta={bloco.id === 'b1'} lado={bloco.id === 'b3'} />
  )

  const duasColunas = (texto: React.ReactNode, amarelo = false) => (
    <div className="trat-topo2">
      {cabecalho}
      <div className={`trat-topo2__texto${amarelo ? ' is-amarelo' : ''}`}>{texto}</div>
    </div>
  )
  const grade = (lista: string[], colunas: number, classe = '') => lista.length > 0 && (
    <div className={`trat-faixa ${classe}`.trim()} style={{ '--colunas': colunas } as CSSProperties}>
      {lista.map(midia)}
    </div>
  )

  // texto e imagens intercalados: cada parágrafo traz logo abaixo as imagens dele
  const grupos = bloco.grupos
  let corpo: React.ReactNode
  if (bloco.id === 'tom') {
    // um texto único, sem quebra de parágrafo
    corpo = <>{duasColunas(<Texto partes={[bloco.paragrafos.join(' ')]} />)}{video}</>
  } else if (bloco.id === 'b2') {
    corpo = (
      <>
        {duasColunas(<Texto partes={[bloco.paragrafos[0]]} />)}
        {grade(ids.slice(0, 2), 2, 'trat-faixa--menor')}
        <Texto partes={[bloco.paragrafos[1]]} />
        <Carrossel ids={ids.slice(2)} render={midia} />
      </>
    )
  } else if (bloco.id === 'b3') {
    corpo = (
      <>
        {duasColunas(<Texto partes={[bloco.paragrafos[0]]} />, true)}
        {grade(ids.slice(0, 2), 2, 'trat-faixa--cafe')}
        <p className="trat-linha">{bloco.paragrafos[1]}</p>
        {grade(ids.slice(2), 3)}
      </>
    )
  } else if (grupos && grupos.length) {
    let pos = 0
    corpo = bloco.paragrafos.map((p, i) => {
      const g = grupos[i]
      const fatia = g ? ids.slice(pos, pos + g.n) : []
      pos += g ? g.n : 0
      const ultimo = i === bloco.paragrafos.length - 1
      return (
        <div className="trat-trecho" key={i}>
          <Texto partes={[p]} />
          <Galeria ids={ultimo ? [...fatia, ...ids.slice(pos)] : fatia} cheia={g?.cheia} render={midia} />
        </div>
      )
    })
  } else {
    corpo = (
      <>
        <Texto partes={bloco.paragrafos} />
        {bloco.id === 'b1' ? (
          <div className="trat-kellen">{video}{sugestao}</div>
        ) : video}
        <Galeria ids={ids} render={midia} />
      </>
    )
  }

  // todos os blocos sobre o mesmo fundo verde: o amarelo fica só nos detalhes
  const tone = 'black'
  return (
    <Secao id={bloco.id} tone={tone}>
      {!['tom', 'b2', 'b3'].includes(bloco.id) && cabecalho}
      {corpo}
      {bloco.id !== 'b1' && sugestao}
      {bloco.nota && <p className="trat-nota">“{bloco.nota}”</p>}
    </Secao>
  )
}

// ---------- controle remoto ----------
function Controle({
  layout,
  aoLayout,
  estado,
  aoMudar,
  selecionada,
  aoSelecionar,
  aoLocalizar,
  fechar,
}: {
  layout: Layout
  aoLayout: (l: Layout) => void
  estado: EstadoTratamento
  aoMudar: (e: EstadoTratamento) => void
  selecionada: string | null
  aoSelecionar: (id: string | null) => void
  aoLocalizar: (id: string) => void
  fechar: () => void
}) {
  const [copiado, setCopiado] = useState(false)
  const timerRef = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const atual = BLOCOS.find(b => selecionada && estado.ordem[b.id].includes(selecionada))
  const oculta = selecionada ? estado.ocultas.includes(selecionada) : false
  const ordemAtual = atual ? estado.ordem[atual.id] : []
  const visiveis = ordemAtual.filter(id => !estado.ocultas.includes(id))
  const posicao = selecionada ? visiveis.indexOf(selecionada) : -1
  const ocultasValidas = estado.ocultas.filter((id) => Object.hasOwn(MIDIAS, id))

  const mover = (delta: number) => {
    if (!selecionada || !atual || posicao < 0) return
    const vizinha = visiveis[posicao + delta]
    if (!vizinha) return
    const lista = [...ordemAtual]
    const i = lista.indexOf(selecionada)
    const j = lista.indexOf(vizinha)
    ;[lista[i], lista[j]] = [lista[j], lista[i]]
    aoMudar({ ...estado, ordem: { ...estado.ordem, [atual.id]: lista } })
    aoLocalizar(selecionada)
  }
  const paraBloco = (destino: string) => {
    if (!selecionada || !atual || destino === atual.id || !Object.hasOwn(estado.ordem, destino)) return
    aoMudar({
      ...estado,
      ordem: {
        ...estado.ordem,
        [atual.id]: ordemAtual.filter((x) => x !== selecionada),
        [destino]: [...estado.ordem[destino], selecionada],
      },
    })
    if (!oculta) aoLocalizar(selecionada)
  }
  const alternarOculta = (id: string) =>
    aoMudar({ ...estado, ocultas: estado.ocultas.includes(id) ? estado.ocultas.filter((x) => x !== id) : [...estado.ocultas, id] })

  const copiar = () => {
    const texto = JSON.stringify(
      { layout, blocos: Object.fromEntries(BLOCOS.map((b) => [b.id, estado.ordem[b.id].filter((x) => !estado.ocultas.includes(x))])) },
      null,
      2,
    )
    if (!navigator.clipboard?.writeText) return
    void navigator.clipboard
      .writeText(texto)
      .then(() => {
        setCopiado(true)
        window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => setCopiado(false), 1800)
      })
      .catch(() => {})
  }

  return (
    <aside className="trat-controle" aria-label="Controle de mídias">
      <header>
        <strong>Controle da apresentação</strong>
        <button type="button" onClick={fechar} aria-label="Fechar controle"><X size={16} /></button>
      </header>
      <div className="trat-controle__grupo">
        <span>Paleta</span>
        <div className="trat-controle__duo">
          <button type="button" aria-pressed={layout === 'tratores'} className={layout === 'tratores' ? 'is-on' : ''} onClick={() => aoLayout('tratores')}>John Deere</button>
          <button type="button" aria-pressed={layout === 'bold'} className={layout === 'bold' ? 'is-on' : ''} onClick={() => aoLayout('bold')}>Bold Studio</button>
        </div>
      </div>
      <div className="trat-controle__grupo">
        <label>
          Mídia
          <select value={selecionada ?? ''} onChange={event => {
            const id = event.target.value
            aoSelecionar(id || null)
            if (id && !estado.ocultas.includes(id)) aoLocalizar(id)
          }}>
            <option value="">Selecione um quadro</option>
            {BLOCOS.filter(b => estado.ordem[b.id].length > 0).map(b => (
              <optgroup key={b.id} label={b.menu}>
                {estado.ordem[b.id].map(id => <option key={id} value={id}>Quadro {id.slice(1)}{estado.ocultas.includes(id) ? ' (oculto)' : ''}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        {selecionada && atual ? (
          <>
            <div className="trat-controle__sel">
              <img src={MIDIAS[selecionada].poster} alt="" />
              <b>{selecionada.replace('m', '#')}</b>
              <small aria-live="polite">{atual.menu} · {oculta ? 'Oculto' : `${posicao + 1} de ${visiveis.length}`}</small>
            </div>
            <div className="trat-controle__duo">
              <button type="button" disabled={posicao <= 0} onClick={() => mover(-1)}>← Antes</button>
              <button type="button" disabled={posicao < 0 || posicao === visiveis.length - 1} onClick={() => mover(1)}>Depois →</button>
            </div>
            <label>
              Mover para
              <select value={atual.id} onChange={(e) => paraBloco(e.target.value)}>
                {BLOCOS.map((b) => (
                  <option key={b.id} value={b.id}>{b.menu} · {b.titulo}</option>
                ))}
              </select>
            </label>
            <button type="button" className="trat-controle__perigo" onClick={() => alternarOculta(selecionada)}>
              {oculta ? 'Mostrar de novo' : 'Esconder'}
            </button>
          </>
        ) : (
          <p>Selecione um quadro para mover ou ocultar.</p>
        )}
      </div>
      {ocultasValidas.length > 0 && (
        <div className="trat-controle__grupo">
          <span>Escondidas ({ocultasValidas.length})</span>
          <div className="trat-controle__tira">
            {ocultasValidas.map((id) => (
              <button key={id} type="button" onClick={() => alternarOculta(id)} title="Mostrar de novo">
                <img src={MIDIAS[id].poster} alt="" />
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="trat-controle__duo">
        <button type="button" onClick={copiar}>{copiado ? 'Copiado' : 'Copiar ordem'}</button>
        <button type="button" onClick={() => { aoMudar(estadoTratamentoInicial()); aoSelecionar(null) }}>Restaurar</button>
      </div>
    </aside>
  )
}

// ---------- página ----------
export function TratamentoPage() {
  const { cliente = '' } = useParams()
  const [busca, setBusca] = useSearchParams()
  const layout: Layout = busca.get('layout') === 'bold' ? 'bold' : 'tratores'
  const limpo = busca.has('limpo')
  const chaveSalva = `tratamento-${cliente}-v3`

  const [estadoPorChave, setEstadoPorChave] = useState<{ chave: string; estado: EstadoTratamento }>(() => ({
    chave: chaveSalva,
    estado: lerEstadoSalvo(chaveSalva),
  }))
  const estado = estadoPorChave.chave === chaveSalva ? estadoPorChave.estado : lerEstadoSalvo(chaveSalva)
  const setEstado = (novoEstado: EstadoTratamento) => setEstadoPorChave({ chave: chaveSalva, estado: novoEstado })

  const [aberto, setAberto] = useState(false)
  const [selecionada, setSelecionada] = useState<string | null>(null)
  const [localizar, setLocalizar] = useState<{ id: string } | null>(null)
  const raiz = useRef<HTMLDivElement>(null)
  const cameraAuras = useBioButtonAuras<HTMLDivElement>()
  const [controlTone, setControlTone] = useState<SectionTone>('white')

  useEffect(() => {
    try {
      localStorage.setItem(chaveSalva, JSON.stringify({ ...estado, versao: 2 }))
    } catch {
      /* ignora */
    }
  }, [estado, chaveSalva])

  useEffect(() => {
    const anterior = document.title
    document.title = 'Tratamento de roteiro · John Deere'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex,nofollow'
    document.head.appendChild(robots)
    return () => {
      document.title = anterior
      robots.remove()
    }
  }, [])

  useEffect(() => {
    const root = raiz.current
    if (!root || limpo) return
    let quadro = 0
    const atualizar = () => {
      quadro = 0
      const ponto = window.innerHeight - 34
      const secoes = Array.from(root.querySelectorAll<HTMLElement>('[data-trat-tone]'))
      const secao = secoes.find(el => {
        const rect = el.getBoundingClientRect()
        return rect.top <= ponto && rect.bottom > ponto
      })
      if (!secao) { setControlTone('white'); return }
      const rawTone = secao.dataset.tratTone
      const tone: SectionTone = isSectionTone(rawTone) ? rawTone : 'white'
      setControlTone(tone)
    }
    const agendar = () => { if (!quadro) quadro = requestAnimationFrame(atualizar) }
    const resize = new ResizeObserver(agendar)
    resize.observe(root)
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    atualizar()
    return () => {
      resize.disconnect()
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
    }
  }, [limpo])

  const visiveis = useMemo(
    () => Object.fromEntries(BLOCOS.map((b) => [b.id, (estado.ordem[b.id] ?? []).filter((id) => !estado.ocultas.includes(id) && Object.hasOwn(MIDIAS, id))])),
    [estado],
  )
  const controle = aberto && !limpo
  const chaveEstrutura = useMemo(() => JSON.stringify(visiveis), [visiveis])
  useParalaxe(raiz, chaveEstrutura)
  useTratamentoMotion(raiz, chaveEstrutura)
  useEffect(() => {
    if (!localizar) return
    const quadro = raiz.current?.querySelector<HTMLElement>(`[data-midia="${localizar.id}"]`)
    quadro?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [localizar])

  if (!CLIENTES_OK.includes(cliente)) return <Navigate to="/" replace />

  const mudarLayout = (l: Layout) => {
    const p = new URLSearchParams(busca)
    if (l === 'bold') p.set('layout', 'bold')
    else p.delete('layout')
    setBusca(p, { replace: true })
  }

  return (
    <div className="trat" data-layout={layout} data-control-tone={controlTone} ref={raiz}>
      <header id="capa" className="trat-capa" data-trat-tone="white" data-par data-vel={1.9}>
        <Ondas />
        <div className="trat-capa__logo">
          <img src={LOGO_BOLD} alt="Bold Studio" width="1357" height="486" fetchPriority="high" />
        </div>
      </header>

      <main>
        <Secao id="sobre" tone="white">
          <div className="trat-topo2">
            <header className="trat-cabecalho trat-cabecalho--topico">
              <p className="trat-eyebrow">{SOBRE.eyebrow}</p>
              <Titulo texto={SOBRE.titulo} />
            </header>
            <div className="trat-topo2__texto is-amarelo"><Texto partes={[SOBRE.texto]} /></div>
          </div>
          <figure className="trat-sobre__foto">
            <img src={SOBRE.foto} alt="Equipe da Bold Studio filmando no campo" loading="lazy" decoding="async" />
          </figure>
        </Secao>

        <Secao id="john-deere" tone="white">
          <header className="trat-jd__cabecalho">
            <h1>{CAPA.titulo}</h1>
            <span className="trat-jd__marca">
              <img src="/brand/clients/john-deere-branco.webp" alt="John Deere" />
            </span>
          </header>
          <div className="trat-jd__cena">
            <Midia id={CAPA.midia} proporcao="1431 / 617" indice={0} selecionavel={false} selecionada={false} aoSelecionar={() => {}} />
            <p>{CAPA.texto}</p>
          </div>
        </Secao>

        <div className="trat-palco">
        {BLOCOS.map(bloco => (
          <BlocoView key={bloco.id} bloco={bloco} ids={visiveis[bloco.id]} controle={controle}
            selecionada={selecionada} aoSelecionar={id => setSelecionada(atual => atual === id ? null : id)} />
        ))}

        <Secao id="camera" tone="black">
          <header className="trat-cabecalho trat-cabecalho--topico">
            <p className="trat-eyebrow">{CAMERA.eyebrow}</p>
            <Titulo texto={CAMERA.titulo} />
          </header>
          <div ref={cameraAuras}><ul className="trat-lista">
            {CAMERA.itens.map((texto, indice) => (
              <li key={texto}>
                <canvas className="trat-camera__aura" data-bio-aura={indice * 2.35} aria-hidden="true" />
                <span>{texto.replace(/[.!?]+$/, '')}.</span>
              </li>
            ))}
          </ul></div>
        </Secao>

        <Secao id="fotografia" tone="black">
          <header className="trat-cabecalho trat-cabecalho--topico">
            <p className="trat-eyebrow">{FOTOGRAFIA.eyebrow}</p>
            <Titulo texto={FOTOGRAFIA.titulo} />
          </header>
          <Texto partes={[FOTOGRAFIA.texto]} />
          <Galeria ids={FOTOGRAFIA.midias} render={(id, i) => (
            <Midia key={id} id={id} proporcao="16 / 9" indice={i} selecionavel={false} selecionada={false} aoSelecionar={() => {}} />
          )} />
        </Secao>

        <div className="trat-palco__encerramento">
        <Secao id="som" tone="black">
          <header className="trat-cabecalho trat-cabecalho--topico">
            <p className="trat-eyebrow">{SOM.eyebrow}</p>
            <Titulo texto={SOM.titulo} />
          </header>
          <div className="trat-som">
            {SOM.itens.map(item => <article key={item.nome}><h3>{item.nome}</h3><p>{item.texto}</p></article>)}
          </div>
        </Secao>
        </div>
        </div>

        <section id="obrigado" className="trat-obrigado" data-trat-tone="white">
          <div>
            <h2>Obrigado</h2>
            <p>Foi um prazer apresentar este tratamento de roteiro e será um prazer contar essa história com vocês.</p>
          </div>
          <figure className="trat-obrigado__foto">
            <img src="/media/backgrounds/boldstudio-about-us-09c5b22b95fb.webp" alt="Equipe da Bold Studio" loading="lazy" decoding="async" />
          </figure>
        </section>
      </main>

      <footer className="trat-rodape" data-trat-tone="white">
        <ul className="trat-rodape__links">
          {LINKS_BOLD.map(link => (
            <li key={link.nome}>
              <a href={link.url} target={link.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                <IconeMarca tipo={link.marca} />
                <small>{link.nome}</small><span>{link.texto}</span><IconeExterno />
              </a>
            </li>
          ))}
        </ul>
        <img className="trat-rodape__logo" src={LOGO_BOLD} alt="Bold Studio" width="1357" height="486" loading="lazy" />
      </footer>

      {!limpo && (aberto ? (
        <Controle layout={layout} aoLayout={mudarLayout} estado={estado} aoMudar={setEstado}
          selecionada={selecionada} aoSelecionar={setSelecionada} aoLocalizar={id => setLocalizar({ id })}
          fechar={() => { setAberto(false); setSelecionada(null) }} />
      ) : (
        <button type="button" className="trat-controle__abrir" onClick={() => setAberto(true)}><SlidersHorizontal size={15} aria-hidden="true" />Controle</button>
      ))}
    </div>
  )
}
