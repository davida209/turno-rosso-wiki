This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
mockups-turno-rosso-wiki/
  01-Portada-Bienvenida.png
  02-Menu-Principal.png
  03-Wiki-Mecanicas.png
  04-Marcador-Global.png
  05-Tu-Turno-Objetivos.png
src/
  assets/
    portada-tienda.jpg
  components/
    AppLayout.jsx
    BottomNav.css
    BottomNav.jsx
  data/
    mockData.js
  pages/
    Home.css
    Home.jsx
    Leaderboard.css
    Leaderboard.jsx
    Mechanics.css
    Mechanics.jsx
    MyShift.css
    MyShift.jsx
    Welcome.css
    Welcome.jsx
  App.jsx
  index.css
  main.jsx
.gitignore
index.html
package.json
README.md
vite.config.js
```

# Files

## File: src/components/AppLayout.jsx
```javascript
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Outlet />
      <BottomNav />
    </div>
  )
}
```

## File: src/components/BottomNav.css
```css
.bottom-nav {
  flex-shrink: 0;
  display: flex;
  border-top: 1px solid var(--line);
  background: var(--navy-soft);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 0 14px;
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--cream-dim);
}

.nav-item.active {
  color: var(--gold);
}

.icon {
  width: 20px;
  height: 20px;
  position: relative;
  display: block;
}

.icon-home {
  border-bottom: 12px solid currentColor;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  height: 0;
  width: 0;
  margin: 2px auto 0;
}
.icon-home::after {
  content: '';
  position: absolute;
  top: 12px;
  left: -8px;
  width: 16px;
  height: 8px;
  background: currentColor;
}

.icon-gear {
  width: 16px;
  height: 16px;
  border: 3px solid currentColor;
  border-radius: 50%;
  margin: 2px auto;
}
.icon-gear::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.icon-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 16px;
  margin: 2px auto;
}
.icon-bars span {
  width: 4px;
  background: currentColor;
  display: block;
}

