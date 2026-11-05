import { useNavigate } from 'react-router-dom'
import coverImage from '../assets/portada-tienda.jpg'
import './Welcome.css'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="welcome-screen">
      <div className="welcome-image-wrap">
        <img src={coverImage} alt="Turno de noche en la tienda de Turno Rosso" />
        <div className="welcome-image-fade" />
      </div>

      <div className="welcome-body">
        <span className="welcome-badge">Guía del encargado</span>
        <h1 className="welcome-title">
          Turno
          <br />
          Rosso
        </h1>
        <h2 className="welcome-subtitle">Wiki</h2>
        <p className="welcome-tagline">
          Mecánicas, objetivos del día y el marcador global de todos los que ya
          trabajaron su turno.
        </p>
        <button className="welcome-cta" onClick={() => navigate('/inicio')}>
          Comenzar
        </button>
        <p className="welcome-footnote">Versión 1.1 - App complementaria de Turno Rosso</p>
      </div>
    </div>
  )
}
