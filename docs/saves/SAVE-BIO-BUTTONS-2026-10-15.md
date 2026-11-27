# Bio — botões com metade diagonal estática

URL: https://bio.boldstudiobrasil.com/bio

- Os CTAs da Bio passaram a usar o estilo próprio `.bio-page__link`, sem o arco cônico e as animações do `.shiny-cta`.
- Estado normal: metade preta e metade dourada em diagonal, com borda estática acompanhando essa divisão.
- Desktop com mouse: preenchimento amarelo completo, texto escuro, brilho e crescimento de 2,5% no hover. Não existe rotação na borda.
- Mobile: o mesmo estado estático antes, durante e depois do toque, sem crescimento, preenchimento adicional ou destaque de toque do navegador.
- Navegação por teclado mantém foco visível; a preferência por movimento reduzido elimina a transição e o crescimento.

Validação: build, lint da página e Chrome em desktop 1366×768 e dispositivo touch 390×844. Conferidos os estilos computados no estado normal e no hover; os quatro botões mobile mantiveram exatamente o mesmo fundo, transformação, cor e preenchimento durante `touchStart` e após `touchEnd`. Nenhuma animação infinita nos CTAs ou erro JavaScript.

Capturas: `docs/qa/2026-10-15/bio-button-desktop-static.png`, `bio-button-desktop-hover.png` e `bio-button-mobile-static.png`.

A mesma validação foi repetida na URL pública após o deploy e passou em desktop e mobile. As capturas finais são da versão publicada.
