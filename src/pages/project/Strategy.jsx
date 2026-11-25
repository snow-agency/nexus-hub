import { useCallback, useEffect, useState } from 'react';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { AppHeader } from '../../components/layout/AppHeader.jsx';
import { Card } from '../../components/ui/Card';
import { useProject } from '../../context/ProjectContext.jsx';
import { api, getApiErrorMessage } from '../../services/api.js';
import { BMC_LABELS } from '../../components/bmc/bmcLabels.js';
import { Search, Target, CheckCircle2, Circle, Download, Plus, Trash2, Check } from 'lucide-react';

function buildBusinessPlanMarkdown({ project, strategy, bmc }) {
  const lines = [`# Business plan — ${project?.name ?? 'Projet'}`, ''];
  if (project) {
    lines.push(`**Secteur :** ${project.sector} · **Pays :** ${project.country}`);
    if (project.objective) lines.push(`**Objectif :** ${project.objective}`);
    lines.push('');
  }

  lines.push('## Positionnement', '');
  if (strategy.positionnement) {
    lines.push(`> ${strategy.positionnement.title}`, '');
    if (strategy.positionnement.content) lines.push(strategy.positionnement.content, '');
  } else {
    lines.push('_Non renseigné._', '');
  }

  lines.push(`## Étude de marché (${strategy.progressMarche} %)`, '');
  if (strategy.etapes.length === 0) lines.push('_Aucune étape._');
  for (const etape of strategy.etapes) lines.push(`- [${etape.done ? 'x' : ' '}] ${etape.title}`);
  lines.push('');

  lines.push('## Plan d’affaires', '');
  if (strategy.sections.length === 0) lines.push('_Aucune section._', '');
  for (const section of strategy.sections) {
    lines.push(`### ${section.title} (${section.progress} %)`, '');
    if (section.content) lines.push(section.content, '');
  }

  lines.push('## Business Model Canvas', '');
  for (const block of bmc) {
    lines.push(`### ${BMC_LABELS[block.block]}`, '', block.content || '_À compléter._', '');
  }

  return lines.join('\n');
}

