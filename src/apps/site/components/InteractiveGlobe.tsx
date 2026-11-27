import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '@/apps/site/i18n/I18nContext'

const GlobeScene = lazy(() => import('./WorldGlobeScene'))
class GlobeBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

/** Import the engine and geographic data only when this section is reached. */
export function InteractiveGlobe() {
  const { lang } = useI18n()
  const host = useRef<HTMLDivElement>(null)
  const [reached, setReached] = useState(false)
  const [visible, setVisible] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (entry.isIntersecting) setReached(true)
    }, { threshold: .05 })
    observer.observe(host.current!)
    const visibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  const message = lang === 'pt' ? 'Globo interativo indisponível neste navegador.' : lang === 'en' ? 'Interactive globe unavailable in this browser.' : 'Globo interactivo no disponible en este navegador.'
  return <div ref={host} className="studio-globe" data-reached={reached}>
    {reached && <GlobeBoundary fallback={<p className="studio-globe__status">{message}</p>}>
      <Suspense fallback={<span className="studio-globe__loading" aria-hidden="true" />}>
        <GlobeScene active={visible && tabVisible} lang={lang} />
      </Suspense>
    </GlobeBoundary>}
  </div>
}
