import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import {
  AGRADECIMENTO_MIDIA,
  ARTE,
  BLOCOS,
  CAMERA,
  CAPA,
  FUNDOS_TRATORES,
  LINKS_BOLD,
  MIDIAS,
  REFERENCIAS,
  SOM,
  type BlocoTexto,
} from '@/apps/site/data/tratamentos'

// Só existe o tratamento da John Deere por enquanto; a rota já aceita o nome do
// cliente para o próximo.
const CLIENTES_OK = ['john-deere']

type Layout = 'tratores' | 'bold'
type Estado = { ordem: Record<string, string[]>; ocultas: string[] }

const estadoInicial = (): Estado => ({
  ordem: Object.fromEntries(BLOCOS.map((b) => [b.id, [...b.midias]])),
  ocultas: [],
})

// ---------- parallax ----------
// Um único ouvinte de scroll para a página inteira: só mexe nos elementos que
// estão na tela e só escreve uma variável CSS (transform, que não pesa).
function useParalaxe(raiz: RefObject<HTMLElement | null>, chave: string) {
  useEffect(() => {
    const raizEl = raiz.current
    if (!raizEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const visiveis = new Set<HTMLElement>()
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          const el = e.target as HTMLElement
          if (e.isIntersecting) visiveis.add(el)
          else visiveis.delete(el)
        }),
      { rootMargin: '20% 0px' },
    )
    raizEl.querySelectorAll<HTMLElement>('[data-par]').forEach((el) => io.observe(el))
    let quadro = 0
    const desenha = () => {
      quadro = 0
      const vh = window.innerHeight
      visiveis.forEach((el) => {
        const r = el.getBoundingClientRect()
        const p = (r.top + r.height / 2 - vh / 2) / vh
        const v = Number(el.dataset.vel || '1')
        el.style.setProperty('--py', `${(-p * v * 50).toFixed(1)}px`)
      })
    }
    const pede = () => {
      if (!quadro) quadro = requestAnimationFrame(desenha)
    }
    window.addEventListener('scroll', pede, { passive: true })
    window.addEventListener('resize', pede)
    pede()
    return () => {
      window.removeEventListener('scroll', pede)
      window.removeEventListener('resize', pede)
      cancelAnimationFrame(quadro)
      io.disconnect()
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
  const m = MIDIAS[id]
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) void v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  if (!m) return null
  const vel = 0.7 + ((indice * 37) % 7) / 10
  return (
    <figure
      className={`trat-midia${selecionada ? ' is-selecionada' : ''}${selecionavel ? ' is-selecionavel' : ''}`}
      style={{ aspectRatio: proporcao }}
      data-par
      data-vel={vel}
      onClick={selecionavel ? () => aoSelecionar(id) : undefined}
    >
      <div className="trat-midia__inner">
        {m.tipo === 'video' ? (
          <video ref={videoRef} src={m.src} poster={m.poster} muted loop playsInline preload="none" draggable={false} />
        ) : (
          <img src={m.src} alt="" loading="lazy" decoding="async" draggable={false} />
        )}
      </div>
      {selecionavel && <span className="trat-midia__selo">{id.replace('m', '')}</span>}
    </figure>
  )
}

// linhas do mosaico: cada linha define quantas mídias cabem e a proporção delas
const LINHAS: { spans: number[]; proporcao: string }[] = [
  { spans: [12], proporcao: '21 / 9' },
  { spans: [6, 6], proporcao: '16 / 10' },
  { spans: [4, 4, 4], proporcao: '5 / 4' },
  { spans: [7, 5], proporcao: '4 / 3' },
  { spans: [5, 7], proporcao: '4 / 3' },
]

