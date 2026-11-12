import { Navigate, Outlet } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext.jsx';

export default function RequireProject() {
  const { isLoading, hasProjects } = useProject();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-light">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!hasProjects) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
