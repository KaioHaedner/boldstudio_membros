import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/i18n/I18nContext'

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
      setDeleting(false)
      setWordIndex((i) => (i + 1) % words.length)
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

// Abertura da seção de Cases: manifesto com o logo da Bold inline, palavra em
// destaque amarela, uma linha em máquina de escrever, seta de scroll e a
// etiqueta "Cases" com o mesmo amarelo vivo das outras seções.
export function CasesAbertura() {
  const { t } = useI18n()
  const typed = useTypewriter(t.cases.typeWords)

  return (
    <section
      id="cases-abertura"
      className="relative flex min-h-[90vh] scroll-mt-24 flex-col items-center justify-center overflow-hidden bg-bold-black px-6 text-center"
    >
      <div className="max-w-4xl">
        <h2 className="text-[clamp(2rem,5.5vw,4.75rem)] font-black italic leading-[1.15] tracking-tight text-bold-white">
          {t.cases.lineA}{' '}
          <img
            src={LOGO}
            alt="Bold"
            className="mx-1 inline-block h-[0.72em] w-auto translate-y-[0.06em] align-baseline"
          />
          <br />
          {t.cases.lineB} <span className="text-bold-yellow">{t.cases.highlight}</span>
        </h2>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-bold-white/60 sm:text-base">
          <span>{typed}</span>
          <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-bold-yellow align-middle" style={{ height: '1em' }} />
        </p>
      </div>

      <ChevronDown
        aria-hidden="true"
        size={42}
        className="mt-14 animate-bounce text-bold-yellow"
        strokeWidth={2.5}
      />

      <div className="absolute bottom-8 left-0">
        <span className="live-yellow inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.4rem,3.5vw,2.4rem)] font-black italic leading-none tracking-[-0.04em] text-bold-black sm:pr-10">
          {t.cases.label}
        </span>
      </div>
    </section>
  )
}
