import { useEffect, useRef } from 'react'

const VERTEX_SHADER = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_scroll;
  uniform float u_time;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    vec2 parallax = (u_pointer - 0.5) * vec2(0.14, 0.10);
    float scrollDrift = sin(u_scroll * 0.00035) * 0.08;
    vec2 field = centered + parallax + vec2(scrollDrift, -scrollDrift * 0.45);

    float diagonal = smoothstep(-0.75, 0.75, field.x * 0.72 - field.y * 0.58);
    float haloA = 1.0 - smoothstep(0.05, 0.92, length(field - vec2(-0.30, 0.24)));
    float haloB = 1.0 - smoothstep(0.02, 0.78, length(field - vec2(0.42, -0.30)));
    float pulse = 0.5 + 0.5 * sin(u_time * 0.18);

    float shade = 0.10 + diagonal * 0.32 + haloA * (0.34 + pulse * 0.08) + haloB * 0.24;
    float vignette = 1.0 - smoothstep(0.22, 1.05, length(centered));
    shade = clamp(shade * (0.70 + vignette * 0.30), 0.0, 1.0);

    vec3 black = vec3(0.0);
    vec3 graphite = vec3(33.0 / 255.0);
    gl_FragColor = vec4(mix(black, graphite, shade), 1.0);
  }
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    })
    if (!canvas || !gl) return

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolutionUniform = gl.getUniformLocation(program, 'u_resolution')
    const pointerUniform = gl.getUniformLocation(program, 'u_pointer')
    const scrollUniform = gl.getUniformLocation(program, 'u_scroll')
    const timeUniform = gl.getUniformLocation(program, 'u_time')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let targetX = 0.5
    let targetY = 0.5
    let pointerX = 0.5
    let pointerY = 0.5
    let rafId = 0
    let visible = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.round(window.innerWidth * dpr)
      const height = Math.round(window.innerHeight * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`
        gl.viewport(0, 0, width, height)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth
      targetY = 1 - event.clientY / window.innerHeight
    }

    const draw = (time: number) => {
      pointerX += (targetX - pointerX) * 0.035
      pointerY += (targetY - pointerY) * 0.035
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height)
      gl.uniform2f(pointerUniform, pointerX, pointerY)
      gl.uniform1f(scrollUniform, window.scrollY)
      gl.uniform1f(timeUniform, reduceMotion ? 0 : time * 0.001)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (visible && !reduceMotion) rafId = requestAnimationFrame(draw)
    }

    const onVisibilityChange = () => {
      visible = !document.hidden
      if (!visible) {
        cancelAnimationFrame(rafId)
      } else if (!reduceMotion) {
        rafId = requestAnimationFrame(draw)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduceMotion) window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (buffer) gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 bg-bold-black"
      style={{ background: 'linear-gradient(145deg, #000000 0%, #212121 52%, #000000 100%)' }}
      aria-hidden="true"
    />
  )
}
