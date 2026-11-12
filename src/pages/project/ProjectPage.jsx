import { useCallback, useEffect, useState } from 'react';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProject } from '../../context/ProjectContext.jsx';
import { api, getApiErrorMessage } from '../../services/api.js';
import { Check, Save, Sparkles } from 'lucide-react';

const PHASES = [
  { value: 'IDEE_VALIDATION', label: 'Idée validée' },
  { value: 'LANCEMENT', label: 'Lancement' },
  { value: 'CROISSANCE', label: 'Croissance' },
];

export function ProjectPage() {
  const { currentProjectId, refreshProjects } = useProject();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  const [budgetTotal, setBudgetTotal] = useState('');
  const [objective, setObjective] = useState('');
  const [phase, setPhase] = useState('IDEE_VALIDATION');

  const loadProject = useCallback(async () => {
    if (!currentProjectId) return;
    try {
      const response = await api.get(`/projects/${currentProjectId}`);
      setProject(response.data);
      setBudgetTotal(String(response.data.budgetTotal));
      setObjective(response.data.objective ?? '');
      setPhase(response.data.phase);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [currentProjectId]);

  useEffect(() => {
    setIsLoading(true);
    loadProject();
  }, [loadProject]);

  async function handleSave() {
    if (!currentProjectId) return;
    setError('');
    try {
      await api.patch(`/projects/${currentProjectId}`, {
        budgetTotal: Number(budgetTotal),
        objective: objective || undefined,
        phase,
      });
      setIsSaved(true);
      await loadProject();
      await refreshProjects();
    } catch (saveError) {
      setError(getApiErrorMessage(saveError));
    }
  }

  function markDirty(setter) {
    return (value) => {
      setIsSaved(false);
      setter(value);
    };
  }

  const currentPhaseIndex = PHASES.findIndex((item) => item.value === phase);

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
        <AppSidebar activePage="project" />

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
                MON PROJET
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {project?.name}
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                {project?.sector} · {project?.country}
              </p>
            </div>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-accent hover:bg-accent-hover text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 self-start shadow-sm"
            >
              {isSaved ? <Check size={16} strokeWidth={2.5} /> : <Save size={16} />}
              {isSaved ? 'Enregistré' : 'Enregistrer'}
            </Button>
          </div>

          {error && (
            <p aria-live="polite" className="text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            <Card className="lg:col-span-8 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-5">
              <h3 className="font-extrabold text-base text-gray-900">Carte d'identité</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 font-medium">Secteur</label>
                  <p className="w-full rounded-2xl bg-bg-light px-4 py-3 text-xs font-semibold text-gray-700">
                    {project?.sector}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 font-medium">Pays pilote</label>
                  <p className="w-full rounded-2xl bg-bg-light px-4 py-3 text-xs font-semibold text-gray-700">
                    {project?.country}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 font-medium" htmlFor="budgetTotal">
                    Budget global (FCFA)
                  </label>
                  <input
                    className="w-full bg-bg-light border-0 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-primary outline-none"
                    id="budgetTotal"
                    min="0"
                    onChange={(e) => markDirty(setBudgetTotal)(e.target.value)}
                    type="number"
                    value={budgetTotal}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 font-medium" htmlFor="objective">
                    Objectif
                  </label>
                  <input
                    className="w-full bg-bg-light border-0 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-primary outline-none"
                    id="objective"
                    maxLength={500}
                    onChange={(e) => markDirty(setObjective)(e.target.value)}
                    placeholder="Ex. 100 commandes / mois"
                    type="text"
                    value={objective}
                  />
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-4 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  PHASE DU PROJET
                </p>
                <p className="text-xs text-gray-500 leading-relaxed pt-1">
                  Mets à jour la phase quand ton projet avance.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {PHASES.map((item, index) => (
                  <button
                    key={item.value}
                    onClick={() => markDirty(setPhase)(item.value)}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                      item.value === phase ? 'bg-primary/10' : 'hover:bg-bg-light'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        index < currentPhaseIndex
                          ? 'bg-success text-white'
                          : index === currentPhaseIndex
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {index < currentPhaseIndex ? <Check size={14} strokeWidth={3} /> : index + 1}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        item.value === phase ? 'text-primary' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="text-accent-hover" size={18} />
              <h3 className="font-extrabold text-base text-gray-900">Business Model Canvas</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
              Bientôt disponible : tu pourras structurer ta proposition de valeur, tes segments
              clients, tes canaux et le reste de ton modèle économique directement ici.
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
}
