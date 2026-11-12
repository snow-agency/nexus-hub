import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProject } from '../../context/ProjectContext.jsx';
import { api, getApiErrorMessage } from '../../services/api.js';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Coins,
  Target,
  Users,
  TrendingUp,
  Globe,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

function formatAmount(amount) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount ?? 0));
}

const SIGNAL_LABELS = {
  BUDGET_DEPASSE: 'Budget dépassé',
  TACHE_RETARD: 'Tâche en retard',
};

const SEVERITY_DOT = {
  HAUTE: 'bg-danger',
  MOYENNE: 'bg-warning',
  BASSE: 'bg-success',
};

const spaces = [
  { label: "Vue d'ensemble", hint: 'ton cap', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Mon projet', hint: 'la vision', icon: Briefcase, to: '/project' },
  { label: 'Organisation', hint: 'les tâches', icon: Layers, to: '/organization' },
  { label: 'Finance', hint: 'en FCFA', icon: Coins, to: '/finance' },
  { label: 'Stratégie', hint: 'le plan', icon: Target, to: '/strategy' },
  { label: 'Équipe', hint: 'les talents', icon: Users, to: '/team' },
  { label: 'Performance', hint: 'les KPI', icon: TrendingUp, to: '/performance' },
  { label: 'Réseau', hint: 'les connexions', icon: Globe, to: '/network' },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentProjectId, projects, setCurrentProjectId } = useProject();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!currentProjectId) return;
    setError('');
    try {
      const response = await api.get(`/dashboard/${currentProjectId}`);
      setData(response.data);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [currentProjectId]);

  useEffect(() => {
    setIsLoading(true);
    loadDashboard();
  }, [loadDashboard]);

  async function handleMarkDone() {
    if (!data?.nextAction) return;
    setIsUpdating(true);
    try {
      await api.patch(`/next-action/${data.nextAction.id}/status`, { status: 'FAITE' });
      await loadDashboard();
    } catch (updateError) {
      setError(getApiErrorMessage(updateError));
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRefineWithAI() {
    if (!currentProjectId) return;
    setIsUpdating(true);
    try {
      await api.post(`/next-action/${currentProjectId}/generate`);
      await loadDashboard();
    } catch (updateError) {
      setError(getApiErrorMessage(updateError));
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-light">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  const project = data?.project;
  const progression = data?.progression ?? { tasksTotal: 0, tasksDone: 0, tasksPercent: 0 };
  const finance = data?.finance ?? { budgetTotal: 0, totalDepenses: 0, budgetRestant: 0 };
  const signaux = data?.signaux ?? [];
  const nextAction = data?.nextAction ?? null;
  const isActionDone = nextAction?.status === 'FAITE';
  const budgetPercent =
    finance.budgetTotal > 0
      ? Math.min(100, Math.round((finance.totalDepenses / finance.budgetTotal) * 100))
      : 0;

  const initials = (user?.name ?? '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-bg-light flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
        <AppSidebar activePage="dashboard" />

        <main className="flex-1 space-y-6 overflow-y-auto">
          <header className="flex items-center justify-end gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-gray-200/80 text-xs text-gray-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              Connecté
            </div>
            {projects.length > 1 ? (
              <select
                aria-label="Changer de projet"
                className="px-3 py-1 rounded-full bg-white/80 border border-gray-200/80 text-xs font-semibold text-gray-700"
                onChange={(event) => setCurrentProjectId(event.target.value)}
                value={currentProjectId ?? ''}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            ) : null}
            <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center text-[11px] font-bold text-white">
              {initials}
            </div>
          </header>

          {error && (
            <p aria-live="polite" className="text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                  OÙ EN EST MON PROJET
                </p>
                <h1 className="text-3xl md:text-[38px] font-black text-gray-900 leading-[1.15]">
                  {project?.name ?? 'Ton projet'}
                  <br />
                  <span className="text-warning">
                    {nextAction ? nextAction.title : 'Tout est sous contrôle.'}
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-xl">
                  {nextAction
                    ? nextAction.reason
                    : "Aucune alerte pour l'instant. Continue sur ta lancée."}
                </p>
              </div>

              <Card className="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Progression des tâches</p>
                    <p className="text-4xl font-black text-gray-900 mt-0.5">
                      {progression.tasksPercent}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-gray-400 font-medium">Objectif</p>
                    <p className="text-xs font-bold text-gray-900 mt-1">
                      {project?.objective || 'Non défini'}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${progression.tasksPercent}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                  <div className="bg-bg-light p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-medium">Budget restant</p>
                    <p className="text-lg font-black text-gray-900 mt-0.5">
                      {formatAmount(finance.budgetRestant)}
                    </p>
                    <p className="text-[9px] text-gray-400">FCFA</p>
                  </div>
                  <div className="bg-bg-light p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-medium">Tâches faites</p>
                    <p className="text-lg font-black text-gray-900 mt-1">
                      {progression.tasksDone}/{progression.tasksTotal}
                    </p>
                  </div>
                  <div className="bg-bg-light p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-medium">Signaux actifs</p>
                    <p className="text-lg font-black text-gray-900 mt-0.5">{signaux.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div
              className={`lg:col-span-5 p-7 rounded-3xl flex flex-col justify-between shadow-sm ${isActionDone || !nextAction ? 'bg-success text-white' : 'bg-warning text-dark'}`}
            >
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${isActionDone || !nextAction ? 'bg-black/20 text-white' : 'bg-black/10 text-gray-900'}`}
                >
                  {!nextAction
                    ? 'TOUT VA BIEN'
                    : isActionDone
                      ? 'ACTION TRAITÉE'
                      : 'ACTION À TRAITER'}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold leading-snug mt-6">
                  {nextAction ? nextAction.title : 'Rien à signaler aujourd’hui.'}
                </h2>
                <div
                  className={`mt-6 space-y-2 text-xs leading-relaxed font-medium ${isActionDone || !nextAction ? 'text-white/90' : 'text-gray-900/75'}`}
                >
                  {nextAction ? (
                    <>
                      <p>Raison · {nextAction.reason}</p>
                      {nextAction.dueDate && (
                        <p>Échéance · {new Date(nextAction.dueDate).toLocaleDateString('fr-FR')}</p>
                      )}
                      {nextAction.impact && <p>Impact · {nextAction.impact}</p>}
                    </>
                  ) : (
                    <p>On te prévient dès qu'un point demande ton attention.</p>
                  )}
                </div>
              </div>

              {nextAction && !isActionDone && (
                <div className="mt-8 space-y-2">
                  <Button
                    type="button"
                    onClick={() => navigate('/organization?filter=todo')}
                    className="w-full font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm bg-dark hover:bg-dark-soft text-white"
                  >
                    Voir les actions à traiter <ChevronRight size={18} />
                  </Button>
                  {nextAction.kind === 'SIGNAL' && (
                    <Button
                      type="button"
                      disabled={isUpdating}
                      onClick={handleRefineWithAI}
                      className="w-full font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-gray-900 disabled:opacity-60"
                    >
                      <Sparkles size={16} />
                      Affiner avec l'IA
                    </Button>
                  )}
                  <Button
                    type="button"
                    disabled={isUpdating}
                    onClick={handleMarkDone}
                    className="w-full font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-gray-900 disabled:opacity-60"
                  >
                    <Check size={16} strokeWidth={3} />
                    Marquer comme fait
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-5 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-gray-900">Points de vigilance</h3>
                <span className="w-5 h-5 rounded-full bg-warning/20 text-warning text-xs font-extrabold flex items-center justify-center">
                  {signaux.length}
                </span>
              </div>

              <div className="space-y-3">
                {signaux.length === 0 && (
                  <p className="text-xs text-gray-400">Aucun point de vigilance pour l'instant.</p>
                )}
                {signaux.map((signal) => (
                  <div
                    key={signal.id}
                    className="p-3.5 bg-bg-light rounded-2xl flex items-start gap-3"
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${SEVERITY_DOT[signal.severity] ?? 'bg-warning'}`}
                    ></span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {SIGNAL_LABELS[signal.type] ?? signal.type}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Détecté le {new Date(signal.detectedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-7 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-gray-900">Finance · en FCFA</h3>
                <button
                  onClick={() => navigate('/finance')}
                  type="button"
                  className="text-[11px] font-bold text-gray-700 hover:text-black flex items-center gap-1 bg-bg-light px-3 py-1.5 rounded-full"
                >
                  Voir le budget <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-bg-light rounded-2xl">
                  <p className="text-[10px] text-gray-400 font-medium">Budget total</p>
                  <p className="text-lg font-black text-gray-900 mt-1">
                    {formatAmount(finance.budgetTotal)}
                  </p>
                  <p className="text-[9px] text-gray-400">FCFA</p>
                </div>
                <div className="p-3.5 bg-bg-light rounded-2xl">
                  <p className="text-[10px] text-gray-400 font-medium">Dépensé</p>
                  <p className="text-lg font-black text-gray-900 mt-1">
                    {formatAmount(finance.totalDepenses)}
                  </p>
                  <p className="text-[9px] text-gray-400">{budgetPercent} % du budget</p>
                </div>
                <div className="p-3.5 bg-bg-light rounded-2xl">
                  <p className="text-[10px] text-gray-400 font-medium">Restant</p>
                  <p className="text-lg font-black text-success mt-1">
                    {formatAmount(finance.budgetRestant)}
                  </p>
                  <p className="text-[9px] text-gray-400">FCFA</p>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${budgetPercent >= 80 ? 'bg-danger' : 'bg-primary'}`}
                  style={{ width: `${budgetPercent}%` }}
                ></div>
              </div>
            </Card>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              TES 8 ESPACES
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {spaces.map(({ label, hint, icon, to }) => {
                const Icon = icon;
                return (
                  <Link key={label} to={to}>
                    <Card
                      className={`p-4 rounded-2xl flex items-center gap-3 ${
                        to === '/dashboard'
                          ? 'bg-dark text-white'
                          : 'bg-white border border-gray-200/60 hover:border-primary/30'
                      }`}
                    >
                      <Icon
                        size={18}
                        className={to === '/dashboard' ? 'text-accent' : 'text-success'}
                      />
                      <div>
                        <p
                          className={`font-bold text-xs ${to === '/dashboard' ? '' : 'text-gray-900'}`}
                        >
                          {label}
                        </p>
                        <p className="text-[10px] text-gray-400">{hint}</p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
