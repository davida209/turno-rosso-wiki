import { mechanics } from '../data/mockData.js'
import shelf from '../assets/mecanicas/Estante_ConProductos.png'
import box from '../assets/mecanicas/Caja_Carton.png'
import mop from '../assets/mecanicas/Trapeador.png'
import sign from '../assets/mecanicas/Senal_PisoMojado.png'
import register from '../assets/mecanicas/Caja_Registradora.png'
import thief from '../assets/personajes/NPC/Ladron/Reposo/Abajo/Ladron_Reposo_Abajo_01.png'
import owner from '../assets/personajes/NPC/Dueno/Reposo/Abajo/Dueno_Reposo_Abajo_01.png'
import customer1 from '../assets/personajes/NPC/Cliente01/Reposo/Abajo/Cliente01_Reposo_Abajo_01.png'
import customer2 from '../assets/personajes/NPC/Cliente02/Reposo/Abajo/Cliente02_Reposo_Abajo_01.png'
import customer3 from '../assets/personajes/NPC/Cliente03/Reposo/Abajo/Cliente03_Reposo_Abajo_01.png'
import './Mechanics.css'

const illustrations = {
  reponer: { label: 'Una caja de inventario junto a un anaquel abastecido', images: [box, shelf], tag: 'Inventario', tip: 'Revisa qué anaqueles necesitan productos antes de ir a la bodega.' },
  limpieza: { label: 'Trapeador y señal de piso mojado de la tienda', images: [mop, sign], tag: 'Mantenimiento', tip: 'Mantén el piso limpio durante el turno.' },
  ladron: { label: 'El ladrón junto a la caja registradora', images: [thief, register], tag: 'Alerta', tip: 'No pierdas de vista la caja registradora.' },
  reputacion: { label: 'Clientes de la tienda cuya satisfacción influye en la reputación', images: [customer1, customer3], tag: 'Tu tienda', tip: 'Limpieza, productos y buena atención ayudan a cuidar la reputación.' },
  clientes: { label: 'Los tres compradores que visitan la tienda', images: [customer1, customer2, customer3], tag: 'Atención', tip: 'Procura que encuentren productos disponibles.' },
  auditoria: { label: 'El dueño inspecciona los anaqueles de la tienda', images: [owner, shelf], tag: 'Inspección', tip: 'Una tienda bien cuidada te prepara para una visita sorpresa.' },
}

export default function Mechanics() {
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
                <div className="mechanic-sprites" aria-hidden="true">{art.images.map((src, i) => <img key={src} className={`mechanic-sprite sprite-${i}`} src={src} alt="" loading="lazy" />)}</div>
              </div>
              <div className="mechanic-entry">
                <h2 id={`mechanic-${item.id}`}>{item.title}</h2>
                <p>{item.description}</p>
                <div className="mechanic-tip"><span>Consejo de turno</span><p>{art.tip}</p></div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
