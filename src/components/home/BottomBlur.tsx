import { useEffect, useState } from 'react'

// Blur progressivo fixo na margem inferior da home. Ofusca o conteudo que esta
// por vir conforme o usuario rola, criando curiosidade. O estilo (.bottom-blur)
// vive em src/index.css. pointer-events-none p/ nunca bloquear cliques.
//
// Some quando o footer entra na tela, pra nao apagar/escurecer o rodape — o
// efeito vale ate o limite do conteudo (form), nao no footer.
export function BottomBlur() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(footer)
    return () => io.disconnect()
  }, [])

  return <div className={`bottom-blur${hidden ? ' bottom-blur--hidden' : ''}`} aria-hidden="true" />
}
