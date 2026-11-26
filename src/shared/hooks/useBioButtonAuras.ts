import { useEffect, useRef } from 'react'
import { AURA_FRAGMENT_SHADER, AURA_VERTEX_SHADER } from '@/shared/lib/fluid-aura-shaders'

function createContext(canvas: HTMLCanvasElement) {
  try {
    return canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false })
  } catch {
    return null
  }
}

/** One GPU context shared by the buttons; touch/reduced-motion get a still frame. */
export function useBioButtonAuras<T extends HTMLElement = HTMLElement>() {
  const rootRef = useRef<T>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const source = document.createElement('canvas')
    const gl = createContext(source)
    if (!gl) return // CSS provides the decorative fallback.

    const compile = (type: number, code: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, code)
      gl.compileShader(shader)
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
      gl.deleteShader(shader)
      return null
    }
    const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision ? 'highp' : 'mediump'
    const vertex = compile(gl.VERTEX_SHADER, `attribute vec3 position;\n${AURA_VERTEX_SHADER}`)
    const fragment = compile(gl.FRAGMENT_SHADER, `precision ${precision} float;\n${AURA_FRAGMENT_SHADER}`)
    const program = gl.createProgram()
    const buffer = gl.createBuffer()
    const release = () => {
      if (buffer) gl.deleteBuffer(buffer)
      if (program) gl.deleteProgram(program)
      if (vertex) gl.deleteShader(vertex)
      if (fragment) gl.deleteShader(fragment)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    if (!vertex || !fragment || !program || !buffer) { release(); return }
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { release(); return }
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const phaseLocation = gl.getUniformLocation(program, 'u_phase')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    // Match THREE.Color's sRGB-to-linear conversion used by the original counters.
    const linear = (channel: number) => {
      const value = channel / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    }
    gl.uniform3f(gl.getUniformLocation(program, 'u_corFundo'), linear(2), linear(2), linear(2))
    gl.uniform3f(gl.getUniformLocation(program, 'u_corA'), 1, linear(215), linear(18))
    gl.uniform3f(gl.getUniformLocation(program, 'u_corB'), 1, linear(243), linear(176))

    const targets = Array.from(root.querySelectorAll<HTMLCanvasElement>('[data-bio-aura]')).map(canvas => ({
      canvas,
      context: canvas.getContext('2d'),
      phase: Number(canvas.dataset.bioAura || 0),
    }))
    const visible = new Set<HTMLCanvasElement>()
    const touchLayout = window.matchMedia('(max-width: 899px), (hover: none), (pointer: coarse)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const start = performance.now()
    let raf = 0
    let lastDraw = -Infinity
    let contextLost = false

    const schedule = () => {
      if (!raf && !document.hidden && !contextLost && visible.size) raf = requestAnimationFrame(draw)
    }
    const draw = (timestamp: number) => {
      raf = 0
      if (document.hidden || contextLost || !visible.size) return
      const animated = !touchLayout.matches && !reducedMotion.matches
      if (!animated || timestamp - lastDraw >= 1000 / 24) {
        gl.uniform1f(timeLocation, animated ? (timestamp - start) / 1000 * 0.72 : 4)
        for (const { canvas, context, phase } of targets) {
          if (!context || !visible.has(canvas)) continue
          const rect = canvas.getBoundingClientRect()
          if (!rect.width || !rect.height) continue
          const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
          const width = Math.max(1, Math.round(rect.width * dpr))
          const height = Math.max(1, Math.round(rect.height * dpr))
          if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height }
          if (source.width < width) source.width = width
          if (source.height < height) source.height = height
          gl.viewport(0, 0, width, height)
          gl.uniform2f(resolutionLocation, width, height)
          gl.uniform1f(phaseLocation, phase)
          gl.drawArrays(gl.TRIANGLES, 0, 3)
          context.drawImage(source, 0, source.height - height, width, height, 0, 0, width, height)
          canvas.dataset.auraReady = 'true'
        }
        lastDraw = timestamp
      }
      if (animated) schedule()
    }
    const intersection = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target as HTMLCanvasElement)
        else visible.delete(entry.target as HTMLCanvasElement)
      }
      schedule()
    }, { threshold: 0.01 })
    const resize = new ResizeObserver(schedule)
    for (const { canvas } of targets) { intersection.observe(canvas); resize.observe(canvas) }
    const onVisibility = () => {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0 }
      else schedule()
    }
    const onContextLost = (event: Event) => {
      event.preventDefault()
      contextLost = true
      if (raf) { cancelAnimationFrame(raf); raf = 0 }
      for (const { canvas, context } of targets) {
        context?.clearRect(0, 0, canvas.width, canvas.height)
        delete canvas.dataset.auraReady
      }
    }
    source.addEventListener('webglcontextlost', onContextLost)
    touchLayout.addEventListener('change', schedule)
    reducedMotion.addEventListener('change', schedule)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      intersection.disconnect()
      resize.disconnect()
      if (raf) cancelAnimationFrame(raf)
      touchLayout.removeEventListener('change', schedule)
      reducedMotion.removeEventListener('change', schedule)
      document.removeEventListener('visibilitychange', onVisibility)
      source.removeEventListener('webglcontextlost', onContextLost)
      release()
    }
  }, [])

  return rootRef
}
