# SAVE-196 | 14/07/2026 | BoldStudio: Crew full-screen e clientes em duas pistas

## O que foi feito

- Preservada a identidade implementada da BoldStudio: Inter, preto `#000000`, amarelo `#FFD712`, branco `#FFFFFF` e grafite `#282828`.
- Mantidos conteúdo, fotos coloridas, CTA e lógica de empilhamento dos cards do Crew.
- Cards do Crew ampliados de 65% × 60% para até quase toda a viewport: largura com respiro lateral e altura de 82svh no desktop e 88svh no mobile.
- Nome, cargo e descrição ganharam escala responsiva compatível com a nova composição.
- Removida a apresentação vertical ondulada dos clientes.
- Os 14 clientes foram divididos em duas pistas horizontais, superior e inferior, movidas em sentidos opostos pelo scroll com GSAP ScrollTrigger.
- As logos continuam clicáveis e preservam modal, preview e links para páginas de projetos.
- Cada pista tem uma cópia visual para continuidade do movimento; a cópia está fora da árvore de acessibilidade.
- Em `prefers-reduced-motion`, não há pin/animação e as pistas ficam disponíveis por rolagem horizontal nativa.

## Validação

- Lint focado em `src/components/home/ClientesWave.tsx`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou, incluindo repetição final após o ajuste de reduced motion.
- `git diff --check` scoped: passou.
- `npm run lint` global: 22 erros e 2 avisos preexistentes, todos fora dos arquivos alterados.
- `npm test`: indisponível porque não existe script `test` no `package.json`.
- Revisão visual final no navegador real ainda deve ser feita pelo Kaio.

## Arquivos

- `src/components/home/ClientesWave.tsx`
- `src/index.css`
- `docs/stories/2026-07-14-home-crew-clientes-editorial.md`
- `task_plan.md`
- `findings.md`
- `progress.md`

## Handoff

- Mudança local pronta para revisão.
- O `LIVE-SESSION.md` não foi alterado porque pertence ao fluxo ativo do Claude Code.
- As alterações Supabase já existentes permaneceram intocadas.
- Push/deploy não executado nesta etapa por exigência da Constitution: autoridade exclusiva de `@devops`.

## Relacionados

[[project_boldstudio]] [[SAVE-194_2026-07-14_boldstudio-shadergradient-contraste-mobile]] [[reference_dupla_claude_codex]]
