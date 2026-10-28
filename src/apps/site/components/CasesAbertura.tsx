import { useEffect, useState } from 'react'
import { Mouse, Pointer } from 'lucide-react'
import { useI18n } from '@/apps/site/i18n/I18nContext'

const LOGO = '/brand/logo-boldstudio.webp'

// Efeito máquina de escrever: digita e apaga as palavras em rotação.
function useTypewriter(words: string[], typeMs = 85, deleteMs = 45, pauseMs = 1500) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIndex % words.length]
    let timeout: number

    if (!deleting && text === word) {
      timeout = window.setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && text === '') {
      timeout = window.setTimeout(() => {
        setDeleting(false)
        setWordIndex((i) => (i + 1) % words.length)
      }, deleteMs)
    } else {
      timeout = window.setTimeout(
        () =>
          setText((prev) =>
            deleting ? word.slice(0, prev.length - 1) : word.slice(0, prev.length + 1)
          ),
        deleting ? deleteMs : typeMs
      )
    }

    return () => window.clearTimeout(timeout)
  }, [text, deleting, wordIndex, words, typeMs, deleteMs, pauseMs])

  return text
}

// Abertura da seção de Cases com a marca Bold inline e palavras em rotação.
export function CasesAbertura() {
  const { t, lang } = useI18n()
  const typed = useTypewriter(t.cases.typeWords)
  const scrollLabel = lang === 'pt' ? 'Ver prévias dos projetos. Role para baixo ou deslize para cima.' : lang === 'en' ? 'View project previews. Scroll down or swipe up.' : 'Ver vistas previas. Desplázate hacia abajo o desliza hacia arriba.'

  // No mobile a abertura termina logo depois do indicador para o primeiro case
  // já aparecer como continuação do gesto, sem um bloco grande de preto.
  return (
    <section
      id="cases-abertura"
      className="cases-abertura relative flex scroll-mt-24 flex-col items-center justify-center overflow-hidden bg-bold-black px-6 py-[var(--espaco-secao)] text-center"
    >
      <div className="relative z-10 max-w-4xl">
        <h2 className="text-[clamp(2.4rem,6.6vw,5.7rem)] font-black italic leading-[1.15] tracking-tight text-bold-white">
          {t.cases.lineA}{' '}
          <img
            src={LOGO}
            alt="Bold"
            className="mx-1 inline-block h-[0.72em] w-auto translate-y-[0.06em] align-baseline"
          />
        </h2>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-bold-white/60 sm:text-base">
          <span className="cases-abertura__typeword">{typed}</span>
          <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-bold-yellow align-middle" style={{ height: '1em' }} />
        </p>
      </div>

      <button type="button" className="scroll-cue relative z-10 mt-8 text-bold-yellow sm:mt-14" aria-label={scrollLabel}
        onClick={() => document.getElementById('cases')?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>
        <span className="scroll-cue__icons" aria-hidden="true">
          <Mouse className="scroll-cue__mouse" size={36} strokeWidth={1.7} />
          <Pointer className="scroll-cue__touch" size={36} strokeWidth={1.7} />
        </span>
        <span className="scroll-cue__label">{lang === 'pt' ? 'Role ou deslize' : lang === 'en' ? 'Scroll or swipe' : 'Desplázate o desliza'}</span>
      </button>

    </section>
  )
}
