import { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { AppHeader } from '../../components/layout/AppHeader.jsx';
import { Card } from '../../components/ui/Card';
import { useProject } from '../../context/ProjectContext.jsx';
import { api, getApiErrorMessage } from '../../services/api.js';
import { Pencil, Plus, Trash2, X } from 'lucide-react';

function formatAmount(amount) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount ?? 0));
}

const EMPTY_FORM = { title: '', target: '', current: '', unit: '', deadline: '' };

export default function PerformancePage() {
  const { currentProjectId } = useProject();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadData = useCallback(async () => {
    if (!currentProjectId) return;
    try {
      const response = await api.get(`/performance/project/${currentProjectId}`);
      setData(response.data);
      setError('');
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [currentProjectId]);

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, [loadData]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsDialogOpen(true);
  }

  function openEdit(goal) {
    setEditingId(goal.id);
    setForm({
      title: goal.title,
      target: String(goal.target),
      current: String(goal.current),
      unit: goal.unit ?? '',
      deadline: goal.deadline ? goal.deadline.slice(0, 10) : '',
    });
    setIsDialogOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!currentProjectId) return;
    const payload = {
      title: form.title.trim(),
      target: Number(form.target),
      current: form.current === '' ? 0 : Number(form.current),
      unit: form.unit.trim(),
      deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
    };

    try {
      if (editingId) {
        await api.patch(`/performance/goals/${editingId}`, {
          ...payload,
          unit: payload.unit || null,
          deadline: payload.deadline ?? null,
        });
      } else {
        await api.post('/performance/goals', {
          projectId: currentProjectId,
          ...payload,
          unit: payload.unit || undefined,
        });
      }
      setIsDialogOpen(false);
      await loadData();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    }
  }

  async function updateCurrent(goal, value) {
    const numeric = Number(value);
    if (value === '' || Number.isNaN(numeric) || numeric < 0 || numeric === goal.current) return;
    try {
      await api.patch(`/performance/goals/${goal.id}`, { current: numeric });
      await loadData();
    } catch (updateError) {
      setError(getApiErrorMessage(updateError));
    }
  }

  async function handleDelete(goal) {
    if (!window.confirm(`Supprimer l'objectif « ${goal.title} » ?`)) return;
    try {
      await api.delete(`/performance/goals/${goal.id}`);
      await loadData();
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError));
    }
  }

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-light">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  const kpis = data?.kpis;
  const series = data?.series ?? [];
  const goals = data?.goals ?? [];
  const maxValue = Math.max(1, ...series.flatMap((item) => [item.revenus, item.depenses]));
  const hasActivity = series.some(
    (item) => item.revenus > 0 || item.depenses > 0 || item.tasksCreated > 0,
  );

  const kpiCards = kpis
    ? [
        {
          title: 'Tâches terminées',
          value: `${kpis.taskCompletionRate} %`,
          detail: `${kpis.openTasks} en cours`,
          color: 'text-primary',
        },
        {
          title: 'Budget utilisé',
          value: `${kpis.budgetUsedPercent} %`,
          detail: `${formatAmount(kpis.totalDepenses)} FCFA dépensés`,
          color: kpis.budgetUsedPercent >= 80 ? 'text-danger' : 'text-primary',
        },
        {
          title: 'Résultat net',
          value: `${kpis.net >= 0 ? '+' : '−'} ${formatAmount(Math.abs(kpis.net))}`,
          detail: `${formatAmount(kpis.totalRevenus)} FCFA de revenus`,
          color: kpis.net >= 0 ? 'text-success' : 'text-danger',
        },
        {
          title: 'Tâches en retard',
          value: String(kpis.overdueTasks),
          detail: kpis.overdueTasks === 0 ? 'Rien en retard' : 'À traiter en priorité',
          color: kpis.overdueTasks === 0 ? 'text-success' : 'text-warning',
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-bg-light flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
        <AppSidebar activePage="performance" />

        <main className="flex-1 min-w-0 space-y-6">
          <AppHeader />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                PERFORMANCE
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Les chiffres qui racontent vraiment ta progression.
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                Calculés automatiquement depuis tes tâches et tes opérations financières.
              </p>
            </div>
            <button
              className="flex items-center gap-2 self-start rounded-full bg-warning px-5 py-2.5 font-bold text-black shadow-sm transition-colors hover:bg-warning-hover"
              onClick={openCreate}
              type="button"
            >
              <Plus size={18} strokeWidth={2.5} /> Nouvel objectif
            </button>
          </div>

          {error && (
            <p aria-live="polite" className="text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi) => (
              <div
                key={kpi.title}
                className="space-y-1 rounded-2xl border border-gray-200/60 bg-white/60 p-5"
              >
                <p className="text-xs font-medium text-gray-500">{kpi.title}</p>
                <p className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-[11px] font-medium text-gray-400">{kpi.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-extrabold text-sm text-gray-900">
                  Revenus et dépenses · 6 mois
                </h3>
                <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-success"></span>Revenus
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-danger"></span>Dépenses
                  </span>
                </div>
              </div>

              {hasActivity ? (
                <>
                  <div
                    aria-label={`Revenus et dépenses sur les 6 derniers mois, maximum ${formatAmount(maxValue)} FCFA`}
                    className="flex h-52 items-end justify-between gap-2 border-b border-gray-200 px-1 sm:gap-4"
                    role="img"
                  >
                    {series.map((item) => (
                      <div
                        key={item.month}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                      >
                        <div className="flex h-full w-full items-end justify-center gap-1">
                          <div
                            className="w-full max-w-[22px] rounded-t-md bg-success"
                            style={{
                              height: `${(item.revenus / maxValue) * 100}%`,
                              minHeight: item.revenus > 0 ? 3 : 0,
                            }}
                            title={`Revenus ${item.label} : ${formatAmount(item.revenus)} FCFA`}
                          ></div>
                          <div
                            className="w-full max-w-[22px] rounded-t-md bg-danger"
                            style={{
                              height: `${(item.depenses / maxValue) * 100}%`,
                              minHeight: item.depenses > 0 ? 3 : 0,
                            }}
                            title={`Dépenses ${item.label} : ${formatAmount(item.depenses)} FCFA`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between gap-2 px-1 sm:gap-4">
                    {series.map((item) => (
                      <span
                        key={item.month}
                        className="flex-1 text-center text-xs font-medium text-gray-400"
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                  <table className="sr-only">
                    <caption>Revenus et dépenses par mois (FCFA)</caption>
                    <thead>
                      <tr>
                        <th>Mois</th>
                        <th>Revenus</th>
                        <th>Dépenses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {series.map((item) => (
                        <tr key={item.month}>
                          <td>{item.label}</td>
                          <td>{item.revenus}</td>
                          <td>{item.depenses}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p className="py-10 text-center text-xs text-gray-400">
                  Ajoute une opération ou une tâche pour voir ta progression.
                </p>
              )}
            </Card>

            <Card className="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-5">
              <h3 className="font-extrabold text-sm text-gray-900">Objectifs</h3>

              {goals.length === 0 ? (
                <p className="text-xs text-gray-400">
                  Aucun objectif pour l'instant. Fixe-toi un cap mesurable, par exemple « 100
                  commandes ».
                </p>
              ) : (
                <ul className="space-y-5">
                  {goals.map((goal) => (
                    <li key={goal.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-gray-900">{goal.title}</p>
                          {goal.deadline && (
                            <p className="text-[10px] text-gray-400">
                              Avant le {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-shrink-0 gap-1">
                          <button
                            aria-label={`Modifier ${goal.title}`}
                            className="rounded-full p-1.5 text-gray-400 hover:bg-bg-light hover:text-gray-900"
                            onClick={() => openEdit(goal)}
                            type="button"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            aria-label={`Supprimer ${goal.title}`}
                            className="rounded-full p-1.5 text-gray-400 hover:bg-bg-light hover:text-danger"
                            onClick={() => handleDelete(goal)}
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div
                        aria-valuemax={100}
                        aria-valuemin={0}
                        aria-valuenow={goal.progress}
                        aria-label={`Progression de ${goal.title}`}
                        className="h-2 w-full rounded-full bg-bg-light"
                        role="progressbar"
                      >
                        <div
                          className={`h-2 rounded-full transition-all ${goal.progress >= 100 ? 'bg-success' : 'bg-accent'}`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[11px] text-gray-500">
                        <label className="flex items-center gap-1.5">
                          <span className="sr-only">Valeur actuelle de {goal.title}</span>
                          <input
                            className="h-7 w-20 rounded-lg border border-gray-200 bg-bg-light px-2 text-xs font-semibold text-gray-900 outline-none focus:border-primary"
                            defaultValue={goal.current}
                            key={`${goal.id}-${goal.current}`}
                            min="0"
                            onBlur={(event) => updateCurrent(goal, event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') event.currentTarget.blur();
                            }}
                            step="any"
                            type="number"
                          />
                          <span>
                            / {formatAmount(goal.target)} {goal.unit ?? ''}
                          </span>
                        </label>
                        <span className="font-bold text-gray-700">{goal.progress} %</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-[1px]" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl focus:outline-none sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="text-lg font-extrabold text-gray-900">
                      {editingId ? "Modifier l'objectif" : 'Nouvel objectif'}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-gray-600">
                      Un objectif mesurable, avec une cible chiffrée.
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
                    <span className="text-sm font-semibold text-gray-800">Intitulé</span>
                    <input
                      autoFocus
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      maxLength={120}
                      onChange={(event) => updateField('title', event.target.value)}
                      placeholder="Ex. 100 commandes ce mois-ci"
                      required
                      value={form.title}
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Cible</span>
                      <input
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        min="0"
                        onChange={(event) => updateField('target', event.target.value)}
                        required
                        step="any"
                        type="number"
                        value={form.target}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Actuel</span>
                      <input
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        min="0"
                        onChange={(event) => updateField('current', event.target.value)}
                        placeholder="0"
                        step="any"
                        type="number"
                        value={form.current}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Unité</span>
                      <input
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        maxLength={20}
                        onChange={(event) => updateField('unit', event.target.value)}
                        placeholder="FCFA, %…"
                        value={form.unit}
                      />
                    </label>
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold text-gray-800">
                      Échéance (optionnel)
                    </span>
                    <input
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      onChange={(event) => updateField('deadline', event.target.value)}
                      type="date"
                      value={form.deadline}
                    />
                  </label>

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
                      className="rounded-lg bg-warning px-4 py-2.5 text-sm font-bold text-gray-900 hover:bg-warning-hover"
                      type="submit"
                    >
                      {editingId ? 'Enregistrer' : "Ajouter l'objectif"}
                    </button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </main>
      </div>
    </div>
  );
}