export default function StrategyPage() {
  const { currentProjectId, currentProject } = useProject();

  const [strategy, setStrategy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [newStep, setNewStep] = useState('');
  const [newSection, setNewSection] = useState('');
  const [promise, setPromise] = useState('');
  const [description, setDescription] = useState('');
  const [positioningSaved, setPositioningSaved] = useState(true);

  const load = useCallback(async () => {
    if (!currentProjectId) return;
    try {
      const response = await api.get(`/strategy/project/${currentProjectId}`);
      setStrategy(response.data);
      setPromise(response.data.positionnement?.title ?? '');
      setDescription(response.data.positionnement?.content ?? '');
      setPositioningSaved(true);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [currentProjectId]);

  useEffect(() => {
    setIsLoading(true);
    load();
  }, [load]);

  async function run(action) {
    setError('');
    try {
      await action();
      await load();
    } catch (actionError) {
      setError(getApiErrorMessage(actionError));
    }
  }

  function addItem(kind, title, reset) {
    const trimmed = title.trim();
    if (!trimmed) return;
    run(async () => {
      await api.post('/strategy', { projectId: currentProjectId, kind, title: trimmed });
      reset('');
    });
  }

  function savePositioning(event) {
    event.preventDefault();
    if (promise.trim().length < 2) {
      setError('La promesse doit contenir au moins 2 caractères.');
      return;
    }
    run(() =>
      api.post('/strategy', {
        projectId: currentProjectId,
        kind: 'POSITIONNEMENT',
        title: promise.trim(),
        content: description.trim() || undefined,
      }),
    );
  }

  async function handleExport() {
    setError('');
    try {
      const response = await api.get(`/bmc/project/${currentProjectId}`);
      const markdown = buildBusinessPlanMarkdown({
        project: currentProject,
        strategy,
        bmc: response.data.blocks,
      });
      const url = URL.createObjectURL(
        new Blob([markdown], { type: 'text/markdown;charset=utf-8' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = `business-plan-${(currentProject?.name ?? 'projet').toLowerCase().replace(/\s+/g, '-')}.md`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(getApiErrorMessage(exportError));
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-light">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  const etapes = strategy?.etapes ?? [];
  const sections = strategy?.sections ?? [];

  return (
    <div className="min-h-screen bg-bg-light flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
        <AppSidebar activePage="strategy" />

        <main className="flex-1 min-w-0 space-y-6">
          <AppHeader />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Stratégie
              </p>
              <h1 className="text-3xl font-extrabold text-dark leading-tight">
                Transforme ton intuition en décisions solides.
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Une méthode guidée pour comprendre le marché, affiner ton positionnement et bâtir un
                plan crédible.
              </p>
            </div>
            <button
              className="flex items-center gap-2 self-start px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-dark shadow-sm hover:bg-gray-50 transition-colors"
              onClick={handleExport}
              type="button"
            >
              <Download size={15} />
              Exporter le business plan
            </button>
          </div>

          {error && (
            <p aria-live="polite" className="text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-warning/20 text-warning rounded-xl">
                  <Search size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-dark">Étude de marché</h3>
                  <p className="text-xs text-gray-400">
                    Progression · {strategy?.progressMarche ?? 0} %
                  </p>
                </div>
              </div>

              <div className="w-full bg-bg-light rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${strategy?.progressMarche ?? 0}%` }}
                ></div>
              </div>

              <div className="space-y-2.5">
                {etapes.length === 0 && (
                  <p className="text-xs text-gray-400">
                    Aucune étape pour l'instant. Ajoute ta première étape ci-dessous.
                  </p>
                )}
                {etapes.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 px-4 py-3 bg-bg-light rounded-2xl"
                  >
                    <button
                      aria-label={step.done ? 'Marquer comme non fait' : 'Marquer comme fait'}
                      onClick={() =>
                        run(() => api.patch(`/strategy/${step.id}`, { done: !step.done }))
                      }
                      type="button"
                    >
                      {step.done ? (
                        <CheckCircle2 size={18} className="text-success" />
                      ) : (
                        <Circle size={18} className="text-gray-300 hover:text-primary" />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-xs font-medium ${step.done ? 'text-gray-400 line-through' : 'text-dark'}`}
                    >
                      {step.title}
                    </span>
                    <button
                      aria-label="Supprimer l'étape"
                      className="text-gray-300 hover:text-danger"
                      onClick={() => run(() => api.delete(`/strategy/${step.id}`))}
                      type="button"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  addItem('ETAPE_MARCHE', newStep, setNewStep);
                }}
              >
                <input
                  className="h-10 flex-1 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  maxLength={200}
                  onChange={(event) => setNewStep(event.target.value)}
                  placeholder="Ex. Réaliser 15 entretiens clients"
                  value={newStep}
                />
                <button
                  aria-label="Ajouter l'étape"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-dark hover:bg-accent-hover"
                  type="submit"
                >
                  <Plus size={16} />
                </button>
              </form>
            </Card>

            <Card className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-sm">
              <form className="space-y-4" onSubmit={savePositioning}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-success/10 text-success rounded-xl">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-dark">Positionnement</h3>
                    <p className="text-xs text-gray-400">
                      {strategy?.positionnement ? 'Promesse définie' : 'À définir'}
                    </p>
                  </div>
                </div>

                <label className="block space-y-1.5">
                  <span className="text-[11px] font-medium text-gray-400">Ta promesse</span>
                  <input
                    className="w-full rounded-2xl bg-bg-light px-4 py-3 text-sm font-bold text-dark outline-none focus:ring-2 focus:ring-primary"
                    maxLength={200}
                    onChange={(event) => {
                      setPromise(event.target.value);
                      setPositioningSaved(false);
                    }}
                    placeholder="Ex. Le goût de la maison, livré avant que la faim ne gagne."
                    value={promise}
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-[11px] font-medium text-gray-400">
                    Ce qui te différencie
                  </span>
                  <textarea
                    className="min-h-[110px] w-full rounded-2xl bg-bg-light px-4 py-3 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-primary"
                    maxLength={2000}
                    onChange={(event) => {
                      setDescription(event.target.value);
                      setPositioningSaved(false);
                    }}
                    placeholder="Face à la concurrence, tu te distingues par..."
                    value={description}
                  />
                </label>

                <button
                  className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-semibold text-dark transition-colors hover:bg-accent-hover"
                  type="submit"
                >
                  {positioningSaved && strategy?.positionnement ? <Check size={14} /> : null}
                  {positioningSaved && strategy?.positionnement ? 'Enregistré' : 'Enregistrer'}
                </button>
              </form>
            </Card>
          </div>

          <Card className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Plan d'affaires
            </p>

            {sections.length === 0 && (
              <p className="text-xs text-gray-400">
                Aucune section. Ajoute par exemple « Résumé exécutif », « Marché » ou « Opérations
                ».
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sections.map((section, index) => (
                <div key={section.id} className="bg-bg-light p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <button
                      aria-label="Supprimer la section"
                      className="text-gray-300 hover:text-danger"
                      onClick={() => run(() => api.delete(`/strategy/${section.id}`))}
                      type="button"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-dark">{section.title}</h4>
                  <label className="block space-y-1">
                    <span className="flex justify-between text-[11px] font-semibold text-gray-500">
                      Avancement <span>{section.progress} %</span>
                    </span>
                    <input
                      aria-label={`Avancement de ${section.title}`}
                      className="w-full accent-primary"
                      defaultValue={section.progress}
                      key={`${section.id}-${section.progress}`}
                      max={100}
                      min={0}
                      onPointerUp={(event) => {
                        const value = Number(event.currentTarget.value);
                        if (value !== section.progress) {
                          run(() => api.patch(`/strategy/${section.id}`, { progress: value }));
                        }
                      }}
                      onKeyUp={(event) => {
                        const value = Number(event.currentTarget.value);
                        if (value !== section.progress) {
                          run(() => api.patch(`/strategy/${section.id}`, { progress: value }));
                        }
                      }}
                      step={5}
                      type="range"
                    />
                  </label>
                  <textarea
                    aria-label={`Notes de ${section.title}`}
                    className="min-h-[60px] w-full rounded-xl bg-white p-2 text-[11px] text-gray-600 outline-none focus:ring-2 focus:ring-primary"
                    defaultValue={section.content ?? ''}
                    maxLength={2000}
                    onBlur={(event) => {
                      if (event.target.value !== (section.content ?? '')) {
                        run(() =>
                          api.patch(`/strategy/${section.id}`, { content: event.target.value }),
                        );
                      }
                    }}
                    placeholder="Notes (optionnel)"
                  />
                </div>
              ))}
            </div>

            <form
              className="flex gap-2 max-w-md"
              onSubmit={(event) => {
                event.preventDefault();
                addItem('SECTION_PLAN', newSection, setNewSection);
              }}
            >
              <input
                className="h-10 flex-1 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                maxLength={200}
                onChange={(event) => setNewSection(event.target.value)}
                placeholder="Nouvelle section (ex. Prévisions)"
                value={newSection}
              />
              <button
                aria-label="Ajouter la section"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-dark hover:bg-accent-hover"
                type="submit"
              >
                <Plus size={16} />
              </button>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
}
