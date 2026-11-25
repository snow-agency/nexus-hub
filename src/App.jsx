import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProjectProvider } from './context/ProjectContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import RequireProject from './components/auth/RequireProject.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import { HomePage } from './pages/home/HomePage.jsx';
import OnboardingPage from './pages/onboarding/OnboardingPage.jsx';
import { DashboardPage } from './pages/project/DashboardPage.jsx';
import { ProjectPage } from './pages/project/ProjectPage.jsx';
import { OrganizationPage } from './pages/project/OrganizationPage.jsx';
import { FinancePage } from './pages/project/FinancePage.jsx';
import StrategyPage from './pages/project/Strategy.jsx';
import PerformancePage from './pages/project/PerformancePage.jsx';
import NetworkPage from './pages/project/NetworkPage.jsx';
import TeamPage from './pages/project/TeamPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <ChatProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/auth" element={<LoginPage />} />

              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<OnboardingPage />} />

                <Route element={<RequireProject />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/project" element={<ProjectPage />} />
                  <Route path="/organization" element={<OrganizationPage />} />
                  <Route path="/finance" element={<FinancePage />} />
                  <Route path="/strategy" element={<StrategyPage />} />
                  <Route path="/performance" element={<PerformancePage />} />
                  <Route path="/network" element={<NetworkPage />} />
                  <Route path="/team" element={<TeamPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}
