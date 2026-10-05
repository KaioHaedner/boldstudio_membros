import backgrounds from '@/apps/site/data/backgrounds.json'

export function SideBackdrops() {
  return <div className="side-backdrops" aria-hidden="true">
    {/* The first four photos belong exclusively to Soluções' local parallax. */}
    {backgrounds.slice(4).map((file, index) => <img
      key={file}
      src={`/media/backgrounds/${file}`}
      alt=""
      className={`side-backdrops__photo ${index % 2 ? 'side-backdrops__photo--right' : 'side-backdrops__photo--left'}`}
      style={{ top: `${42 + index * 10}%` }}
      loading="lazy"
      decoding="async"
      draggable={false}
    />)}
  </div>
}
