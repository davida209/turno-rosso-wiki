import { Link } from 'react-router-dom'
import './Home.css'

const tiles = [
  {
    to: '/simulador',
    title: 'Simulador de turnos',
    description: 'Prueba decisiones bajo presión y compara tus estrategias.',
    accent: 'gold',
  },
  {
    to: '/mecanicas',
    title: 'Mecánicas',
    description: 'Cómo reponer anaqueles, limpiar, cobrar y evitar al ladrón.',
    accent: 'rosso',
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
        <img className="home-brand" src="/logo-rosso.png" alt="Rosso Games" />
        <p className="eyebrow">Guía del encargado</p>
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