.icon-ring {
  width: 18px;
  height: 18px;
  border: 3px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  margin: 1px auto;
}
```

## File: src/components/BottomNav.jsx
```javascript
import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const links = [
  { to: '/inicio', label: 'Inicio', icon: 'home' },
  { to: '/mecanicas', label: 'Mecánicas', icon: 'gear' },
  { to: '/marcador', label: 'Marcador', icon: 'bars' },
  { to: '/turno', label: 'Tu turno', icon: 'ring' },
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
```

## File: src/data/mockData.js
```javascript
// Datos de ejemplo. Cuando exista el backend real, estas funciones se
// reemplazan por llamadas fetch/axios a la API sin tocar los componentes
// que las consumen (todos reciben los datos ya resueltos).

export const mechanics = [
  {
    id: 'reponer',
    title: 'Reponer anaqueles',
    description:
      'Lleva una caja de la bodega y transfiere su contenido a un anaquel con espacio disponible.',
  },
  {
    id: 'limpieza',
    title: 'Limpieza',
    description:
      'Toma el trapeador y mantén presionada la interacción sobre una mancha hasta que desaparezca.',
  },
  {
    id: 'ladron',
    title: 'Ladrón',
    description:
      'Aparece por sorpresa; si nadie está en la caja, roba el dinero en 3 segundos y huye.',
  },
  {
    id: 'reputacion',
    title: 'Reputación',
    description:
      'Baja con manchas activas, anaqueles vacíos y clientes insatisfechos. Si llega a 0, pierdes la tienda.',
  },
  {
    id: 'clientes',
    title: 'Clientes',
    description:
      'Compran de los anaqueles con stock disponible; si están vacíos, se marchan insatisfechos.',
  },
  {
    id: 'auditoria',
    title: 'Auditoría del dueño',
    description:
      'Llega sin avisar; si la reputación está baja al momento de la visita, aplica una multa al balance.',
  },
]

export const leaderboard = [
  { rank: 1, name: 'Les', score: 1240, result: 'gano' },
  { rank: 2, name: 'Ana', score: 980, result: 'gano' },
  { rank: 3, name: 'Marco', score: 760, result: 'perdio' },
  { rank: 4, name: 'Fer', score: 540, result: 'perdio' },
  { rank: 5, name: 'Dani', score: 410, result: 'perdio' },
]

export const currentShift = {
  day: 4,
  totalDays: 7,
  money: 840,
  reputation: 6,
  reputationMax: 10,
  objectives: [
    { id: 'obj-reponer', title: 'Rellenar anaqueles', current: 5, target: 5 },
    { id: 'obj-limpiar', title: 'Limpiar manchas', current: 0, target: 1 },
  ],
}
```

## File: src/pages/Home.css
```css
.home-tiles {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.home-tile {
  display: block;
  background: var(--navy-soft);
  border: 1px solid var(--line);
  border-left: 6px solid var(--rosso);
  padding: 16px 18px;
}

.home-tile.accent-gold {
  border-left-color: var(--gold);
}

.home-tile h3 {
  font-size: 20px;
  text-transform: uppercase;
  color: var(--cream);
}

.home-tile p {
  font-size: 13px;
  color: var(--cream-dim);
  margin-top: 5px;
  line-height: 1.45;
}
```

## File: src/pages/Home.jsx
```javascript
import { Link } from 'react-router-dom'
import './Home.css'

const tiles = [
  {
    to: '/mecanicas',
    title: 'Mecánicas',
    description: 'Cómo reponer anaqueles, limpiar, cobrar y evitar al ladrón.',
    accent: 'rosso',
  },
  {
    to: '/marcador',
    title: 'Marcador global',
    description: 'Los puntajes de todos los encargados que ya jugaron su turno.',
    accent: 'gold',
  },
  {
    to: '/turno',
    title: 'Tu turno',
    description: 'Día actual, objetivos pendientes, dinero y reputación.',
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
```

## File: src/pages/Leaderboard.css
```css
.score-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}

.score-name {
  flex: 1;
  font-family: var(--font-display);
  font-size: 17px;
  color: var(--cream);
}

.score-amount {
  font-family: var(--font-display);
  font-size: 17px;
  color: var(--cream);
}

.score-result {
  font-family: var(--font-display);
  font-size: 12px;
  letter-spacing: 0.5px;
  padding: 3px 9px;
  border-radius: 3px;
  text-transform: uppercase;
}

.score-result.gano {
  background: rgba(242, 177, 52, 0.18);
  color: var(--gold);
}

.score-result.perdio {
  background: rgba(194, 59, 51, 0.22);
  color: #E8847D;
}
```

## File: src/pages/Leaderboard.jsx
```javascript
import { leaderboard } from '../data/mockData.js'
import './Leaderboard.css'

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

export default function Leaderboard() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Todos los turnos jugados</p>
        <h1>Marcador global</h1>
      </header>

      <div className="page-content">
        {leaderboard.map((entry, index) => (
          <div key={entry.rank}>
            <div className="score-row">
              <span className="tag-chip">{entry.rank}</span>
              <span className="score-name">{entry.name}</span>
              <span className="score-amount">{currencyFormatter.format(entry.score)}</span>
              <span className={`score-result ${entry.result}`}>
                {entry.result === 'gano' ? 'Ganó' : 'Perdió'}
              </span>
            </div>
            {index < leaderboard.length - 1 && <div className="rule" />}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## File: src/pages/Mechanics.css
```css
.mechanic-entry {
  padding: 13px 0;
}

.mechanic-entry h3 {
  font-size: 18px;
  color: var(--cream);
}

.mechanic-entry p {
  font-size: 13px;
  color: var(--cream-dim);
  margin-top: 4px;
  line-height: 1.5;
}
```

## File: src/pages/Mechanics.jsx
```javascript
import { mechanics } from '../data/mockData.js'
import './Mechanics.css'

export default function Mechanics() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Wiki</p>
        <h1>Mecánicas</h1>
      </header>

      <div className="page-content">
        {mechanics.map((item, index) => (
          <div key={item.id}>
            <div className="mechanic-entry">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            {index < mechanics.length - 1 && <div className="rule" />}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## File: src/pages/MyShift.css
```css
.day-track {
  display: flex;
  gap: 6px;
  margin-top: 14px;
}

.day-segment {
  flex: 1;
  height: 8px;
  border-radius: 2px;
  background: rgba(244, 237, 224, 0.22);
}

.day-segment.done {
  background: var(--cream);
}

.day-segment.current {
  background: var(--gold);
}

.stat-row {
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
}

.stat {
  flex: 1;
}

.stat-label {
  font-size: 11px;
  color: var(--cream-dim);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 26px;
  color: var(--cream);
  margin-top: 2px;
}

.gauge {
  display: flex;
  gap: 3px;
  margin-top: 9px;
}

.gauge span {
  flex: 1;
  height: 10px;
  border-radius: 2px;
  background: rgba(244, 237, 224, 0.14);
}

.gauge span.filled {
  background: var(--gold);
}

.objective-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 11px 0;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--cream-dim);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.checkbox.done {
  background: var(--gold);
  border-color: var(--gold);
  position: relative;
}

.checkbox.done::after {
  content: '';
  width: 9px;
  height: 5px;
  border-left: 2px solid var(--navy);
  border-bottom: 2px solid var(--navy);
  transform: rotate(-45deg) translateY(-1px);
}

.objective-label {
  flex: 1;
}

.objective-title {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--cream);
}

.objective-count {
  font-size: 12px;
  color: var(--cream-dim);
  margin-top: 2px;
}

.progressbar {
  height: 8px;
  border-radius: 5px;
  background: rgba(244, 237, 224, 0.14);
  overflow: hidden;
  margin-top: 7px;
}

.progressbar span {
  display: block;
  height: 100%;
  background: var(--gold);
}
```

## File: src/pages/MyShift.jsx
```javascript
import { currentShift } from '../data/mockData.js'
import './MyShift.css'

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

export default function MyShift() {
  const { day, totalDays, money, reputation, reputationMax, objectives } = currentShift

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">
          Día {day} de {totalDays}
        </p>
        <h1>Tu turno</h1>
        <div className="day-track">
          {Array.from({ length: totalDays }, (_, index) => {
            const dayNumber = index + 1
            let state = ''
            if (dayNumber < day) state = 'done'
            if (dayNumber === day) state = 'current'
            return <span key={dayNumber} className={`day-segment ${state}`} />
          })}
        </div>
      </header>

      <div className="page-content">
        <div className="stat-row">
          <div className="stat">
            <p className="stat-label">Dinero</p>
            <p className="stat-value">{currencyFormatter.format(money)}</p>
          </div>
          <div className="stat">
            <p className="stat-label">
              Reputación {reputation}/{reputationMax}
            </p>
            <div className="gauge">
              {Array.from({ length: reputationMax }, (_, index) => (
                <span key={index} className={index < reputation ? 'filled' : ''} />
              ))}
            </div>
          </div>
        </div>

        <div className="rule" />

        {objectives.map((objective, index) => {
          const done = objective.current >= objective.target
          const progress = Math.min(100, (objective.current / objective.target) * 100)

          return (
            <div key={objective.id}>
              <div className="objective-row">
                <span className={`checkbox ${done ? 'done' : ''}`} />
                <div className="objective-label">
                  <p className="objective-title">{objective.title}</p>
                  <p className="objective-count">
                    {objective.current} de {objective.target}
                  </p>
                  {!done && (
                    <div className="progressbar">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </div>
              </div>
              {index < objectives.length - 1 && <div className="rule" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

## File: src/pages/Welcome.css
```css
.welcome-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--navy);
}

.welcome-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  flex-shrink: 0;
  overflow: hidden;
}

.welcome-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.welcome-image-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(14, 28, 51, 0) 55%, var(--navy) 100%);
}

.welcome-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 28px calc(env(safe-area-inset-bottom, 0px) + 32px);
  margin-top: -18px;
}

.welcome-badge {
  font-family: var(--font-display);
  font-size: 14px;
  letter-spacing: 2px;
  background: var(--gold);
  color: var(--navy);
  padding: 5px 16px;
  border-radius: 3px;
  text-transform: uppercase;
}

.welcome-title {
  font-size: 52px;
  line-height: 0.92;
  margin: 18px 0 2px;
  text-transform: uppercase;
  color: var(--cream);
}

.welcome-subtitle {
  font-size: 24px;
  letter-spacing: 6px;
  color: var(--rosso);
  text-transform: uppercase;
}

.welcome-tagline {
  max-width: 300px;
  margin: 22px 0 28px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--cream-dim);
}

.welcome-cta {
  background: var(--rosso);
  color: var(--cream);
  font-family: var(--font-display);
  font-size: 19px;
  letter-spacing: 0.5px;
  padding: 14px 48px;
  border-radius: 26px;
}

.welcome-footnote {
  margin-top: auto;
  padding-top: 28px;
  font-size: 12px;
  color: rgba(244, 237, 224, 0.45);
}
```

## File: src/pages/Welcome.jsx
```javascript
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
        <p className="welcome-footnote">Versión 0.1 - App complementaria de Turno Rosso</p>
      </div>
    </div>
  )
}
```

## File: src/App.jsx
```javascript
import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import Welcome from './pages/Welcome.jsx'
import Home from './pages/Home.jsx'
import Mechanics from './pages/Mechanics.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import MyShift from './pages/MyShift.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      <Route element={<AppLayout />}>
        <Route path="/inicio" element={<Home />} />
        <Route path="/mecanicas" element={<Mechanics />} />
        <Route path="/marcador" element={<Leaderboard />} />
        <Route path="/turno" element={<MyShift />} />
      </Route>
    </Routes>
  )
}
```

## File: src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --navy: #0E1C33;
  --navy-soft: #16284A;
  --rosso: #C23B33;
  --rosso-dark: #9C2E27;
  --gold: #F2B134;
  --cream: #F4EDE0;
  --cream-dim: rgba(244, 237, 224, 0.68);
  --line: rgba(244, 237, 224, 0.14);
  --line-dark: rgba(14, 28, 51, 0.12);

  --font-display: 'Bebas Neue', 'Arial Narrow', sans-serif;
  --font-body: 'Inter', 'Segoe UI', Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
}

body {
  margin: 0;
  background: var(--navy);
  color: var(--cream);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-display);
  letter-spacing: 0.5px;
  margin: 0;
}

p {
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: var(--font-body);
  border: none;
  cursor: pointer;
}

.app-shell {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--navy);
  display: flex;
  flex-direction: column;
  position: relative;
}

.page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-header {
  background: var(--rosso);
  color: var(--cream);
  padding: calc(env(safe-area-inset-top, 0px) + 20px) 24px 22px;
  flex-shrink: 0;
}

.page-header .eyebrow {
  font-size: 13px;
  color: var(--cream-dim);
  margin-bottom: 2px;
}

.page-header h1 {
  font-size: 30px;
  text-transform: uppercase;
}

.page-content {
  flex: 1;
  padding: 20px 24px 24px;
  overflow-y: auto;
}

.rule {
  height: 1px;
  background: var(--line-dark);
  margin: 14px 0;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  background: var(--gold);
  color: var(--navy);
  font-family: var(--font-display);
  font-size: 15px;
  padding: 3px 10px 3px 16px;
  border-radius: 3px 9px 9px 3px;
  position: relative;
  min-width: 26px;
  justify-content: center;
}

.tag-chip::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--navy);
}
```

## File: src/main.jsx
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

## File: .gitignore
```
node_modules
dist
.DS_Store
*.local
```

## File: index.html
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Turno Rosso Wiki</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## File: package.json
```json
{
  "name": "turno-rosso-wiki",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.6"
  }
}
```

## File: vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## File: README.md
```markdown
dasdasdasdasdasad
```
