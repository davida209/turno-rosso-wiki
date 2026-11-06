import { mechanics } from '../data/mockData.js'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Reports.css'

const statuses = { nuevo: 'Nuevo', revision: 'En revisión', resuelto: 'Resuelto' }
const areas = { guia: 'Guía', juego: 'Juego' }
const empty = { area: 'guia', section: '', title: '', description: '' }
let pendingList

async function request(method = 'GET', { body, id, key } = {}) {
  const query = new URLSearchParams()
  if (id) query.set('id', id)
  if (key) query.set('admin', '1')
  const headers = {}
  if (key) headers.Authorization = 'Bearer ' + key
  if (body) headers['Content-Type'] = 'application/json'
  const response = await fetch('/api/reports?' + query, { method, headers, body: body && JSON.stringify(body) })
  const data = await response.json().catch(() => null)
  if (!response.ok || data === null) throw new Error(data?.error || 'El servicio no está disponible.')
  return data
}

function listReports() {
  pendingList ??= request().finally(() => { pendingList = null })
  return pendingList
}

function ReportCard({ report, children }) {
  return <article className="panel stack report-card">
    <div className="section-heading">
      <span className="mini-label">{areas[report.area]} · {report.section}</span>
      <span className="report-state" data-state={report.status}>{statuses[report.status]}</span>
    </div>
    <h3>{report.title}</h3>
    <p>{report.description}</p>
    <p className="muted">Actualizado el {new Date(report.updated_at).toLocaleDateString('es-MX')}</p>
    {children}
  </article>
}

export default function Reports() {
  const { search } = useLocation()
  const [form, setForm] = useState(empty)
  const [reports, setReports] = useState([])
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null)
  const [createId, setCreateId] = useState(() => crypto.randomUUID())
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(search)
    setForm({ ...empty, area: params.get('area') === 'juego' ? 'juego' : 'guia', section: (params.get('seccion') ?? '').slice(0, 80) })
  }, [search])

  useEffect(() => {
    let active = true
    listReports().then(data => {
      if (active) { setReports(data); setReady(true) }
    }).catch(() => {
      if (active) setNotice('Conéctate a internet y pulsa Actualizar para cargar tus reportes.')
    })
    return () => { active = false }
  }, [])

  async function refresh() {
    setBusy(true)
    try {
      setReports(await listReports())
      setReady(true)
      setNotice('')
    } catch (error) { setNotice(error.message) }
    finally { setBusy(false) }
  }

  function reset() {
    setForm(empty)
    setEditing(null)
    setCreateId(crypto.randomUUID())
  }

  async function save(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const report = await request(editing ? 'PATCH' : 'POST', { id: editing, body: { ...form, id: createId } })
      setReports(previous => [report, ...previous.filter(item => item.id !== report.id)])
      setNotice(editing ? 'Cambios guardados. El reporte aparece como nuevo.' : 'Reporte enviado.')
      reset()
    } catch (error) { setNotice(error.message) }
    finally { setBusy(false) }
  }

  async function remove(id) {
    setBusy(true)
    try {
      await request('DELETE', { id })
      setReports(previous => previous.filter(item => item.id !== id))
      if (editing === id) reset()
      setDeleting(null)
      setNotice('Reporte retirado.')
    } catch (error) { setNotice(error.message) }
    finally { setBusy(false) }
  }

  function edit(report) {
    setForm({ area: report.area, section: report.section, title: report.title, description: report.description })
    setEditing(report.id)
    document.getElementById('report-title').focus()
  }

  const shown = reports.filter(report => !filter || report.area === filter)

  return <div className="page">
    <header className="page-header">
      <p className="eyebrow">Ayuda a mejorar Turno Rosso</p>
      <h1>Reportes</h1>
      <p className="page-subtitle">Cuéntanos qué encontraste en la guía o durante una partida.</p>
    </header>
    <div className="page-content stack">
      {notice && <p className="feedback" role="status">{notice}</p>}
      <form className="panel stack" onSubmit={save}>
        <h2>{editing ? 'Editar reporte' : 'Nuevo reporte'}</h2>
        <fieldset disabled={busy} className="report-fields stack">
          <label>¿Dónde ocurrió?
            <select value={form.area} onChange={event => setForm({ ...form, area: event.target.value, section: '' })}>
              <option value="guia">En la guía</option>
              <option value="juego">En el juego</option>
            </select>
          </label>
          <label>Sección o situación<input required maxLength={80} value={form.section} placeholder={form.area === 'juego' ? 'Ej. Durante un cobro' : 'Ej. Limpieza'} onChange={event => setForm({ ...form, section: event.target.value })} /></label>
          <label>Título<input id="report-title" required maxLength={100} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} /></label>
          <label>Descripción<textarea aria-label="Descripción" required rows={5} maxLength={3000} value={form.description} placeholder="Explica qué pasó y qué esperabas que ocurriera." onChange={event => setForm({ ...form, description: event.target.value })} /></label>
        </fieldset>
        <button className="primary-button" disabled={!ready || busy}>{editing ? 'Guardar cambios' : 'Enviar reporte'}</button>
        {editing && <button className="secondary-button" type="button" disabled={busy} onClick={reset}>Cancelar edición</button>}
      </form>
      <section className="stack" aria-label="Mis reportes">
        <div className="section-heading"><h2>Mis reportes</h2><button className="text-button" disabled={busy} onClick={refresh}>Actualizar</button></div>
        <p className="muted">Consulta tus reportes desde este navegador.</p>
        {reports.length > 0 && <label>Filtrar por origen<select value={filter} onChange={event => setFilter(event.target.value)}>
          <option value="">Todos</option><option value="guia">Guía</option><option value="juego">Juego</option>
        </select></label>}
        {ready && shown.length === 0 && <p className="empty-state">No hay reportes en esta vista.</p>}
        {shown.map(report => <ReportCard key={report.id} report={report}>
          <div className="button-row">
            {deleting === report.id ? <>
              <button className="danger-button" disabled={busy} onClick={() => remove(report.id)}>Sí, retirar</button>
              <button className="secondary-button" disabled={busy} onClick={() => setDeleting(null)}>Cancelar</button>
            </> : <>
              <button className="secondary-button" disabled={busy} onClick={() => edit(report)}>Editar</button>
              <button className="danger-button" disabled={busy} onClick={() => setDeleting(report.id)}>Retirar</button>
            </>}
          </div>
        </ReportCard>)}
      </section>
    </div>
  </div>
}

export function ReportReview() {
  const [key, setKey] = useState('')
  const [open, setOpen] = useState(false)
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  async function load(event) {
    event?.preventDefault()
    setBusy(true)
    try {
      setReports(await request('GET', { key: key.trim() }))
      setOpen(true)
      setNotice('')
    } catch (error) { setNotice(error.message) }
    finally { setBusy(false) }
  }

  async function update(id, status) {
    setBusy(true)
    try {
      const report = await request('PATCH', { id, key: key.trim(), body: { status } })
      setReports(previous => [report, ...previous.filter(item => item.id !== id)])
      setNotice('Estado actualizado.')
    } catch (error) { setNotice(error.message) }
    finally { setBusy(false) }
  }

  const shown = reports.filter(report => !filter || report.status === filter)

  return <div className="page">
    <header className="page-header"><p className="eyebrow">Turno Rosso</p><h1>Revisión de reportes</h1></header>
    <div className="page-content stack">
      {notice && <p className="feedback" role="status">{notice}</p>}
      {!open ? <form className="panel stack" onSubmit={load}>
        <label>Clave de revisión<input type="password" autoComplete="off" value={key} required onChange={event => setKey(event.target.value)} /></label>
        <button className="primary-button" disabled={busy || !key.trim()}>Abrir bandeja</button>
      </form> : <>
        <div className="button-row">
          <button className="secondary-button" disabled={busy} onClick={() => load()}>Actualizar</button>
          <button className="secondary-button" disabled={busy} onClick={() => { setOpen(false); setReports([]); setKey(''); setNotice('') }}>Cerrar bandeja</button>
        </div>
        <label>Estado<select value={filter} onChange={event => setFilter(event.target.value)}>
          <option value="">Todos</option>
          {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select></label>
        {shown.length === 0 && <p className="empty-state">No hay reportes en esta vista.</p>}
        {shown.map(report => <ReportCard key={report.id} report={report}>
          {report.area === 'guia' && <Link className="text-button" to={mechanics.find(item => item.title === report.section) ? "/mecanicas#mechanic-" + mechanics.find(item => item.title === report.section).id : "/mecanicas"}>Consultar la guía</Link>}
          <label>Estado de revisión<select value={report.status} disabled={busy} onChange={event => update(report.id, event.target.value)}>
            {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select></label>
        </ReportCard>)}
      </>}
    </div>
  </div>
}
