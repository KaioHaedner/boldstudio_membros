import { Component, type ReactNode } from 'react'

export class PageErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (!this.state.failed) return this.props.children
    return <main role="alert" className="min-h-screen flex flex-col items-center justify-center gap-5 bg-black px-6 text-center text-white">
      <h1 className="text-2xl font-bold">Não conseguimos abrir esta página.</h1>
      <p>Recarregue a página. Se continuar, fale com a Bold.</p>
      <button type="button" className="rounded-xl bg-bold-yellow px-6 py-3 font-bold text-black" onClick={() => window.location.reload()}>Tentar novamente</button>
    </main>
  }
}
