import { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { AppHeader } from '../../components/layout/AppHeader.jsx';
import { Card } from '../../components/ui/Card';
import { useProject } from '../../context/ProjectContext.jsx';
import { api, getApiErrorMessage } from '../../services/api.js';
import { Pencil, Plus, Trash2, Users, X } from 'lucide-react';

function initialsOf(name) {
  return (name ?? '?')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const emptyForm = { name: '', role: '', email: '' };

export default function TeamPage() {
  const { currentProjectId } = useProject();

  const [members, setMembers] = useState([]);
  const [unassignedOpenTasks, setUnassignedOpenTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const loadTeam = useCallback(async () => {
    if (!currentProjectId) return;
    try {
      const response = await api.get(`/team/project/${currentProjectId}`);
      setMembers(response.data.members);
      setUnassignedOpenTasks(response.data.unassignedOpenTasks);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [currentProjectId]);

  useEffect(() => {
    setIsLoading(true);
    loadTeam();
  }, [loadTeam]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setIsDialogOpen(true);
  }

  function openEdit(member) {
    setEditingId(member.id);
    setForm({ name: member.name, role: member.role, email: member.email ?? '' });
    setFormError('');
    setIsDialogOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
    };
    const email = form.email.trim();

    try {
      if (editingId) {
        await api.patch(`/team/${editingId}`, { ...payload, email: email || null });
      } else {
        await api.post('/team', {
          projectId: currentProjectId,
          ...payload,
          ...(email ? { email } : {}),
        });
      }
      setIsDialogOpen(false);
      await loadTeam();
    } catch (submitError) {
      setFormError(getApiErrorMessage(submitError));
    }
  }

  async function handleDelete(member) {
    if (
      !window.confirm(`Retirer ${member.name} de l'équipe ? Ses tâches deviendront non assignées.`)
    ) {
      return;
    }
    try {
      await api.delete(`/team/${member.id}`);
      await loadTeam();
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError));
    }
  }

  const inputClass =
    'h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10';

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-light">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
        <AppSidebar activePage="team" />

        <main className="flex-1 min-w-0 space-y-6">
          <AppHeader />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">ÉQUIPE</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Les bons talents, alignés sur le même cap.
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                Clarifie les rôles, répartis la charge et garde les responsabilités visibles.
              </p>
            </div>
            <button
              className="flex items-center gap-2 self-start rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-dark shadow-sm transition-colors hover:bg-accent-hover"
              onClick={openCreate}
              type="button"
            >
              <Plus size={18} strokeWidth={2.5} /> Ajouter un membre
            </button>
          </div>

          {error && (
            <p aria-live="polite" className="text-xs font-medium text-danger">
              {error}
            </p>
          )}

          {members.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 rounded-3xl border border-gray-200/60 bg-white p-10 text-center shadow-sm">
              <Users className="text-gray-300" size={36} />
              <p className="text-sm font-bold text-gray-900">Aucun membre pour l'instant</p>
              <p className="max-w-sm text-xs text-gray-500">
                Ajoute les personnes qui travaillent sur ton projet pour leur assigner des tâches et
                suivre la charge de chacun.
              </p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {members.map((member) => (
                  <Card
                    className="flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/60 bg-white shadow-sm"
                    key={member.id}
                  >
                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                            {initialsOf(member.name)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-bold text-dark">
                              {member.name}
                            </h3>
                            <p className="truncate text-xs text-gray-400">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex flex-shrink-0 gap-1">
                          <button
                            aria-label={`Modifier ${member.name}`}
                            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-bg-light hover:text-dark"
                            onClick={() => openEdit(member)}
                            type="button"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            aria-label={`Retirer ${member.name}`}
                            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-bg-light hover:text-danger"
                            onClick={() => handleDelete(member)}
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {member.email && (
                        <p className="truncate text-xs text-gray-500">{member.email}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-bg-light px-5 py-4 text-xs">
                      <span className="text-gray-400">Charge active</span>
                      <span className="font-bold text-dark">
                        {member.openTasks} tâche{member.openTasks > 1 ? 's' : ''} ·{' '}
                        {member.doneTasks} terminée{member.doneTasks > 1 ? 's' : ''}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="space-y-5 rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-dark">Répartition de la charge</h3>
                  {unassignedOpenTasks > 0 && (
                    <span className="rounded-full bg-warning/20 px-3 py-1 text-[11px] font-bold text-warning">
                      {unassignedOpenTasks} tâche{unassignedOpenTasks > 1 ? 's' : ''} non assignée
                      {unassignedOpenTasks > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {members.map((member) => (
                    <div className="space-y-1.5" key={member.id}>
                      <div className="flex items-center justify-between text-xs">
                        <p className="text-gray-700">
                          <span className="font-bold text-dark">{member.name}</span> ·{' '}
                          {member.openTasks} tâche{member.openTasks > 1 ? 's' : ''} ouverte
                          {member.openTasks > 1 ? 's' : ''}
                        </p>
                        <span className="font-bold text-dark">{member.workloadPercent}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-bg-light">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            member.workloadPercent >= 80 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${member.workloadPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400">
                  La charge est relative au membre qui a le plus de tâches ouvertes.
                </p>
              </Card>
            </>
          )}
        </main>
      </div>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-[1px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl focus:outline-none sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-extrabold text-gray-900">
                  {editingId ? 'Modifier le membre' : 'Ajouter un membre'}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-gray-600">
                  Renseigne son nom et son rôle dans le projet.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  aria-label="Fermer"
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  type="button"
                >
                  <X aria-hidden="true" size={18} />
                </button>
              </Dialog.Close>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-gray-800">Nom</span>
                <input
                  autoFocus
                  className={inputClass}
                  maxLength={80}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Ex. Aminata Dossou"
                  required
                  value={form.name}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-gray-800">Rôle</span>
                <input
                  className={inputClass}
                  maxLength={80}
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                  placeholder="Ex. Marketing, Finance, Livraison"
                  required
                  value={form.role}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-gray-800">E-mail (optionnel)</span>
                <input
                  className={inputClass}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="aminata@exemple.com"
                  type="email"
                  value={form.email}
                />
              </label>

              {formError && (
                <p aria-live="polite" className="text-xs font-medium text-danger">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                <Dialog.Close asChild>
                  <button
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    type="button"
                  >
                    Annuler
                  </button>
                </Dialog.Close>
                <button
                  className="rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-dark hover:bg-accent-hover"
                  type="submit"
                >
                  {editingId ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
