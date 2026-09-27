import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { HomePage } from './pages/home/HomePage.jsx'
import { DashboardPage } from './pages/project/DashboardPage.jsx'
import { ProjectPage } from './pages/project/ProjectPage.jsx'
import { OrganizationPage } from './pages/project/OrganizationPage.jsx'
import { FinancePage } from './pages/project/FinancePage.jsx'

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
        <Route path="/register" element={<RegisterPage />} />
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
        <Route
          path="/organization"
          element={
            <RequireAuth>
              <OrganizationPage />
            </RequireAuth>
          }
        />
        <Route
          path="/finance"
          element={
            <RequireAuth>
              <FinancePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}