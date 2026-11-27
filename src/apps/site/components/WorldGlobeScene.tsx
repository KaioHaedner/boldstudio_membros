import { useEffect, useRef, useState } from 'react'
import Globe from 'globe.gl'
import { MeshPhongMaterial } from 'three'
import { feature } from 'topojson-client'
import { numericToAlpha2 } from 'i18n-iso-countries'
import world from 'world-atlas/countries-110m.json'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { Feature, Geometry } from 'geojson'

type Country = Feature<Geometry, { name: string }>
const countries = feature(world as unknown as Topology, world.objects.countries as unknown as GeometryCollection).features as Country[]
type GlobeInstance = InstanceType<typeof Globe>

export default function WorldGlobeScene({ active, lang }: { active: boolean; lang: string }) {
  const container = useRef<HTMLDivElement>(null)
  const globe = useRef<GlobeInstance | null>(null)
  const activeRef = useRef(active)
  const [selected, setSelected] = useState<Country | null>(null)
  const [failed, setFailed] = useState(false)
  const labels = lang === 'pt'
    ? { description: 'Globo com os países do mundo', hint: 'Arraste para girar. Passe o mouse ou toque em um país.', keyboard: 'Países do mundo', empty: 'Explore o mundo', failed: 'Globo interativo indisponível neste navegador.' }
    : lang === 'es'
      ? { description: 'Globo con los países del mundo', hint: 'Arrastra para girar. Pasa el ratón o toca un país.', keyboard: 'Países del mundo', empty: 'Explora el mundo', failed: 'Globo interactivo no disponible en este navegador.' }
      : { description: 'Globe showing the countries of the world', hint: 'Drag to rotate. Hover over or tap a country.', keyboard: 'Countries of the world', empty: 'Explore the world', failed: 'Interactive globe unavailable in this browser.' }
  const countryName = (country: Country) => {
    const code = numericToAlpha2(String(country.id).padStart(3, '0'))
    return code ? new Intl.DisplayNames([lang], { type: 'region' }).of(code) ?? country.properties.name : country.properties.name
  }
  useEffect(() => {
    activeRef.current = active
    const instance = globe.current
    if (!instance) return
    if (active) instance.resumeAnimation()
    else instance.pauseAnimation()
  }, [active])

  useEffect(() => {
    const element = container.current!
    let instance: GlobeInstance | null = null
    let observer: ResizeObserver | undefined
    let material: MeshPhongMaterial | undefined
    let stopMotionListener: (() => void) | undefined
    let live = true
    try {
      material = new MeshPhongMaterial({ color: '#040404', shininess: 8 })
      instance = new Globe(element, { animateIn: false, rendererConfig: { antialias: true, alpha: true, powerPreference: 'low-power' } })
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(false)
        .globeMaterial(material)
        .polygonsData(countries)
        .polygonCapColor(() => '#191919')
        .polygonSideColor(() => '#24200e')
        .polygonStrokeColor(() => '#807023')
        .polygonAltitude(.002)
        .polygonCapCurvatureResolution(5)
        .polygonsTransitionDuration(0)
        .polygonLabel(() => '')
        .onPolygonHover(country => { if (matchMedia('(hover: hover)').matches) setSelected(country as Country | null) })
        .onPolygonClick(country => setSelected(country as Country))
        .onGlobeClick(() => setSelected(null))
      globe.current = instance
      instance.renderer().setPixelRatio(Math.min(devicePixelRatio || 1, 1.5))
      instance.renderer().domElement.style.touchAction = 'pan-y'
      const controls = instance.controls()
      controls.enableZoom = false
      controls.enablePan = false
      controls.autoRotateSpeed = .25
      const motion = matchMedia('(prefers-reduced-motion: reduce)')
      const updateMotion = () => { controls.autoRotate = !motion.matches }
      updateMotion()
      motion.addEventListener('change', updateMotion)
      stopMotionListener = () => motion.removeEventListener('change', updateMotion)
      controls.enableDamping = false
      controls.rotateSpeed = .65
      instance.pointOfView({ lat: -12, lng: -52, altitude: 2.15 }, 0)
      const resize = () => { if (element.clientWidth) instance?.width(element.clientWidth).height(element.clientWidth) }
      resize()
      observer = new ResizeObserver(resize)
      observer.observe(element)
      if (!activeRef.current) instance.pauseAnimation()
    } catch {
      queueMicrotask(() => { if (live) setFailed(true) })
      instance?._destructor()
      instance = null
      globe.current = null
    }
    return () => {
      live = false
      stopMotionListener?.()
      observer?.disconnect()
      const renderer = instance?.renderer()
      instance?.pauseAnimation()
      instance?._destructor()
      renderer?.forceContextLoss()
      material?.dispose()
      globe.current = null
      element.replaceChildren()
    }
  }, [])

  useEffect(() => {
    const instance = globe.current
    if (!instance) return
    instance.polygonCapColor(country => country === selected ? '#ffd712' : '#191919')
  }, [selected])

  return <div className="studio-globe__scene" data-rendering={active && !failed}>
    <div ref={container} className="studio-globe__canvas" role="img" aria-label={labels.description} />
    {failed ? <p className="studio-globe__status" role="status">{labels.failed}</p> : <>
      <output className="studio-globe__country" aria-live="polite">{selected ? countryName(selected) : labels.empty}</output>
      <p className="studio-globe__hint">{labels.hint}</p>
      <select className="studio-globe__select" aria-label={labels.keyboard} value={selected?.id ?? ''} onChange={event => {
        setSelected(countries.find(country => String(country.id) === event.target.value) ?? null)
      }}>
        <option value="">{labels.empty}</option>
        {[...countries].sort((a, b) => countryName(a).localeCompare(countryName(b), lang)).map(country => <option key={country.id} value={country.id}>{countryName(country)}</option>)}
      </select>
    </>}
  </div>
}
