import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'

export default function BoldShaderGradientScene() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      pixelDensity={1}
      fov={45}
      pointerEvents="none"
      lazyLoad={false}
      powerPreference="low-power"
    >
      <ShaderGradient
        control="props"
        animate={reduceMotion ? 'off' : 'on'}
        type="waterPlane"
        shader="defaults"
        color1="#000000"
        color2="#212121"
        color3="#050505"
        brightness={0.82}
        lightType="3d"
        envPreset="city"
        grain="on"
        grainBlending={0.14}
        cAzimuthAngle={180}
        cDistance={2.8}
        cPolarAngle={80}
        cameraZoom={9.1}
        positionX={0}
        positionY={0}
        positionZ={0}
        rotationX={50}
        rotationY={0}
        rotationZ={-60}
        reflection={0.08}
        uAmplitude={0}
        uDensity={1.5}
        uFrequency={0}
        uSpeed={0.16}
        uStrength={1.5}
        uTime={8}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  )
}
