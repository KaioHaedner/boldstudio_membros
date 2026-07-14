# SAVE-192 | 14/07/2026 | BoldStudio: fotos coloridas e shader preto/grafite

## O que foi feito nesta sessão

- Crew da home institucional passou a carregar somente as URLs das fotos coloridas já existentes no bucket `Fotos_CREW_COLORIDAS`.
- Removidos o bucket P&B, as URLs duplicadas, o estado de clique, as duas camadas de imagem e o fade entre P&B e colorido.
- Cada integrante com foto agora faz uma única requisição de imagem, com `loading="lazy"` e `decoding="async"`.
- Nathalia continua com placeholder porque não há URL de foto registrada.
- O canvas de 450 estrelas foi substituído por um fragment shader WebGL restrito a `#000000` e `#212121`.
- O shader mantém profundidade e movimento sutil por ponteiro e scroll, com DPR limitado a 1.5 e pausa quando a aba fica oculta.
- O fundo CSS em preto/grafite permanece como fallback se WebGL não estiver disponível.
- Parallax existente, GSAP, ScrollTrigger, pin do Crew e animações de scroll não foram removidos.
- Como `StarfieldBackground` também é usado nas páginas de projetos institucionais, o novo fundo foi aplicado nelas sem duplicar implementação.

## Validação

- `npx eslint src/components/home/CrewSticky.tsx src/components/home/StarfieldBackground.tsx`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run lint`: mantém 22 erros e 2 avisos preexistentes, todos fora dos arquivos alterados, conforme já registrado no SAVE-186.
- Não existe script `npm test` no `package.json`.
- A captura automatizada pelo Chrome headless não conseguiu acessar o preview local. A validação visual final ficou para o deploy.

## Arquivos alterados

- `src/components/home/CrewSticky.tsx`
- `src/components/home/StarfieldBackground.tsx`
- `src/index.css`

## Decisões e gotchas

- O componente manteve o nome `StarfieldBackground` para não quebrar os consumidores atuais, mas não renderiza mais estrelas.
- As alterações locais preexistentes em `supabase/` não pertencem a esta tarefa e não devem entrar no commit.
- O `LIVE-SESSION.md` estava ocupado pelo Claude Code no projeto DoceCasa e não foi sobrescrito.

## Pendências e próximo passo concreto

- Conferir no deploy desktop e mobile o contraste do shader, o movimento de parallax e o pin do Crew.
- Conferir se todas as oito fotos coloridas carregam e se Nathalia continua com o placeholder esperado.
- Continua pendente receber a foto da Nathalia.

## Relacionados

[[project_boldstudio]] [[reference_boldstudio_infra]] [[reference_boldstudio_features_roadmap]]
