import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { Card } from '../../components/ui/Card';
import { useProject } from '../../context/ProjectContext.jsx';
import { api, getApiErrorMessage } from '../../services/api.js';
import { Plus, Calendar, Check, X } from 'lucide-react';

const FILTER_BY_PARAM = { todo: 'À faire', done: 'Terminé' };
const PARAM_BY_FILTER = { 'À faire': 'todo', Terminé: 'done' };

function initialsOf(name) {
  return (name ?? '?')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function isOverdue(task) {
  return task.status === 'A_FAIRE' && task.dueDate && new Date(task.dueDate) < new Date();
}

export function OrganizationPage() {
  const { currentProjectId } = useProject();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = FILTER_BY_PARAM[searchParams.get('filter')] || 'Toutes';

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [members, setMembers] = useState([]);

  const loadTasks = useCallback(async () => {
    if (!currentProjectId) return;
    try {
      const [tasksResponse, teamResponse] = await Promise.all([
        api.get(`/tasks/project/${currentProjectId}`),
        api.get(`/team/project/${currentProjectId}`),
      ]);
      setTasks(tasksResponse.data);
      setMembers(teamResponse.data.members);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [currentProjectId]);

  useEffect(() => {
    setIsLoading(true);
    loadTasks();
  }, [loadTasks]);

  function setFilter(nextFilter) {
    const nextParam = PARAM_BY_FILTER[nextFilter];
    setSearchParams(nextParam ? { filter: nextParam } : {}, { replace: true });
  }

  async function handleTaskSubmit(event) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title || !currentProjectId) return;

    try {
      await api.post('/tasks', {
        projectId: currentProjectId,
        title,
        dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : undefined,
        assigneeId: taskAssigneeId || undefined,
      });
      setTaskTitle('');
      setTaskDueDate('');
      setTaskAssigneeId('');
      setIsTaskDialogOpen(false);
      await loadTasks();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    }
  }

  async function toggleStatus(task) {
    const nextStatus = task.status === 'FAIT' ? 'A_FAIRE' : 'FAIT';
    try {
      await api.patch(`/tasks/${task.id}/status`, { status: nextStatus });
      await loadTasks();
    } catch (toggleError) {
      setError(getApiErrorMessage(toggleError));
    }
  }

  async function assignTask(task, assigneeId) {
    try {
      await api.patch(`/tasks/${task.id}/assignee`, { assigneeId: assigneeId || null });
      await loadTasks();
    } catch (assignError) {
      setError(getApiErrorMessage(assignError));
    }
  }

  const todoTasks = tasks.filter((task) => task.status === 'A_FAIRE');
  const doneTasks = tasks.filter((task) => task.status === 'FAIT');

  function TaskCard({ task }) {
    return (
      <div className="space-y-3 rounded-2xl bg-bg-light p-4">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-xs font-bold leading-snug ${task.status === 'FAIT' ? 'text-gray-400 line-through' : 'text-gray-900'}`}
          >
            {task.title}
          </p>
          <button
            aria-label={task.status === 'FAIT' ? 'Remettre à faire' : 'Marquer comme fait'}
            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
              task.status === 'FAIT'
                ? 'border-success bg-success text-white'
                : 'border-gray-300 text-transparent hover:border-primary'
            }`}
            onClick={() => toggleStatus(task)}
            type="button"
          >
            <Check size={12} strokeWidth={3} />
          </button>
        </div>
        {task.dueDate && (
          <div
            className={`flex items-center gap-1.5 text-[10px] font-medium ${isOverdue(task) ? 'text-danger' : 'text-gray-400'}`}
          >
            <Calendar size={12} />
            <span>
              {isOverdue(task) ? 'En retard · ' : ''}
              {new Date(task.dueDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}
        {members.length > 0 && (
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                task.assignee ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              {task.assignee ? initialsOf(task.assignee.name) : '–'}
            </span>
            <select
              aria-label={`Assigner « ${task.title} »`}
              className="min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-600"
              onChange={(event) => assignTask(task, event.target.value)}
              value={task.assigneeId ?? ''}
            >
              <option value="">Non assignée</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
        <AppSidebar activePage="organization" />

        <main className="flex-1 space-y-6 overflow-y-auto">
          <header className="flex items-center justify-end gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-gray-200/80 text-xs text-gray-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              Connecté
            </div>
          </header>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                ORGANISATION
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                La semaine reste simple quand chacun voit l'essentiel.
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                Planifie tes tâches et avance sans perdre de vue les échéances.
              </p>
            </div>
            <Dialog.Root open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <Dialog.Trigger asChild>
                <button
                  className="flex items-center gap-2 self-start rounded-full bg-warning px-5 py-2.5 font-bold text-black shadow-sm transition-colors hover:bg-warning-hover"
                  type="button"
                >
                  <Plus size={18} strokeWidth={2.5} /> Nouvelle tâche
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-[1px]" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl focus:outline-none sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="text-lg font-extrabold text-gray-900">
                        Nouvelle tâche
                      </Dialog.Title>
                      <Dialog.Description className="mt-1 text-sm text-gray-600">
                        Ajoute une priorité à la liste « À faire ».
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        aria-label="Fermer"
                        className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        type="button"
                      >
                        <X aria-hidden="true" size={18} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <form className="mt-6 space-y-4" onSubmit={handleTaskSubmit}>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Intitulé</span>
                      <input
                        autoFocus
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        maxLength={120}
                        onChange={(event) => setTaskTitle(event.target.value)}
                        placeholder="Ex. Préparer la campagne de lancement"
                        required
                        value={taskTitle}
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Échéance</span>
                      <input
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        onChange={(event) => setTaskDueDate(event.target.value)}
                        type="date"
                        value={taskDueDate}
                      />
                    </label>

                    {members.length > 0 && (
                      <label className="block space-y-1.5">
                        <span className="text-sm font-semibold text-gray-800">
                          Assignée à (optionnel)
                        </span>
                        <select
                          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          onChange={(event) => setTaskAssigneeId(event.target.value)}
                          value={taskAssigneeId}
                        >
                          <option value="">Non assignée</option>
                          {members.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                      <Dialog.Close asChild>
                        <button
                          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                          type="button"
                        >
                          Annuler
                        </button>
                      </Dialog.Close>
                      <button
                        className="rounded-lg bg-warning px-4 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-warning-hover"
                        type="submit"
                      >
                        Ajouter la tâche
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          {error && (
            <p aria-live="polite" className="text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {['Toutes', 'À faire', 'Terminé'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === tab
                    ? 'bg-dark text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white border border-gray-200/60'
                }`}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="text-xs text-gray-400">Chargement...</p>
          ) : (
            <div
              className={`grid grid-cols-1 gap-6 pt-2 ${filter === 'Toutes' ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}
            >
              {(filter === 'Toutes' || filter === 'À faire') && (
                <Card className="p-5 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-1">
                    <h3 className="font-extrabold text-sm text-gray-900">À faire</h3>
                    <span className="w-5 h-5 rounded-full bg-bg-light text-gray-500 text-xs font-bold flex items-center justify-center">
                      {todoTasks.length}
                    </span>
                  </div>
                  {todoTasks.length === 0 && (
                    <p className="text-xs text-gray-400">Aucune tâche en attente.</p>
                  )}
                  {todoTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </Card>
              )}

              {(filter === 'Toutes' || filter === 'Terminé') && (
                <Card className="p-5 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-1">
                    <h3 className="font-extrabold text-sm text-gray-900">Terminé</h3>
                    <span className="w-5 h-5 rounded-full bg-bg-light text-gray-500 text-xs font-bold flex items-center justify-center">
                      {doneTasks.length}
                    </span>
                  </div>
                  {doneTasks.length === 0 && (
                    <p className="text-xs text-gray-400">Rien de terminé pour l'instant.</p>
                  )}
                  {doneTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
