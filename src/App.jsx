import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import Welcome from './pages/Welcome.jsx'
import Home from './pages/Home.jsx'
import Mechanics from './pages/Mechanics.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Characters from './pages/Characters.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      <Route element={<AppLayout />}>
        <Route path="/inicio" element={<Home />} />
        <Route path="/mecanicas" element={<Mechanics />} />
        <Route path="/marcador" element={<Leaderboard />} />
         <Route path="/personajes" element={<Characters />} />
      </Route>
    </Routes>
  )
}
