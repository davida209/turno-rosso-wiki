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
