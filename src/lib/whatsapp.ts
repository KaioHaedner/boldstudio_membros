// WhatsApp comercial da Bold Studio (diretor comercial).
// TODO botao de WhatsApp do site aponta pra ca. O unico numero diferente no
// projeto e o do Kaio, no bloco "Powered by" do rodape, que e contato do
// desenvolvedor e nao da Bold.
export const BOLD_WHATSAPP = '5519993605214'
export const BOLD_WHATSAPP_DISPLAY = '(19) 99360-5214'

// Cada origem tem a sua frase pra equipe saber de qual secao/pagina o lead saiu
// so de ler a primeira mensagem.
const ORIGENS = {
  footerHome: 'pelo rodapé do site',
  footerPlataforma: 'pelo rodapé da plataforma',
  suporte: 'pela página de Suporte do site',
  comingSoon: 'pela página inicial (Em breve) do site',
  contato: 'pela seção de Contato do site',
  formularioContato: 'pelo formulário de contato do site',
  recia: 'pelo chat da RecIA no site',
} as const

export type WhatsappOrigem = keyof typeof ORIGENS

/** Link wa.me pro comercial da Bold, ja com a mensagem da origem preenchida. */
export function whatsappLink(origem: WhatsappOrigem): string {
  const msg = `Olá, Bold Studio! Vim ${ORIGENS[origem]} e quero falar sobre um projeto.`
  return `https://wa.me/${BOLD_WHATSAPP}?text=${encodeURIComponent(msg)}`
}
