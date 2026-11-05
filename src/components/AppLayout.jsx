import { Outlet } from 'react-router-dom'
import AppStatus from './AppStatus.jsx'
import BottomNav from './BottomNav.jsx'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <AppStatus />
      <Outlet />
      <BottomNav />
    </div>
  )
}
