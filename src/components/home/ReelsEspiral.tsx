import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Galeria espiral 3D (Three.js) — portado do efeito "Galeria Espiral 3D" da
// Imperio WEB Codes Store para componente React/Vite.
// Placeholder: alterna logo da Bold e card branco (totalImages = 2) ao longo
// dos 75 quadros (15 por volta x 5 voltas). Trocar pelas imagens/demoreels reais
// ajustando o array `textures` e CONFIG.totalImages.
const CONFIG = {
  totalImages: 2,
  tilesPerRevolution: 15,
  revolutions: 5,
  startRadius: 5,
  endRadius: 3.5,
  tileHeightRatio: 1.1,
  tileSegments: 24,
  spiralGap: 0.35,
  tileOverlap: 0.005,
  cameraZ: 12,
  cameraSmoothing: 0.075,
  baseRotationSpeed: 0.00125,
  scrollRotationMultiplier: 0.000875,
  rotationDecay: 0.9,
  cameraYMultiplier: 0.2,
  parallaxStrength: 0.1,
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec3 uCameraPosition;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    float facing = max(dot(-normalize(vWorldNormal), viewDir), 0.0);
    float falloff = smoothstep(-0.2, 0.5, facing) * 0.45 + 0.42;
    vec3 color = mix(vec3(1.0), tex.rgb * falloff, 0.975) * 1.25;
    gl_FragColor = vec4(color, tex.a);
  }
