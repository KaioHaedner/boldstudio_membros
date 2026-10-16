# Bio — assinatura branca gigante no rodapé

URL: https://bio.boldstudiobrasil.com/bio

A solicitação substitui a logo pequena experimental pelo mesmo encerramento da home, confirmado pela captura fornecida pelo usuário.

- A logo pequena foi removida da Bio.
- `FooterWordmark` foi reutilizado após os créditos, com o mesmo arquivo `boldstudio-footer-white-538e252ccec7.webp`, a mesma escala e o mesmo corte da home.
- A assinatura ocupa a largura inteira do viewport no desktop e no celular, sem margem lateral ou espaço após o recorte no final da página.
- A assinatura acrescenta uma área após os créditos; a altura total da página pode ultrapassar a tela no desktop.

Build e lint da página concluídos. Chrome em 1366×768, 1280×720, 1024×768, 900×600, 390×844 e 360×740: imagem carregada, largura igual ao viewport, corte inferior presente, fim da assinatura coincidente com o fim da página, ausência da logo pequena e nenhum overflow horizontal ou erro JavaScript.

Capturas atualizadas: `docs/qa/2026-10-15/bio-desktop.png` e `bio-mobile.png`.

Após o deploy, a conferência no domínio público em 1366×768 e 390×844 também passou. Capturas finais obtidas dessa versão publicada.
