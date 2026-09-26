import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import { HomePage } from '../../../src/pages/home/HomePage.jsx'
import { DashboardPage } from '../../../src/pages/project/DashboardPage.jsx'
import { ProjectPage } from '../../../src/pages/project/ProjectPage.jsx'

const AUTH_STORAGE_KEY = 'nexusHubAuthenticated'

function RequireAuth({ children }) {
  const location = useLocation()
  const isAuthenticated =
    window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
    window.sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'

  return isAuthenticated ? children : <Navigate to="/auth" replace state={{ from: location }} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/project"
          element={
            <RequireAuth>
              <ProjectPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}