import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const ProjectContext = createContext(null);

const CURRENT_PROJECT_KEY = 'nexus_current_project';

export function ProjectProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(
    () => window.localStorage.getItem(CURRENT_PROJECT_KEY) || null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    const response = await api.get('/projects');
    const list = response.data;

    setProjects(list);
    setCurrentProjectId((previousId) => {
      if (previousId && list.some((project) => project.id === previousId)) {
        return previousId;
      }
      return list[0]?.id ?? null;
    });

    return list;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setProjects([]);
      setCurrentProjectId(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    refreshProjects().finally(() => setIsLoading(false));
  }, [isAuthenticated, refreshProjects]);

  useEffect(() => {
    if (currentProjectId) {
      window.localStorage.setItem(CURRENT_PROJECT_KEY, currentProjectId);
    } else {
      window.localStorage.removeItem(CURRENT_PROJECT_KEY);
    }
  }, [currentProjectId]);

  const currentProject = projects.find((project) => project.id === currentProjectId) ?? null;

  const value = {
    projects,
    currentProject,
    currentProjectId,
    setCurrentProjectId,
    isLoading,
    hasProjects: projects.length > 0,
    refreshProjects,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProject doit être utilisé à l’intérieur de ProjectProvider.');
  }

  return context;
}
