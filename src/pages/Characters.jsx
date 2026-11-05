import { useEffect, useRef, useState } from 'react'
import './Characters.css'

const files = import.meta.glob('../assets/personajes/**/*.png', { eager: true, query: '?url', import: 'default' })
const directions = [ ['Abajo', 'Frente'], ['Izquierda', 'Perfil izquierdo'], ['Arriba', 'Espalda'], ['Derecha', 'Perfil derecho'] ]
const cast = [
  ['Jugador', 'Encargado', 'Protagonista', 'El responsable de mantener la tienda a flote: repone inventario, cobra y limpia.'],
  ['Cliente01', 'Cliente 01', 'Comprador', 'Visita la tienda en busca de productos. Mantener los anaqueles llenos ayuda a que se vaya satisfecho.'],
  ['Cliente02', 'Cliente 02', 'Comprador', 'Otro de los clientes habituales. Su satisfacción también cuenta para la reputación de la tienda.'],
  ['Cliente03', 'Cliente 03', 'Comprador', 'Completa el grupo de compradores que encontrarás durante el turno.'],
  ['Dueno', 'El Dueño', 'Auditor', 'Realiza inspecciones sorpresa y multa la mala gestión de la tienda.'],
  ['Ladron', 'Ladrón', 'Amenaza', 'Entra sin avisar y busca dinero fácil en la caja si la descuidas.'],
]
function frames(id, action, direction) {
  return Object.entries(files).filter(([path]) => path.includes(`/${id}/${action}/${direction}/`)).sort(([a], [b]) => a.localeCompare(b)).map(([, url]) => url)
}
export default function Characters() {
  const [selected, setSelected] = useState(0)
  const [direction, setDirection] = useState(0)
  const [walking, setWalking] = useState(false)
  const [auto, setAuto] = useState(false)
  const [frame, setFrame] = useState(0)
  const drag = useRef(null)
  const person = cast[selected]
  const images = frames(person[0], walking ? 'Caminar' : 'Reposo', directions[direction][0])
  useEffect(() => {
    if (!walking) return
    const timer = setInterval(() => setFrame(f => f + 1), 180)
    return () => clearInterval(timer)
  }, [walking])
  useEffect(() => {
    if (!auto) return
    const timer = setInterval(() => setDirection(d => (d + 1) % 4), 1100)
    return () => clearInterval(timer)
  }, [auto])
  function turn(step) { setAuto(false); setDirection(d => (d + step + 4) % 4) }
  return (
    <div className="page characters-page">
      <header className="page-header"><p className="eyebrow">Wiki · Turno Rosso</p><h1>Personajes</h1><p className="character-intro">Conoce a quienes dan vida a la tienda.</p></header>
      <div className="page-content">
        <div className="cast-picker" role="group" aria-label="Elegir personaje">
          {cast.map((c, i) => <button key={c[0]} className={selected === i ? 'cast-item selected' : 'cast-item'} aria-pressed={selected === i} onClick={() => { setSelected(i); setFrame(0) }}><img src={frames(c[0], 'Reposo', 'Abajo')[0]} alt="" /><span>{c[1]}</span></button>)}
        </div>
        <section className="character-viewer" aria-label={`Visor de ${person[1]}`}>
          <div className="viewer-top"><span className="character-role">{person[2]}</span><span>0{selected + 1} / 06</span></div>
          <div className="sprite-stage" tabIndex={0} role="group" aria-label="Arrastra para girar o usa las flechas izquierda y derecha" onKeyDown={e => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); turn(e.key === 'ArrowRight' ? 1 : -1) } }} onPointerDown={e => { drag.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId) }} onPointerMove={e => { if (drag.current !== null && Math.abs(e.clientX - drag.current) > 35) { turn(e.clientX > drag.current ? 1 : -1); drag.current = e.clientX } }} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
            <div className="sprite-platform" /><img className="hero-sprite" draggable="false" src={images[frame % images.length]} alt={`${person[1]}: ${directions[direction][1]}, ${walking ? 'caminando' : 'en reposo'}`} />
          </div>
          <div className="turn-controls"><button onClick={() => turn(-1)} aria-label="Girar a la izquierda">↶</button><span aria-live="polite">{directions[direction][1]}</span><button onClick={() => turn(1)} aria-label="Girar a la derecha">↷</button></div>
          <p className="viewer-hint">Arrastra el personaje para darle la vuelta</p>
          <div className="direction-picker" role="group" aria-label="Vista del personaje">{directions.map((d, i) => <button key={d[0]} aria-pressed={direction === i} onClick={() => { setAuto(false); setDirection(i) }}>{d[1]}</button>)}</div>
          <div className="animation-controls"><button aria-pressed={walking} onClick={() => { setWalking(w => !w); setFrame(0) }}>{walking ? 'Ⅱ Detener pasos' : '▷ Ver caminar'}</button><button aria-pressed={auto} onClick={() => setAuto(a => !a)}>{auto ? 'Ⅱ Detener giro' : '↻ Giro automático'}</button></div>
        </section>
        <section className="character-entry"><h2>{person[1]}</h2><p>{person[3]}</p></section>
        <p className="sprite-note">Sprites originales · 4 direcciones · Reposo y caminata</p>
      </div>
    </div>
  )
}
