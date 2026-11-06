import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { requestNotifications, showLocalNotification } from '../lib/notifications.js'

export default function Settings() {
  const [installPrompt, setInstallPrompt] = useState(window.__rossoInstall)
  const [installed, setInstalled] = useState(window.matchMedia('(display-mode: standalone)').matches)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const prompt = event => setInstallPrompt(event)
    const complete = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', prompt)
    window.addEventListener('appinstalled', complete)
    return () => {
      window.removeEventListener('beforeinstallprompt', prompt)
      window.removeEventListener('appinstalled', complete)
    }
  }, [])

  async function install() {
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
    window.__rossoInstall = null
    setInstallPrompt(null)
  }

  async function notify() {
    setBusy(true)
    try {
      await requestNotifications()
      await showLocalNotification('Turno Rosso', 'Puedes consultar tus reportes en Turno Rosso.', '/reportes')
      setNotice('Notificación enviada al dispositivo.')
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <header className="page-header"><p className="eyebrow">Turno Rosso</p><h1>Ajustes</h1></header>
      <div className="page-content stack">
        <section className="panel stack">
          <h2>Instalar la PWA</h2>
          {installed ? <p>La aplicación está instalada.</p> : installPrompt
            ? <button className="primary-button" onClick={install}>Instalar aplicación</button>
            : <p>En Android o escritorio, busca «Instalar aplicación» en el menú del navegador. En iPhone, usa Compartir y Añadir a pantalla de inicio.</p>}
          <p className="muted">La guía funciona sin conexión después de la primera descarga.</p>
        </section>
        <section className="panel stack">
          <h2>Notificaciones</h2>
          <p>Comprueba cómo se muestra un aviso en tu dispositivo.</p>
          <button className="secondary-button" disabled={busy} onClick={notify}>Probar notificación</button>
          {notice && <p role="status" className="feedback">{notice}</p>}
        </section>
        <section className="panel stack">
          <h2>Reportes</h2>
          <p>Tus reportes se vinculan con este navegador. Si borras las cookies del sitio o cambias de navegador, perderás acceso a los reportes que enviaste aquí.</p>
          <Link className="text-button" to="/revision">Panel de revisión</Link>
        </section>
      </div>
    </div>
  )
}
