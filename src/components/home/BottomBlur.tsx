// Blur progressivo fixo na margem inferior da home. Ofusca o conteudo que esta
// por vir conforme o usuario rola, criando curiosidade. O estilo (.bottom-blur)
// vive em src/index.css. pointer-events-none p/ nunca bloquear cliques.
export function BottomBlur() {
  return <div className="bottom-blur" aria-hidden="true" />
}
