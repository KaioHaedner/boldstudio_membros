import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ignoreMobileResize: no mobile a barra de endereco aparece/some ao scrollar,
// mudando o innerHeight e disparando refresh nos pins — isso fazia as secoes
// com pin (Crew, Cases, Processo) "pularem"/travarem ao rolar pra cima.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }
