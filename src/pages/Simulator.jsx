import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { evaluatePlan, indicators, scenarios } from '../data/scenarios.js'
import './Simulator.css'

let pendingList
function listPlans() {
  pendingList ??= requestPlans().finally(() => { pendingList = null })
  return pendingList
}

async function requestPlans(method = 'GET', body, id) {
  const response = await fetch('/api/plans' + (id ? '?id=' + encodeURIComponent(id) : ''), {
    method,
    ...(body && { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || data === null) throw new Error(data?.error || 'El servicio de planes no está disponible.')
  return data
}

export default function Simulator() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id)
  const [actions, setActions] = useState([])
  const [evaluated, setEvaluated] = useState(false)
  const [title, setTitle] = useState('')
  const [editing, setEditing] = useState(null)
  const [createId, setCreateId] = useState(() => crypto.randomUUID())
  const [plans, setPlans] = useState([])
  const [search, setSearch] = useState('')
  const [comparisonId, setComparisonId] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)
  const [notice, setNotice] = useState('')

  const scenario = scenarios.find(item => item.id === scenarioId)
  const result = evaluated ? evaluatePlan(scenario, actions) : null
  const visiblePlans = plans.filter(plan => plan.title.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es')))
  const comparable = plans.filter(plan => plan.scenario === scenarioId && plan.id !== editing)
  const comparison = comparable.find(plan => plan.id === comparisonId)
  const comparisonResult = comparison ? evaluatePlan(scenario, comparison.actions) : null

  useEffect(() => {
    let active = true
    function refreshConnection() { setOnline(navigator.onLine) }
    window.addEventListener('online', refreshConnection)
    window.addEventListener('offline', refreshConnection)
    if (online) {
      listPlans().then(data => {
        if (!active) return
        setPlans(data)
        setReady(true)
        setNotice('')
      }).catch(() => {
        if (active) setNotice('No se pudieron cargar los planes. Puedes practicar mientras tanto.')
      })
    } else {
      setReady(false)
    }
    return () => {
      active = false
      window.removeEventListener('online', refreshConnection)
      window.removeEventListener('offline', refreshConnection)
    }
  }, [online])

  function newPlan(id = scenarioId) {
    setScenarioId(id)
    setActions([])
    setTitle('')
    setEditing(null)
    setEvaluated(false)
    setComparisonId('')
    setCreateId(crypto.randomUUID())
  }

  function toggleAction(id) {
    setEvaluated(false)
    setActions(previous => previous.includes(id) ? previous.filter(action => action !== id) : [...previous, id])
  }

  async function reloadPlans() {
    setBusy(true)
    try {
      setPlans(await listPlans())
      setReady(true)
      setNotice('')
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  async function save(event) {
    event.preventDefault()
    if (!result || !title.trim() || busy || !ready) return
    setBusy(true)
    try {
      const plan = await requestPlans(editing ? 'PATCH' : 'POST', {
        id: createId, title: title.trim(), scenario: scenarioId, actions,
      }, editing)
      setPlans(previous => [plan, ...previous.filter(item => item.id !== plan.id)])
      setEditing(plan.id)
      setTitle(plan.title)
      setNotice('Plan guardado.')
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  function load(plan) {
    setEditing(plan.id)
    setScenarioId(plan.scenario)
    setActions(plan.actions)
    setTitle(plan.title)
    setEvaluated(true)
    setComparisonId('')
    setNotice('Plan abierto. Puedes cambiar sus decisiones y guardarlo de nuevo.')
    document.getElementById('scenario-picker').focus()
  }

  async function remove(id) {
    setBusy(true)
    try {
      await requestPlans('DELETE', undefined, id)
      setPlans(previous => previous.filter(plan => plan.id !== id))
      if (editing === id) newPlan()
      setDeleting(null)
      setNotice('Plan eliminado.')
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page simulator">
      <header className="page-header">
        <p className="eyebrow">Práctica de tienda</p>
        <h1>Simulador de turnos</h1>
        <p className="page-subtitle">Tres problemas, tiempo para dos decisiones.</p>
      </header>
      <div className="page-content stack">
        <section className="panel stack" aria-label="Preparar el turno">
          <label>Escenario
            <select id="scenario-picker" value={scenarioId} disabled={busy} onChange={event => newPlan(event.target.value)}>
              {scenarios.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </label>
          <p>{scenario.context}</p>
          <p className="muted">Elige dos acciones en el orden en que las harías. Pulsa una selección para quitarla.</p>
          <div className="decision-list">
            {scenario.actions.map(action => {
              const position = actions.indexOf(action.id)
              return <button className="decision" type="button" key={action.id} aria-pressed={position !== -1}
                disabled={busy || (position === -1 && actions.length === 2)} onClick={() => toggleAction(action.id)}>
                <span className="decision-number" aria-hidden="true">{position === -1 ? '+' : position + 1}</span>
                <span><strong>{action.title}</strong><small>{action.detail}</small></span>
              </button>
            })}
          </div>
          {actions.length === 2 && <button className="secondary-button" disabled={busy} onClick={() => {
            setActions([...actions].reverse())
            setEvaluated(false)
          }}>Invertir el orden</button>}
          <button className="primary-button" disabled={actions.length !== 2 || busy} onClick={() => setEvaluated(true)}>Simular turno</button>
        </section>

        {result && <section className="panel stack" aria-label="Resultado del turno">
          <h2>Resultado del turno</h2>
          <p className="muted">Los indicadores son estimaciones del escenario para comparar tus decisiones.</p>
          <div className="turn-metrics">
            {indicators.map((indicator, index) => <div key={indicator}>
              <span>{indicator}</span>
              <strong>{result.values[index]}<small> / 100</small></strong>
              <meter min="0" max="100" value={result.values[index]} aria-label={indicator} />
            </div>)}
          </div>
          <ol className="turn-steps">
            {result.steps.map((step, index) => <li key={step.id}>
              <strong>{step.title}</strong>
              <p>{step.detail} {index === 1 && 'La demora resta ' + step.delay.flatMap((value, metric) => value ? [value + ' en ' + indicators[metric].toLowerCase()] : []).join(' y ') + '.'}</p>
              <Link to={'/mecanicas#mechanic-' + step.mechanic}>Repasar mecánica ↗</Link>
            </li>)}
          </ol>
          <p className="info-strip">Quedó pendiente: {result.deferred.title.toLowerCase()}.</p>
          <form className="stack" onSubmit={save}>
            <label>Nombre del plan<input value={title} onChange={event => setTitle(event.target.value)} maxLength={60} required disabled={busy} placeholder="Ej. Primero la seguridad" /></label>
            <button className="primary-button" disabled={!online || !ready || busy || !title.trim()}>{editing ? 'Guardar cambios' : 'Guardar plan'}</button>
            {editing && <button type="button" className="secondary-button" disabled={busy} onClick={() => newPlan()}>Empezar otro plan</button>}
          </form>
          {comparable.length > 0 && <label>Comparar con otro plan
            <select value={comparisonId} onChange={event => setComparisonId(event.target.value)}>
              <option value="">Elige un plan del mismo escenario</option>
              {comparable.map(plan => <option key={plan.id} value={plan.id}>{plan.title}</option>)}
            </select>
          </label>}
          {comparisonResult && <table className="comparison">
            <caption>Comparación de resultados</caption>
            <thead><tr><th scope="col">Indicador</th><th scope="col">Actual</th><th scope="col">{comparison.title}</th></tr></thead>
            <tbody>{indicators.map((indicator, index) => <tr key={indicator}>
              <th scope="row">{indicator}</th><td>{result.values[index]}</td><td>{comparisonResult.values[index]}</td>
            </tr>)}</tbody>
          </table>}
        </section>}

        <section className="stack" aria-label="Planes guardados">
          <div className="section-heading"><h2>Planes guardados</h2><button className="text-button" disabled={!online || busy} onClick={reloadPlans}>Actualizar</button></div>
          {notice && <p className="feedback" role="status">{notice}</p>}
          {!online && <p className="info-strip">Puedes simular sin conexión. Vuelve a conectarte para guardar o actualizar tus planes.</p>}
          {ready && !plans.length && <p className="empty-state">Guarda dos estrategias del mismo escenario para comparar sus resultados.</p>}
          {plans.length > 0 && <label>Buscar planes<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Nombre del plan" /></label>}
          {plans.length > 0 && visiblePlans.length === 0 && <p className="empty-state">Ningún plan coincide con la búsqueda.</p>}
          {visiblePlans.map(plan => <article key={plan.id} className="panel stack">
            <span className="mini-label">{scenarios.find(item => item.id === plan.scenario)?.title}</span>
            <h3>{plan.title}</h3>
            {deleting === plan.id ? <div className="button-row">
              <button className="danger-button" disabled={!online || busy} onClick={() => remove(plan.id)}>Sí, eliminar</button>
              <button className="secondary-button" disabled={busy} onClick={() => setDeleting(null)}>Cancelar</button>
            </div> : <div className="button-row">
              <button className="secondary-button" disabled={busy} onClick={() => load(plan)}>Abrir y editar</button>
              <button className="danger-button" disabled={!online || busy} onClick={() => setDeleting(plan.id)}>Eliminar</button>
            </div>}
          </article>)}
        </section>
      </div>
    </div>
  )
}
