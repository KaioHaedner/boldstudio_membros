# Logos brancas e prévias dos Cases — 2026-10-05

Alterações somente no checkout BoldStudioHub / prévia local. Sem deploy, push, DNS ou escrita em serviços externos.

## Assets

- ZIP `export_2026-10-05T22_57_06-927Z.zip`: contém 15 WebPs, não 16.
- Conferidos visualmente numa folha de contato e com Pillow: todos têm alpha real (0–254), incluindo Unimed legível.
- Copiados sem alterar os bytes, com hash SHA-256 no nome. Originais preservados.
- Manifesto único `src/apps/site/data/client-logos.json` serve Clientes, logo superior esquerda e seletor de Cases, modal e página do projeto.
- DuoTorri e Sonhalto continuam usando as duas logos brancas fornecidas anteriormente. Total: 17 marcas.
- Fundo do seletor do player agora escuro para manter contraste com as logos brancas.

## Vídeos: resultado real

HEAD público verificado novamente: nove arquivos de `Videos_Cliente_New` no projeto `heriogfvynncvabbwspu` retornaram **HTTP 402**, não arquivos MP4. Não houve download novo bem-sucedido.

Confirmado também com GET de apenas um byte de Unimed: corpo JSON informou `exceed_cached_egress_quota`. Não se trata de ausência de vínculo no player; o servidor está negando os arquivos por cota. Não foram alterados plano, spend caps ou permissões.

Novos vídeos bloqueados: agrobaggio-cine, showsafra-aftermovie, machado-copa, unimed-institucional, paiol-cine, exponorte-aftermovie, forteza-video-principal, duotorri-lancamento-cine, sonhalto-paranoa.

Foram ligados explicitamente seis **clipes antigos recuperados da mesma marca**, não cópias do filme novo: Agro Baggio, Machado, Unimed, Paiol, Exponorte e Forteza. O player informa que são prévias recuperadas de 10 segundos. Madô e Grupo Sinop já tinham suas prévias locais e permanecem funcionando.

Não substituir DuoTorri, Sonhalto ou ShowSafra por vídeo de outra marca. Após falha, Cases mostra mensagem de indisponibilidade, não apenas um palco parado sem explicação.

Pendência: liberar o acesso aos nove arquivos novos ou receber cópias locais. Depois recuperar/otimizar e remover o fallback de prévia antiga quando os arquivos exatos forem obtidos.

## Validação

- Build TypeScript/Vite passou (aviso preexistente de chunk grande).
- ESLint dos arquivos deste lote passou.
- 23 testes passaram, incluindo 3 novos de integridade dos assets/mapeamento por marca.
- UI: selecionadas oito marcas; cada seleção trocou o src do vídeo e a logo para sua própria marca. Machado apresentou readyState 4 e Unimed carregou a prévia correspondente.
- Captura `docs/qa/2026-10-05/cases-white-logos.jpg` registra player com vídeo Machado e logo branca superior esquerda.
- As 15 logos novas aparecem em ambas as cópias do marquee (30 imagens), mais as duas marcas anteriores duplicadas.
- Não validado em Android físico nesta rodada.
