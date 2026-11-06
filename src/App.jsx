import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import Home from './pages/Home.jsx'
import Mechanics from './pages/Mechanics.jsx'
import Characters from './pages/Characters.jsx'
import Reports, { ReportReview } from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/mecanicas" element={<Mechanics />} />
        <Route path="/personajes" element={<Characters />} />
        <Route path="/reportes" element={<Reports />} />
        <Route path="/revision" element={<ReportReview />} />
        <Route path="/simulador" element={<Navigate to="/reportes" replace />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="/cuenta" element={<Navigate to="/ajustes" replace />} />
        <Route path="/marcador" element={<Navigate to="/reportes" replace />} />
        <Route path="/notas" element={<Navigate to="/reportes" replace />} />
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Route>
    </Routes>
  )
}
