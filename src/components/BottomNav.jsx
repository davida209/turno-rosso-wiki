import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const links = [
  { to: '/inicio', label: 'Inicio', icon: 'home' },
  { to: '/mecanicas', label: 'Mecánicas', icon: 'gear' },
  { to: '/marcador', label: 'Marcador', icon: 'bars' },
  { to: '/personajes', label: 'Personajes', icon: 'ring' },
]

function Icon({ name }) {
  if (name === 'home') {
    return <span className="icon icon-home" />
  }
  if (name === 'gear') {
    return <span className="icon icon-gear" />
  }
  if (name === 'bars') {
    return (
      <span className="icon icon-bars">
        <span style={{ height: '6px' }} />
        <span style={{ height: '11px' }} />
        <span style={{ height: '16px' }} />
      </span>
    )
  }
  return <span className="icon icon-ring" />
}

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        >
          <Icon name={link.icon} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
