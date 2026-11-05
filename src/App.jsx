import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import Welcome from './pages/Welcome.jsx'
import Home from './pages/Home.jsx'
import Mechanics from './pages/Mechanics.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Characters from './pages/Characters.jsx'
import Notes from './pages/Notes.jsx'
import Account from './pages/Account.jsx'
import Privacy from './pages/Privacy.jsx'
import { Navigate } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      <Route element={<AppLayout />}>
        <Route path="/inicio" element={<Home />} />
        <Route path="/mecanicas" element={<Mechanics />} />
        <Route path="/marcador" element={<Leaderboard />} />
         <Route path="/personajes" element={<Characters />} />
        <Route path="/notas" element={<Notes />} />
        <Route path="/cuenta" element={<Account />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Route>
    </Routes>
  )
}
