import { Link } from 'react-router-dom'
import './Home.css'

const tiles = [
  {to:'/notas',title:'Mi bitácora',description:'Guarda estrategias y pendientes, incluso sin conexión.',accent:'gold'},
  {to:'/cuenta',title:'Mi cuenta',description:'Sincroniza tus notas, instala la app y activa recordatorios.',accent:'rosso'},
  {
    to: '/mecanicas',
    title: 'Mecánicas',
    description: 'Cómo reponer anaqueles, limpiar, cobrar y evitar al ladrón.',
    accent: 'rosso',
  },
  {
    to: '/marcador',
    title: 'Marcador global',
    description: 'Consulta los resultados verificados y tu historial de partidas.',
    accent: 'gold',
  },
  {
    to: '/personajes',
    title: 'Personajes',
    description: 'Conoce al encargado, el ladrón, los clientes y el dueño de la tienda.',
    accent: 'rosso',
  },
]

export default function Home() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Hola, encargado</p>
        <h1>Turno Rosso Wiki</h1>
      </header>

      <div className="page-content">
        <div className="home-tiles">
          {tiles.map((tile) => (
            <Link key={tile.to} to={tile.to} className={`home-tile accent-${tile.accent}`}>
              <h3>{tile.title}</h3>
              <p>{tile.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