`

function whiteTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

function logoTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  const img = new Image()
  img.onload = () => {
    const s = Math.min((256 * 0.72) / img.width, (256 * 0.72) / img.height)
    const w = img.width * s
    const h = img.height * s
    ctx.drawImage(img, (256 - w) / 2, (256 - h) / 2, w, h)
    tex.needsUpdate = true
  }
  img.src = '/brand/logo-boldstudio.webp'
  return tex
}

export function ReelsEspiral() {
  const sectionRef = useRef<HTMLElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    const section = sectionRef.current
    if (!mount || !section) return

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const totalTiles = Math.floor(CONFIG.tilesPerRevolution * CONFIG.revolutions)
    const angleStep = (Math.PI * 2) / CONFIG.tilesPerRevolution

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.z = window.innerWidth < 1000 ? 15 : CONFIG.cameraZ

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const textures: THREE.Texture[] = [logoTexture(), whiteTexture()]
    const cameraPositionUniform = { value: new THREE.Vector3(0, 0, CONFIG.cameraZ) }

    // Alturas acumuladas de cada tile ao longo da espiral
    const tileEdgesY = [0]
    for (let i = 0; i < totalTiles; i++) {
      const progress = i / totalTiles
      const radius = CONFIG.startRadius + (CONFIG.endRadius - CONFIG.startRadius) * progress
      const arcWidth = (2 * Math.PI * radius) / CONFIG.tilesPerRevolution
      const tileHeight = arcWidth * CONFIG.tileHeightRatio
      tileEdgesY.push(tileEdgesY[i] - (tileHeight + CONFIG.spiralGap) / CONFIG.tilesPerRevolution)
    }

    const spiral = new THREE.Group()
    scene.add(spiral)

    const geometries: THREE.BufferGeometry[] = []
    const materials: THREE.ShaderMaterial[] = []

    for (let i = 0; i < totalTiles; i++) {
      const progress = i / totalTiles
      const radius = CONFIG.startRadius + (CONFIG.endRadius - CONFIG.startRadius) * progress
      const arcWidth = (2 * Math.PI * radius) / CONFIG.tilesPerRevolution
      const tileHeight = arcWidth * CONFIG.tileHeightRatio
      const tileAngle = arcWidth / radius + CONFIG.tileOverlap

      const centerY = (tileEdgesY[i] + tileEdgesY[i + 1]) / 2
      const slope = tileEdgesY[i + 1] - tileEdgesY[i]

      const positions: number[] = []
      const uvCoords: number[] = []
      const indices: number[] = []
      const segments = CONFIG.tileSegments

      for (let row = 0; row <= 1; row++) {
        for (let col = 0; col <= segments; col++) {
          const angle = (col / segments - 0.5) * tileAngle
          positions.push(
            Math.sin(angle) * radius,
            (row - 0.5) * tileHeight + (col / segments - 0.5) * slope,
            Math.cos(angle) * radius
          )
          uvCoords.push(col / segments, row)
        }
      }

      for (let col = 0; col < segments; col++) {
        const current = col
        const below = current + segments + 1
        indices.push(current, below, current + 1, below, below + 1, current + 1)
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvCoords, 2))
      geometry.setIndex(indices)
      geometry.computeVertexNormals()
      geometries.push(geometry)

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uMap: { value: textures[i % CONFIG.totalImages] },
          uCameraPosition: cameraPositionUniform,
        },
        side: THREE.DoubleSide,
      })
      materials.push(material)

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.y = centerY

      const tile = new THREE.Group()
      tile.rotation.y = i * angleStep
      tile.add(mesh)
      spiral.add(tile)
    }

    const spiralHeight = Math.abs(tileEdgesY[totalTiles])

    let mouseX = 0
    let mouseY = 0
    let smoothX = 0
    let smoothY = 0
    let spinVelocity = 0
    let lastScroll = window.scrollY
    let isMobile = window.innerWidth < 1000

    // Giro por arrastar (mouse + touch). touch-action pan-y deixa o scroll
    // vertical livre e captura o arraste horizontal pra girar o espiral.
    const DRAG_SENSITIVITY = 0.008
    let isDragging = false
    let lastPointerX = 0
    let dragDelta = 0
    const canvas = renderer.domElement
    canvas.style.touchAction = 'pan-y'
    canvas.style.cursor = 'grab'

    function onPointerDown(e: PointerEvent) {
      isDragging = true
      lastPointerX = e.clientX
      dragDelta = 0
      canvas.style.cursor = 'grabbing'
    }
    function onPointerMove(e: PointerEvent) {
      if (!isDragging) return
      const dx = e.clientX - lastPointerX
      lastPointerX = e.clientX
      dragDelta += dx * DRAG_SENSITIVITY
    }
    function onPointerUp() {
      if (!isDragging) return
      isDragging = false
      canvas.style.cursor = 'grab'
    }
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    function onMouseMove(e: MouseEvent) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    function onResize() {
      if (!mount) return
      isMobile = window.innerWidth < 1000
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.position.z = isMobile ? 15 : CONFIG.cameraZ
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      measure()
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)

    // Mede a posicao da secao so quando precisa (setup/resize), em vez de chamar
    // getBoundingClientRect() a cada frame (que forcava reflow e causava jank).
    let sectionTop = 0
    let sectionHeight = 0
    function measure() {
      const rect = section!.getBoundingClientRect()
      sectionTop = rect.top + window.scrollY
      sectionHeight = section!.offsetHeight
    }
    function sectionProgress(): number {
      const total = sectionHeight - window.innerHeight
      if (total <= 0) return 0
      const scrolled = Math.min(Math.max(window.scrollY - sectionTop, 0), total)
      return scrolled / total
    }

    let rafId = 0
    let visible = false

    // O loop roda continuamente: a camera fica SEMPRE sincronizada com o scroll,
    // entao nao ha salto/zoom na transicao de entrada e saida da secao. So o
    // render WebGL (e o spin do scroll) e pulado quando a secao nao esta visivel.
    function frame() {
      const progress = sectionProgress()

      const curScroll = window.scrollY
      if (visible) {
        spinVelocity += (curScroll - lastScroll) * CONFIG.scrollRotationMultiplier
      }
      lastScroll = curScroll

      camera.position.y +=
        (-(progress * spiralHeight * CONFIG.cameraYMultiplier) - camera.position.y) *
        CONFIG.cameraSmoothing

      if (!isMobile && !reduce) {
        smoothX += (mouseX - smoothX) * 0.02
        smoothY += (mouseY - smoothY) * 0.02
        spiral.rotation.x = smoothY * CONFIG.parallaxStrength
        spiral.rotation.z = -smoothX * CONFIG.parallaxStrength * 0.3
      }

      cameraPositionUniform.value.copy(camera.position)

      let rotY = reduce ? 0 : CONFIG.baseRotationSpeed
      if (isDragging) {
        rotY += dragDelta
        spinVelocity = dragDelta // ultima velocidade do arraste vira inercia ao soltar
        dragDelta = 0
      } else {
        rotY += spinVelocity
      }
      spiral.rotation.y += rotY
      spinVelocity *= CONFIG.rotationDecay

      if (visible) {
        renderer.render(scene, camera)
      }
      rafId = requestAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
      },
      { threshold: 0, rootMargin: '200px' }
    )
    observer.observe(section)

    measure()
    lastScroll = window.scrollY
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      geometries.forEach((g) => g.dispose())
      materials.forEach((m) => m.dispose())
      textures.forEach((t) => t.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} id="reels" className="relative scroll-mt-24" style={{ height: '140vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pb-24 pt-24 text-center [text-shadow:0_2px_14px_rgba(0,0,0,0.85)]">
          <p className="text-xs font-bold tracking-wider text-bold-yellow">Demoreel</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Veja uma prévia dos vídeos por aqui</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-bold-white/65">
            Role e atravesse a nossa galeria. Em breve, os demoreels e cases reais rodam por aqui.
          </p>
        </div>
      </div>
    </section>
  )
}
