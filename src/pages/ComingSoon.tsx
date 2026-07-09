// Página "Em Breve" do domínio raiz (boldstudiobrasil.com) enquanto o site oficial
// está em construção. Todo o estilo fica escopado sob .cs-root e o <style> só existe
// enquanto este componente está montado, então não vaza para o resto do app.
import { Footer } from '@/components/Footer'

const HTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600;700&display=swap');
.cs-root{--gold:#FFD712;--gold-soft:#FFE970;--amber:#FFB300;--warm:#FFF6D0;font-family:'Inter',-apple-system,sans-serif;background:#050505;color:#fff;position:relative;min-height:100vh;width:100%;overflow:hidden;display:flex;align-items:center;justify-content:center;z-index:0}
.cs-root *{margin:0;padding:0;box-sizing:border-box}
.cs-root .bg{position:fixed;inset:0;z-index:0;overflow:hidden}
.cs-root .bg .radial{position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 45%, rgba(255,215,18,.10) 0%, rgba(255,179,0,.04) 35%, transparent 70%)}
.cs-root .bg .aurora{position:absolute;width:120vmax;height:120vmax;top:50%;left:50%;background:radial-gradient(circle at center, rgba(255,215,18,.07), transparent 60%);transform:translate(-50%,-50%);animation:csAurora 9s ease-in-out infinite;filter:blur(40px)}
@keyframes csAurora{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:.9;transform:translate(-50%,-50%) scale(1.15)}}
.cs-root .bg .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,215,18,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,18,.04) 1px,transparent 1px);background-size:46px 46px;mask-image:radial-gradient(ellipse 60% 60% at 50% 45%, #000 30%, transparent 75%);-webkit-mask-image:radial-gradient(ellipse 60% 60% at 50% 45%, #000 30%, transparent 75%)}
.cs-root .bg .vignette{position:absolute;inset:0;background:radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,.85) 100%)}
.cs-root .waves{position:absolute;left:0;right:0;bottom:0;z-index:1;width:100%;height:30vh;min-height:150px;pointer-events:none}
.cs-root .waves svg{width:200%;height:100%;display:block}
.cs-root .wave-move{animation:csWave linear infinite}
.cs-root .w1{animation-duration:18s;opacity:.10}
.cs-root .w2{animation-duration:26s;opacity:.07}
.cs-root .w3{animation-duration:34s;opacity:.05}
@keyframes csWave{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.cs-root .stage{position:relative;z-index:2;width:100%;max-width:960px;padding:16px 24px 92px;text-align:center}
.cs-root .brandbar{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:8px}
.cs-root .brandbar .brand-logo{height:52px;width:auto;display:block;filter:drop-shadow(0 0 14px rgba(255,215,18,.3))}
.cs-root .loader{width:100%;max-width:702px;margin:6px auto 0;filter:drop-shadow(0 10px 40px rgba(0,0,0,.6))}
.cs-root .loader svg{width:100%;height:auto;display:block}
.cs-root .trace-bg{stroke:#2a2a2a;stroke-width:1.8;fill:none}
.cs-root .trace-flow{stroke-width:2;fill:none;stroke-dasharray:46 400;stroke-dashoffset:446;filter:drop-shadow(0 0 7px currentColor);animation:csFlow 3.2s cubic-bezier(.5,0,.9,1) infinite}
.cs-root .gold{stroke:var(--gold);color:var(--gold)}
.cs-root .softgold{stroke:var(--gold-soft);color:var(--gold-soft)}
.cs-root .amber{stroke:var(--amber);color:var(--amber)}
.cs-root .warm{stroke:var(--warm);color:var(--warm)}
.cs-root .d1{animation-delay:0s}.cs-root .d2{animation-delay:.5s}.cs-root .d3{animation-delay:1s}.cs-root .d4{animation-delay:1.5s}.cs-root .d5{animation-delay:.8s}.cs-root .d6{animation-delay:.3s}.cs-root .d7{animation-delay:1.3s}.cs-root .d8{animation-delay:.6s}
@keyframes csFlow{to{stroke-dashoffset:0}}
.cs-root .chip-glow{animation:csChip 2.6s ease-in-out infinite;transform-origin:center}
@keyframes csChip{0%,100%{opacity:.55}50%{opacity:1}}
.cs-root .node{fill:#0a0a0a;stroke:#3a3a3a;stroke-width:1.5}
.cs-root .title{font-family:'Anton',sans-serif;font-size:clamp(40px,8.5vw,78px);line-height:.92;letter-spacing:.01em;margin-top:8px;background:linear-gradient(180deg,#fff 0%,#d8d8d8 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.cs-root .title b{color:var(--gold);-webkit-text-fill-color:var(--gold);text-shadow:0 0 30px rgba(255,215,18,.45)}
.cs-root .subtitle{margin-top:12px;font-size:clamp(13px,2vw,16px);color:#bdbdbd;font-weight:400;letter-spacing:.01em;max-width:540px;margin-left:auto;margin-right:auto;line-height:1.55}
.cs-root .subtitle strong{color:var(--gold-soft);font-weight:600}
.cs-root .socials{display:flex;gap:18px;justify-content:center;margin-top:28px}
.cs-root .social-btn{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#171717,#080808);border:1px solid rgba(255,215,18,.25);color:var(--gold);fill:var(--gold);position:relative;cursor:pointer;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.45);transition:transform .3s cubic-bezier(.34,1.56,.64,1),background .3s,box-shadow .3s,border-color .3s,fill .3s}
.cs-root .social-btn svg{width:23px;height:23px}
.cs-root .social-btn::after{content:attr(data-name);position:absolute;bottom:-25px;left:50%;transform:translateX(-50%);font-size:11px;letter-spacing:.04em;color:#cfcfcf;white-space:nowrap;opacity:0;transition:opacity .3s;pointer-events:none}
.cs-root .social-btn:hover{transform:translateY(-7px) scale(1.08);box-shadow:0 10px 26px rgba(255,215,18,.35);border-color:transparent;background:var(--gold);fill:#0a0a0a}
.cs-root .social-btn:hover::after{opacity:1}
.cs-root .powered{position:absolute;left:0;right:0;bottom:0;z-index:5;text-align:center;font-size:13.5px;letter-spacing:.02em;color:#a8a8a8;font-weight:400;padding:26px 16px 16px;background:linear-gradient(to top, #050505 50%, rgba(5,5,5,.9) 78%, transparent 100%)}
.cs-root .powered b{color:var(--gold);font-weight:700;letter-spacing:.01em}
.cs-root .powered .sep{color:#5a5a5a;margin:0 8px}
@media (max-height:860px){.cs-root .loader{max-width:624px;margin-top:4px}.cs-root .title{font-size:clamp(36px,7vw,64px);margin-top:6px}.cs-root .subtitle{margin-top:8px}.cs-root .brandbar{margin-bottom:2px}.cs-root .waves{height:28vh}}
@media (max-height:700px){.cs-root .loader{max-width:499px;margin-top:0}.cs-root .title{font-size:clamp(30px,6vw,50px);margin-top:4px}.cs-root .subtitle{font-size:13px;margin-top:6px;max-width:480px}.cs-root .stage{padding-bottom:74px}.cs-root .waves{height:22vh}.cs-root .socials{margin-top:18px}.cs-root .social-btn{width:46px;height:46px}.cs-root .social-btn svg{width:20px;height:20px}}
@media (max-height:580px){.cs-root .loader{max-width:390px}.cs-root .title{font-size:clamp(26px,5vw,40px)}.cs-root .subtitle{margin-top:4px}}
@media (max-width:900px){.cs-root .stage{padding:18px 20px 94px}.cs-root .title{font-size:clamp(38px,9vw,66px)}.cs-root .brandbar .brand-logo{height:44px}}
@media (max-width:560px){.cs-root .stage{padding:14px 16px 86px}.cs-root .title{font-size:clamp(33px,10vw,50px)}.cs-root .subtitle{font-size:14px;max-width:92%}.cs-root .brandbar .brand-logo{height:38px}.cs-root .socials{gap:14px;margin-top:22px}.cs-root .social-btn{width:50px;height:50px}.cs-root .social-btn svg{width:21px;height:21px}.cs-root .waves{height:22vh}.cs-root .powered{font-size:12px;letter-spacing:0;padding:22px 14px 14px}.cs-root .powered .sep{margin:0 6px}}
@media (max-width:380px){.cs-root .title{font-size:clamp(28px,12vw,42px)}.cs-root .subtitle{font-size:13px}.cs-root .socials{gap:10px}.cs-root .social-btn{width:46px;height:46px}.cs-root .social-btn svg{width:19px;height:19px}.cs-root .powered{font-size:11px}}
@media (max-height:480px){.cs-root .brandbar{margin-bottom:0}.cs-root .loader{max-width:230px;margin-top:0}.cs-root .title{font-size:28px;margin-top:2px}.cs-root .subtitle{font-size:12px;margin-top:4px;max-width:600px}.cs-root .socials{margin-top:10px}.cs-root .social-btn{width:42px;height:42px}.cs-root .social-btn svg{width:18px;height:18px}.cs-root .powered{padding:14px 14px 8px}}
</style>

<div class="bg">
  <div class="aurora"></div>
  <div class="radial"></div>
  <div class="grid"></div>
  <div class="vignette"></div>
</div>

<div class="waves">
  <svg viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path class="wave-move w3" fill="#FFD712" d="M0,120 C240,170 480,70 720,110 C960,150 1200,80 1440,120 L1440,200 L0,200 Z M1440,120 C1680,170 1920,70 2160,110 C2400,150 2640,80 2880,120 L2880,200 L1440,200 Z" />
    <path class="wave-move w2" fill="#FFB300" d="M0,140 C300,100 540,180 720,140 C900,100 1140,180 1440,140 L1440,200 L0,200 Z M1440,140 C1740,100 1980,180 2160,140 C2340,100 2580,180 2880,140 L2880,200 L1440,200 Z" />
    <path class="wave-move w1" fill="#FFD712" d="M0,160 C240,140 480,190 720,165 C960,140 1200,190 1440,160 L1440,200 L0,200 Z M1440,160 C1680,140 1920,190 2160,165 C2400,140 2640,190 2880,160 L2880,200 L1440,200 Z" />
  </svg>
</div>

<main class="stage">
  <div class="brandbar">
    <img class="brand-logo" src="/brand/logo-primary.png" alt="BoldStudio" />
  </div>

  <div class="loader">
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a2a2a"/>
          <stop offset="100%" stop-color="#0c0c0c"/>
        </linearGradient>
        <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FFE970"/>
          <stop offset="100%" stop-color="#FFB300"/>
        </linearGradient>
        <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stop-color="#d8c068"/>
          <stop offset="50%" stop-color="#8a7a30"/>
          <stop offset="100%" stop-color="#544c1f"/>
        </linearGradient>
      </defs>
      <g id="traces">
        <path d="M100 100 H200 V210 H326" class="trace-bg"/>
        <path d="M100 100 H200 V210 H326" class="trace-flow gold d1"/>
        <path d="M80 180 H180 V230 H326" class="trace-bg"/>
        <path d="M80 180 H180 V230 H326" class="trace-flow amber d2"/>
        <path d="M60 260 H150 V250 H326" class="trace-bg"/>
        <path d="M60 260 H150 V250 H326" class="trace-flow softgold d3"/>
        <path d="M100 350 H200 V270 H326" class="trace-bg"/>
        <path d="M100 350 H200 V270 H326" class="trace-flow warm d4"/>
        <path d="M700 90 H560 V210 H474" class="trace-bg"/>
        <path d="M700 90 H560 V210 H474" class="trace-flow softgold d5"/>
        <path d="M740 160 H580 V230 H474" class="trace-bg"/>
        <path d="M740 160 H580 V230 H474" class="trace-flow gold d6"/>
        <path d="M720 250 H590 V250 H474" class="trace-bg"/>
        <path d="M720 250 H590 V250 H474" class="trace-flow amber d7"/>
        <path d="M680 340 H570 V270 H474" class="trace-bg"/>
        <path d="M680 340 H570 V270 H474" class="trace-flow warm d8"/>
      </g>
      <rect class="chip-glow" x="322" y="182" width="156" height="116" rx="26" ry="26" fill="none" stroke="#FFD712" stroke-width="2" opacity="0.6" filter="drop-shadow(0 0 14px #FFD712)"/>
      <rect x="330" y="190" width="140" height="100" rx="20" ry="20" fill="url(#chipGradient)" stroke="#FFD712" stroke-width="1.5" filter="drop-shadow(0 0 8px rgba(0,0,0,0.8))"/>
      <g>
        <rect x="322" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2"/>
        <rect x="322" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2"/>
        <rect x="322" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2"/>
        <rect x="322" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2"/>
      </g>
      <g>
        <rect x="470" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2"/>
        <rect x="470" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2"/>
        <rect x="470" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2"/>
        <rect x="470" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2"/>
      </g>
      <text x="400" y="240" font-family="Anton, Arial, sans-serif" font-size="24" fill="url(#textGradient)" text-anchor="middle" alignment-baseline="middle" letter-spacing="1">EM BREVE</text>
      <circle cx="100" cy="100" r="5" class="node"/>
      <circle cx="80" cy="180" r="5" class="node"/>
      <circle cx="60" cy="260" r="5" class="node"/>
      <circle cx="100" cy="350" r="5" class="node"/>
      <circle cx="700" cy="90" r="5" class="node"/>
      <circle cx="740" cy="160" r="5" class="node"/>
      <circle cx="720" cy="250" r="5" class="node"/>
      <circle cx="680" cy="340" r="5" class="node"/>
    </svg>
  </div>

  <h1 class="title">Bold<b>Studio</b></h1>
  <p class="subtitle">Estamos construindo algo grande. Um novo site e uma plataforma de <strong>videoaulas e conteúdo audiovisual</strong>, em breve no ar.</p>

  <div class="socials">
    <a class="social-btn ig" href="https://www.instagram.com/boldstudiobrasil?igsh=MWoxYmI5NG5iYXRhbg==" target="_blank" rel="noopener" data-name="Instagram" aria-label="Instagram">
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.281.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/></svg>
    </a>
    <a class="social-btn fb" href="#" data-name="Facebook" aria-label="Facebook">
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg>
    </a>
    <a class="social-btn wa" href="#" data-name="WhatsApp" aria-label="WhatsApp">
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
    </a>
    <a class="social-btn em" href="mailto:bold@boldstudiobrasil.com" data-name="E-mail" aria-label="E-mail">
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/></svg>
    </a>
  </div>
</main>

<div class="powered">
  Powered by <b>Kaio H</b> <span class="sep">&</span> <b>BoldStudio</b>
</div>
`

export function ComingSoon() {
  return (
    <>
      <div className="cs-root" dangerouslySetInnerHTML={{ __html: HTML }} />
      <Footer />
    </>
  )
}
