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
          Explora los personajes y las mecánicas de la tienda. Reporta lo que encuentres en la guía o durante una partida.
        </p>
        <button className="welcome-cta" onClick={() => navigate('/inicio')}>
          Comenzar
        </button>
        <img className="welcome-studio-logo" src="/logo-rosso.png" alt="Rosso Games" />
      </div>
    </div>
  )
}
