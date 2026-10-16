# Bio — crédito em popup e links do rodapé

- O crédito da Bio passou de um link direto para `kaiohaedner.com` a um botão que abre o componente reutilizável `KaioCredit`.
- Referência de desenho: `OpticaLux - Camila/opticalux-site/web/src/app/site-footer.tsx`, box de crédito, e classes `.credit-card` em `globals.css`.
- Mesmo conteúdo e organização: título serifado, apoio, WhatsApp e Instagram, e nota de portfólio. A versão Bold usa o gradiente amarelo e os botões pretos já adotados no projeto.
- Não há link para o domínio raiz do desenvolvedor ou sua página de login no crédito da Bio.
- O link “Uso da IA” foi removido das páginas essenciais da Bio. Permanecem site oficial, termos de uso, privacidade e cookies.
- O diálogo abre por clique, fecha por Escape, pelo X e pelo fundo. O foco circula dentro dele, retorna ao crédito ao fechar, e preserva a posição da página.

Validação: build de produção, lint dos componentes alterados e Chrome em 1366×768 e 390×844. Conferidos os destinos dos dois contatos, remoção do link de IA, fechamento e foco, sem erros JavaScript ou HTTP.

Capturas: `docs/qa/2026-10-15/bio-credit-desktop.png` e `bio-credit-mobile.png`.

Publicação confirmada em `https://bio.boldstudiobrasil.com/`; a mesma verificação de interação passou em desktop e mobile no domínio público. Capturas finais obtidas dessa versão.