function Mosaico({
  ids,
  selecionavel,
  selecionada,
  aoSelecionar,
}: {
  ids: string[]
  selecionavel: boolean
  selecionada: string | null
  aoSelecionar: (id: string) => void
}) {
  const itens: { id: string; span: number; proporcao: string; indice: number }[] = []
  let pos = 0
  let l = 0
  while (pos < ids.length) {
    const modelo = LINHAS[l % LINHAS.length]
    const restante = ids.length - pos
    const spans = modelo.spans.length <= restante ? modelo.spans : Array(restante).fill(12 / restante)
    spans.forEach((span) => {
      itens.push({ id: ids[pos], span, proporcao: modelo.proporcao, indice: pos })
      pos += 1
    })
    l += 1
  }
  return (
    <div className="trat-mosaico">
      {itens.map((it) => (
        <div key={it.id} style={{ gridColumn: `span ${it.span}` }}>
          <Midia
            id={it.id}
            proporcao={it.span === 12 && ids.length > 1 && it.indice > 0 ? '21 / 9' : it.proporcao}
            indice={it.indice}
            selecionavel={selecionavel}
            selecionada={selecionada === it.id}
            aoSelecionar={aoSelecionar}
          />
        </div>
      ))}
    </div>
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
    apiYT = new Promise((ok) => {
      const anterior = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        anterior?.()
        if (window.YT) ok(window.YT)
      }
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    })
  }
  return apiYT
}

