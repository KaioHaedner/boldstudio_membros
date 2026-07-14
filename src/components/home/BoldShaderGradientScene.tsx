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
        color3="#111111"
        brightness={1.75}
        lightType="3d"
        envPreset="city"
        grain="on"
        grainBlending={0.08}
        cAzimuthAngle={180}
        cDistance={2.4}
        cPolarAngle={80}
        cameraZoom={8.2}
        positionX={0}
        positionY={0}
        positionZ={0}
        rotationX={50}
        rotationY={0}
        rotationZ={-45}
        reflection={0.12}
        uAmplitude={0}
        uDensity={1.25}
        uFrequency={0}
        uSpeed={0.24}
        uStrength={3.4}
        uTime={2}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  )
}
