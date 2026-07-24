import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ignoreMobileResize: no mobile a barra de endereco aparece/some ao scrollar,
// mudando o innerHeight e disparando refresh nos pins — isso fazia as secoes
// com pin (Crew, Cases, Processo) "pularem"/travarem ao rolar pra cima.
ScrollTrigger.config({ ignoreMobileResize: true })

// --- Correcao do crash "removeChild NotFoundError" do ScrollTrigger ---
// O _refresh100vh (GSAP 3.15) faz body.appendChild/removeChild de um <div> de
// medicao de 100vh. Quando varios pins (Crew/Cases/Processo) pedem refresh quase
// ao mesmo tempo no carregamento, esse <div> ja foi removido e o removeChild
// lanca NotFoundError DENTRO do ticker do GSAP — o que congela TODAS as
// animacoes: os pins "saem do local"/travam e o QuickNav (que depende de scroll)
// nao aparece. A arvore React fica intacta, mas o site parece quebrado.
// Solucao: tornar removeChild idempotente — se o no nao e filho, no-op em vez de
// lancar. O React (e libs em geral) so removem filhos validos, entao nada muda
// para eles; apenas o caso ilegal do GSAP deixa de derrubar o ticker.
type PatchedNode = typeof Node.prototype & { __stRemoveChildPatched?: boolean }
if (typeof Node !== 'undefined' && !(Node.prototype as PatchedNode).__stRemoveChildPatched) {
  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function removeChild<T extends Node>(child: T): T {
    if (child && child.parentNode !== this) return child
    return originalRemoveChild.call(this, child) as T
  }
  ;(Node.prototype as PatchedNode).__stRemoveChildPatched = true
}

// Defesa em profundidade: antes de cada ciclo de refresh, mata triggers cujos
// elementos ja sairam do DOM (componente desmontado sem revert, HMR, etc).
// Um trigger orfao fazia _swapPinIn crashar (insertBefore em parent null) no
// meio do _refreshAll, corrompendo o layout de TODOS os pins e travando o site.
ScrollTrigger.addEventListener('refreshInit', () => {
  ScrollTrigger.getAll().forEach((st) => {
    const trigger = st.trigger as Element | undefined
    const pin = (st as unknown as { pin?: Element }).pin
    if ((trigger && !trigger.isConnected) || (pin && !pin.isConnected)) st.kill()
  })
})

// Dev only: expoe pra depurar triggers no console (window.ScrollTrigger.getAll()).
if (import.meta.env.DEV) {
  ;(window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger
}

export { gsap, ScrollTrigger }
