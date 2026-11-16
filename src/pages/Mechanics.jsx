import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { mechanics } from '../data/mockData.js'
import shelf from '../assets/mechanics-current/anaquel.webp'
import counter from '../assets/mechanics-current/mostrador.webp'
import './Mechanics.css'

const actionSprites = import.meta.glob('../assets/mechanics-current/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

function action(name) {
  return {
    animated: actionSprites[`../assets/mechanics-current/${name}.webp`],
    still: actionSprites[`../assets/mechanics-current/${name}-quieto.webp`],
  }
}

const carry = action('cargar')
const cleaning = action('limpiar')
const thief = action('ladron')
const owner = action('dueno')
const customer1 = action('cliente-1')
const customer2 = action('cliente-2')
const customer3 = action('cliente-3')

function MechanicSprite({ sprite, index }) {
  const className = `mechanic-sprite sprite-${index}`
  if (typeof sprite === 'string') {
    return <img className={className} src={sprite} alt="" loading="lazy" />
  }

  return (
    <picture className={className}>
      <source media="(prefers-reduced-motion: reduce)" srcSet={sprite.still} />
      <img src={sprite.animated} alt="" loading="lazy" />
    </picture>
  )
}

const illustrations = {
  reponer: { label: 'El Encargado lleva una caja hacia un anaquel de la tienda', images: [carry, shelf], tag: 'Inventario', tip: 'Revisa qué anaqueles necesitan productos antes de ir a la bodega.' },
  limpieza: { label: 'El Encargado limpia el piso con el trapeador', images: [cleaning], tag: 'Mantenimiento', tip: 'Mantén el piso limpio durante el turno.' },
  ladron: { label: 'El Ladrón roba junto al mostrador de cobro', images: [thief, counter], tag: 'Alerta', tip: 'No pierdas de vista la caja registradora.' },
  reputacion: { label: 'Clientes de la tienda cuya satisfacción influye en la reputación', images: [customer1, customer3], tag: 'Tu tienda', tip: 'Limpieza, productos y buena atención ayudan a cuidar la reputación.' },
  clientes: { label: 'Los tres compradores que visitan la tienda', images: [customer1, customer2, customer3], tag: 'Atención', tip: 'Procura que encuentren productos disponibles.' },
  auditoria: { label: 'El dueño inspecciona los anaqueles de la tienda', images: [owner, shelf], tag: 'Inspección', tip: 'Una tienda bien cuidada te prepara para una visita sorpresa.' },
}

export default function Mechanics() {
  const { hash } = useLocation()
  useEffect(() => {
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [hash])

  return (
    <div className="page mechanics-page">
      <header className="page-header">
        <p className="eyebrow">Wiki · Turno Rosso</p>
        <h1>Mecánicas</h1>
        <p className="mechanics-intro">Todo lo que necesitas para sacar adelante tu turno.</p>
      </header>
      <div className="page-content mechanics-list">
        {mechanics.map((item, index) => {
          const art = illustrations[item.id]
          return (
            <article className={`mechanic-card mechanic-${item.id}`} key={item.id} aria-labelledby={`mechanic-${item.id}`}>
              <div className="mechanic-art" role="img" aria-label={art.label}>
                <span className="mechanic-category">{art.tag}</span>
                <span className="mechanic-number" aria-hidden="true">0{index + 1}</span>
                <div className="mechanic-sprites" aria-hidden="true">
                  {art.images.map((sprite, index) => <MechanicSprite key={index} sprite={sprite} index={index} />)}
                </div>
              </div>
              <div className="mechanic-entry">
                <h2 id={`mechanic-${item.id}`}>{item.title}</h2>
                <p>{item.description}</p>
                <div className="mechanic-tip"><span>Consejo de turno</span><p>{art.tip}</p></div>
                <Link className="text-button" to={"/reportes?seccion=" + encodeURIComponent(item.title)}>Reportar sobre esta sección</Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