function VideoYouTube({ id }: { id: string }) {
  const [ativo, setAtivo] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [capa, setCapa] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)
  const alvoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let vivo = true
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { title?: string } | null) => {
        if (vivo && j?.title) setTitulo(j.title)
      })
      .catch(() => {})
    return () => {
      vivo = false
    }
  }, [id])

  useEffect(() => {
    if (!ativo || !alvoRef.current) return
    let player: YTPlayer | null = null
    let vivo = true
    void carregarApiYT().then((YT) => {
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
    return () => {
      vivo = false
      player?.destroy()
    }
  }, [ativo, id])

  return (
    <div className="trat-yt">
      <div className="trat-yt__quadro">
        {ativo ? (
          <div ref={alvoRef} className="trat-yt__player" />
        ) : (
          <button type="button" className="trat-yt__capa" onClick={() => setAtivo(true)} aria-label="Reproduzir vídeo">
            <img src={capa} alt="" onError={() => setCapa(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)} />
            <span className="trat-yt__play" aria-hidden="true" />
          </button>
        )}
      </div>
      {titulo && <p className="trat-yt__titulo">{titulo}</p>}
      <a className="trat-yt__link" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
        youtube.com/watch?v={id}
      </a>
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

// ---------- textos ----------
function Titulo({ texto }: { texto: string }) {
  return (
    <h2 className="trat-titulo">
      {texto.split(' ').map((p, i, arr) => (
        <Fragment key={i}>
          <span className="trat-palavra">
            <span style={{ '--i': i } as CSSProperties}>{p}</span>
          </span>
          {i < arr.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h2>
  )
}

function Secao({
  id,
  indice,
  layout,
  clara,
  children,
}: {
  id: string
  indice: number
  layout: Layout
  clara?: boolean
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisivel(true), { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const tom = clara ? 'b' : 'a'
  return (
    <section
      id={id}
      ref={ref}
      className={`trat-secao trat-secao--${tom}${visivel ? ' is-visivel' : ''}`}
    >
      {layout === 'tratores' && !clara && (
        <img className="trat-secao__fundo" src={FUNDOS_TRATORES[indice % FUNDOS_TRATORES.length]} alt="" loading="lazy" decoding="async" />
      )}
      <div className="trat-secao__miolo">{children}</div>
    </section>
  )
}

function BlocoView({
  bloco,
  indice,
  layout,
  ids,
  controle,
  selecionada,
  aoSelecionar,
}: {
  bloco: BlocoTexto
  indice: number
  layout: Layout
  ids: string[]
  controle: boolean
  selecionada: string | null
  aoSelecionar: (id: string) => void
}) {
  const temMidia = ids.length > 0 || controle
  const temLado = temMidia || !!bloco.video
  return (
    <Secao id={bloco.id} indice={indice} layout={layout} clara={indice % 2 === 1}>
      <div className={temLado ? 'trat-duas' : 'trat-uma'}>
        <div className="trat-texto">
          <p className="trat-eyebrow">{bloco.eyebrow}</p>
          <span className="trat-traco" />
          <Titulo texto={bloco.titulo} />
          <div className="trat-corpo">
            {bloco.paragrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {bloco.exemplo && (
              <div className="trat-falas">
                {bloco.exemplo.map((f, i) => (
                  <p key={i}>
                    <strong>{f.fala}</strong>
                    {f.texto}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        {temLado && (
          <div className="trat-lado">
            {bloco.video && <VideoYouTube id={bloco.video} />}
            {temMidia && (
              <Mosaico ids={ids} selecionavel={controle} selecionada={selecionada} aoSelecionar={aoSelecionar} />
            )}
            {controle && ids.length === 0 && !bloco.video && (
              <p className="trat-vazio">Sem mídia neste bloco. Selecione uma e mande para cá pelo controle.</p>
            )}
          </div>
        )}
      </div>
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
  fechar,
}: {
  layout: Layout
  aoLayout: (l: Layout) => void
  estado: Estado
  aoMudar: (e: Estado) => void
  selecionada: string | null
  aoSelecionar: (id: string | null) => void
  fechar: () => void
}) {
  const [copiado, setCopiado] = useState(false)
  const blocoDe = (id: string) => BLOCOS.find((b) => estado.ordem[b.id].includes(id))?.id
  const atual = selecionada ? blocoDe(selecionada) : undefined
  const oculta = selecionada ? estado.ocultas.includes(selecionada) : false

  const mover = (delta: number) => {
    if (!selecionada || !atual) return
    const lista = [...estado.ordem[atual]]
    const i = lista.indexOf(selecionada)
    const j = i + delta
    if (j < 0 || j >= lista.length) return
    ;[lista[i], lista[j]] = [lista[j], lista[i]]
    aoMudar({ ...estado, ordem: { ...estado.ordem, [atual]: lista } })
  }
  const paraBloco = (destino: string) => {
    if (!selecionada || !atual || destino === atual) return
    aoMudar({
      ...estado,
      ordem: {
        ...estado.ordem,
        [atual]: estado.ordem[atual].filter((x) => x !== selecionada),
        [destino]: [...estado.ordem[destino], selecionada],
      },
    })
  }
  const alternarOculta = (id: string) =>
    aoMudar({ ...estado, ocultas: estado.ocultas.includes(id) ? estado.ocultas.filter((x) => x !== id) : [...estado.ocultas, id] })

  const copiar = () => {
    const texto = JSON.stringify(
      { layout, blocos: Object.fromEntries(BLOCOS.map((b) => [b.id, estado.ordem[b.id].filter((x) => !estado.ocultas.includes(x))])) },
      null,
      2,
    )
    void navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 1800)
    })
  }

  return (
    <aside className="trat-controle" aria-label="Controle de mídias">
      <header>
        <strong>Controle</strong>
        <button type="button" onClick={fechar} aria-label="Fechar controle">×</button>
      </header>
      <div className="trat-controle__grupo">
        <span>Layout</span>
        <div className="trat-controle__duo">
          <button type="button" className={layout === 'tratores' ? 'is-on' : ''} onClick={() => aoLayout('tratores')}>Com tratores</button>
          <button type="button" className={layout === 'bold' ? 'is-on' : ''} onClick={() => aoLayout('bold')}>Bold puro</button>
        </div>
      </div>
      <div className="trat-controle__grupo">
        <span>Mídia selecionada</span>
        {selecionada && MIDIAS[selecionada] ? (
          <>
            <div className="trat-controle__sel">
              <img src={MIDIAS[selecionada].poster} alt="" />
              <b>{selecionada.replace('m', '#')}</b>
              <small>{BLOCOS.find((b) => b.id === atual)?.menu}</small>
            </div>
            <div className="trat-controle__duo">
              <button type="button" onClick={() => mover(-1)}>← Antes</button>
              <button type="button" onClick={() => mover(1)}>Depois →</button>
            </div>
            <label>
              Mandar para
              <select value={atual} onChange={(e) => paraBloco(e.target.value)}>
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
          <p>Clique em qualquer imagem ou GIF da página para escolher.</p>
        )}
      </div>
      {estado.ocultas.length > 0 && (
        <div className="trat-controle__grupo">
          <span>Escondidas ({estado.ocultas.length})</span>
          <div className="trat-controle__tira">
            {estado.ocultas.map((id) => (
              <button key={id} type="button" onClick={() => alternarOculta(id)} title="Mostrar de novo">
                <img src={MIDIAS[id].poster} alt="" />
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="trat-controle__duo">
        <button type="button" onClick={copiar}>{copiado ? 'Copiado' : 'Copiar ordem'}</button>
        <button type="button" onClick={() => { aoMudar(estadoInicial()); aoSelecionar(null) }}>Restaurar</button>
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
  const chaveSalva = `tratamento-${cliente}`

  const [estado, setEstado] = useState<Estado>(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(chaveSalva) || 'null') as Estado | null
      if (salvo?.ordem) {
        // ids novos que não existiam quando a ordem foi salva voltam ao lugar original
        const base = estadoInicial()
        const usados = new Set(Object.values(salvo.ordem).flat())
        for (const b of BLOCOS) {
          salvo.ordem[b.id] = salvo.ordem[b.id] || []
          base.ordem[b.id].forEach((id) => !usados.has(id) && salvo.ordem[b.id].push(id))
        }
        return { ordem: salvo.ordem, ocultas: salvo.ocultas || [] }
      }
    } catch {
      /* sem armazenamento: segue com a ordem do documento */
    }
    return estadoInicial()
  })
  const [aberto, setAberto] = useState(false)
  const [selecionada, setSelecionada] = useState<string | null>(null)
  const raiz = useRef<HTMLDivElement>(null)
  const finalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(chaveSalva, JSON.stringify(estado))
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

  // o gradiente do rodapé nasce na metade do cartão de agradecimento
  useEffect(() => {
    const fim = finalRef.current
    const cartao = fim?.querySelector<HTMLElement>('.trat-obrigado')
    if (!fim || !cartao) return
    const ro = new ResizeObserver(() => fim.style.setProperty('--meio', `${cartao.offsetHeight / 2}px`))
    ro.observe(cartao)
    return () => ro.disconnect()
  }, [])

  const visiveis = useMemo(
    () => Object.fromEntries(BLOCOS.map((b) => [b.id, estado.ordem[b.id].filter((id) => !estado.ocultas.includes(id))])),
    [estado],
  )
  const chaveParalaxe = JSON.stringify(visiveis) + layout + aberto
  useParalaxe(raiz, chaveParalaxe)

  if (!CLIENTES_OK.includes(cliente)) return <Navigate to="/" replace />

  const mudarLayout = (l: Layout) => {
    const p = new URLSearchParams(busca)
    if (l === 'bold') p.set('layout', 'bold')
    else p.delete('layout')
    setBusca(p, { replace: true })
  }
  const controle = aberto && !limpo
  const ultimo = BLOCOS.length

  return (
    <div className="trat" data-layout={layout} ref={raiz}>
      {/* capa: fundo todo branco; a logo da Bold em SVG com contorno preto e sombra */}
      <section id="capa" className="trat-capa">
        <div className="trat-capa__texto">
          <p className="trat-eyebrow trat-eyebrow--escuro">{CAPA.titulo}</p>
          <h1>{CAPA.cliente}</h1>
          <p>{CAPA.texto}</p>
        </div>
        <div className="trat-capa__logo">
          <img src="/brand/bold-logo-contorno.svg" alt="Bold Studio" />
        </div>
        <div className="trat-capa__midia">
          <Midia id={CAPA.midia} proporcao="21 / 9" indice={0} selecionavel={false} selecionada={false} aoSelecionar={() => {}} />
        </div>
      </section>

      {BLOCOS.map((b, i) => (
        <BlocoView
          key={b.id}
          bloco={b}
          indice={i}
          layout={layout}
          ids={visiveis[b.id]}
          controle={controle}
          selecionada={selecionada}
          aoSelecionar={(id) => setSelecionada((s) => (s === id ? null : id))}
        />
      ))}

      <Secao id="camera" indice={ultimo} layout={layout} clara={ultimo % 2 === 1}>
        <div className="trat-duas">
          <div className="trat-texto">
        <p className="trat-eyebrow">{CAMERA.eyebrow}</p>
        <span className="trat-traco" />
        <Titulo texto={CAMERA.titulo} />
                  </div>
          <div className="trat-lado">
<ul className="trat-lista">
          {CAMERA.itens.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
          </div>
        </div>
      </Secao>

      <Secao id="som" indice={ultimo + 1} layout={layout} clara={(ultimo + 1) % 2 === 1}>
        <div className="trat-duas">
          <div className="trat-texto">
        <p className="trat-eyebrow">{SOM.eyebrow}</p>
        <span className="trat-traco" />
        <Titulo texto={SOM.titulo} />
                  </div>
          <div className="trat-lado">
<div className="trat-cartoes">
          {SOM.itens.map((c) => (
            <article key={c.nome}>
              <h3>{c.nome}</h3>
              <p>{c.texto}</p>
            </article>
          ))}
          {ARTE.map((c) => (
            <article key={c.nome} className="trat-cartoes__aberto">
              <h3>{c.nome}</h3>
              <p>{c.texto}</p>
            </article>
          ))}
        </div>
          </div>
        </div>
      </Secao>

      <Secao id="referencias" indice={ultimo + 2} layout={layout} clara={(ultimo + 2) % 2 === 1}>
        <div className="trat-duas">
          <div className="trat-texto">
        <p className="trat-eyebrow">Referências</p>
        <span className="trat-traco" />
        <Titulo texto="Onde a gente se inspira" />
                  </div>
          <div className="trat-lado">
<ul className="trat-links">
          {REFERENCIAS.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                <span>{r.nome}</span>
                <IconeExterno />
              </a>
            </li>
          ))}
        </ul>
          </div>
        </div>
      </Secao>

      <div className="trat-final" ref={finalRef}>
      {/* agradecimento: texto de um lado, o vídeo grande do outro */}
      <section id="obrigado" className="trat-obrigado">
        <div className="trat-obrigado__texto">
          <p className="trat-eyebrow">Obrigado</p>
          <h2>
            Muito obrigado
            <br />
            pela oportunidade.
          </h2>
          <p>Caso queiram conhecer mais sobre a Bold, é só chamar. Vai ser um prazer contar essa história com vocês.</p>
          <a href="https://boldstudiobrasil.com" target="_blank" rel="noopener noreferrer">boldstudiobrasil.com</a>
        </div>
        <div className="trat-obrigado__video">
          <Midia id={AGRADECIMENTO_MIDIA} proporcao="21 / 9" indice={2} selecionavel={false} selecionada={false} aoSelecionar={() => {}} />
        </div>
      </section>

      <footer className="trat-rodape">
        <ul className="trat-rodape__links">
          {LINKS_BOLD.map((l) => (
            <li key={l.nome}>
              <a href={l.url} target={l.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                <IconeMarca tipo={l.marca} />
                <small>{l.nome}</small>
                <span>{l.texto}</span>
                <IconeExterno />
              </a>
            </li>
          ))}
        </ul>
        <img className="trat-rodape__logo" src="/brand/bold-logo-contorno.svg" alt="Bold Studio" data-par data-vel="0.9" />
      </footer>
      </div>

      {!limpo && (
        <>
          {!aberto && (
            <button type="button" className="trat-controle__abrir" onClick={() => setAberto(true)}>
              Controle
            </button>
          )}
          {aberto && (
            <Controle
              layout={layout}
              aoLayout={mudarLayout}
              estado={estado}
              aoMudar={setEstado}
              selecionada={selecionada}
              aoSelecionar={setSelecionada}
              fechar={() => {
                setAberto(false)
                setSelecionada(null)
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
