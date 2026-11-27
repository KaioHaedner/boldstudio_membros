# Country globe implementation

- Replaces only the simplified `InteractiveGlobe` in the institutional statement section.
- Globe.gl 2.46.2; actual geographic boundaries from world-atlas 2.0.2 / Natural Earth 4.1.0, 1:110m (177 mapped features). This is generalized cartography, not an exhaustive political atlas of small territories.
- Sources: https://github.com/vasturiano/globe.gl and https://github.com/topojson/world-atlas
- Country identifiers are translated through ISO codes and browser `Intl.DisplayNames`.
- Hover (desktop), tap (mobile), and a focusable country selector identify and highlight countries.
- No satellite textures, tiles, Supabase media proxies or third-party runtime map requests.
- Engine and geography are dynamically imported only when the section intersects the viewport. The current engine chunk is approximately 569 KB gzip, cached as a hashed static asset; it is not free of bandwidth cost.
- Render loop pauses offscreen and on document visibility changes. Slow automatic rotation uses OrbitControls speed 0.25; it stops for reduced-motion preferences, including live preference changes. Pixel ratio capped at 1.5, zoom/pan disabled, vertical touch scroll retained.
- A localized yellow box shadow at 10% opacity surrounds only the globe, not the section background.
- ResizeObserver, IntersectionObserver, visibility listener, Three.js resources and renderer are cleaned up on unmount. React StrictMode exercised.
- No-WebGL browsers display an accessible unavailable message rather than crashing the page.
- No changes to Academy, About, Contact, Crew images, buttons, other pages or deployment settings in this task.

## Verification

- Production build and targeted ESLint passed.
- `.verification/globe-real-qa.cjs`: Chrome at 1440 and 390 CSS pixels, real WebGL via SwiftShader: deferred load, 177 country features, Brazil hover/tap, localized labels, keyboard selector, pause/resume, no external map/media requests, cleanup, no horizontal overflow or JS exceptions.
- Additional Chrome run with `--disable-webgl` confirmed the fallback message.
- Inspected desktop/mobile screenshots with Brazil highlighted.
- Local implementation only; no production deploy authorized or performed in this task.
