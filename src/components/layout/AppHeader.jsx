import { useAuth } from '../../context/AuthContext.jsx';
import { useProject } from '../../context/ProjectContext.jsx';

export function AppHeader() {
  const { user } = useAuth();
  const { projects, currentProjectId, setCurrentProjectId } = useProject();

  const initials = (user?.name ?? '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex items-center justify-end gap-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-gray-600">
        <span className="h-2 w-2 rounded-full bg-success"></span>
        Connecté
      </div>
      {projects.length > 1 && (
        <select
          aria-label="Changer de projet"
          className="rounded-full border border-gray-200/80 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700"
          onChange={(event) => setCurrentProjectId(event.target.value)}
          value={currentProjectId ?? ''}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      )}
      <div
        aria-label={user?.name}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-dark text-[11px] font-bold text-white"
      >
        {initials}
      </div>
    </header>
  );
}
