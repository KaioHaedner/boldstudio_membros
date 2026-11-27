# Bio — layout desktop e mobile

Endereço: https://bio.boldstudiobrasil.com/bio

## Layout aprovado como direção

Referências fornecidas: Bios da Óptica Lux e da Dra. Jaqueline Rezende.

- Desktop a partir de 900px: fundo fotográfico desfocado, card de duas colunas com foto à esquerda e conteúdo à direita.
- Conteúdo desktop: logo, apresentação curta, QR code para a Bio no celular e um único botão para o WhatsApp Web comercial da Bold.
- Mobile: foto com transição para preto, quatro links existentes (WhatsApp, site, portfólio e e-mail) e logos de clientes.
- Rodapé compacto com site, páginas legais, copyright e crédito do desenvolvedor. O wordmark gigante foi retirado da Bio.
- A foto e o QR code são arquivos estáticos locais; a Bio não exige banco de dados ou proxy de mídia.

## Validação

Build de produção e lint da página e do preparador de deploy.

Chrome isolado, viewports CSS: 1366×768, 1280×720, 1024×768, 900×600, 390×844 e 360×740.

Desktop sem rolagem vertical ou horizontal nos quatro tamanhos; apenas uma ação principal, com destino WhatsApp Web. Mobile com os quatro links e sem overflow horizontal. Nenhuma imagem visível quebrada ou erro JavaScript encontrado.

Capturas: `docs/qa/2026-10-15/bio-desktop.png` e `bio-mobile.png`.

Após publicar, a versão pública foi novamente conferida em 1366×768 e 390×844: nenhuma falha HTTP, imagem quebrada ou erro JavaScript. Desktop com uma única ação principal e sem rolagem. As capturas acima são da versão pública.

## Publicação reproduzível

1. `npm.cmd run build`
2. `node scripts/prepare-bio-deploy.mjs ../BoldStudioBioPublic`
3. Na pasta `../BoldStudioBioPublic`, já vinculada ao projeto Vercel `boldstudio-bio`: `vercel.cmd deploy --prod --yes`.

O preparador copia o build e gera um HTML próprio da Bio com canonical e metadados do domínio correto. Não copia arquivos locais de credenciais. `deployment/bio/vercel.json` redireciona a raiz `/` para `https://bio.boldstudiobrasil.com/bio` com status 308 e serve o conteúdo em `/bio`. O QR code existente aponta para a raiz e acompanha esse redirecionamento.

Verificação pública do redirecionamento: HTTP raiz → 308 para HTTPS raiz → 308 para `/bio` → 200. Chrome isolado em viewport mobile navegou a partir do endereço HTTP, terminou em `/bio` e carregou os quatro links sem erros JavaScript.

## Ajuste de espaçamento mobile

O espaço entre a logo e o bloco de apresentação foi reduzido de 180px para 28px. A altura mínima da seção foi removida no mobile para acompanhar o conteúdo, e o sombreamento da foto foi ajustado para preservar a leitura do título. Build e conferência da versão pública em 390×844 e 1366×768 concluídos, sem overflow horizontal ou imagens quebradas.

## Legenda de marcas e logo do rodapé

A legenda passou a “Marcas atendidas pela Bold ↓”, em amarelo `#ffd712`, com peso 500 e seta no mesmo amarelo com peso 400. O rodapé recebeu a logo compacta da Bold acima dos links. O layout compacto foi ajustado para também acomodar essa logo em desktop de 900×600, preservando a ausência de rolagem vertical. Conferidos cor, peso e imagem carregada nos seis tamanhos de tela.
