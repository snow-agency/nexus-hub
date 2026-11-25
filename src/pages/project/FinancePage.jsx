import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Card } from '../../components/ui/Card';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { useProject } from '../../context/ProjectContext.jsx';
import { api, getApiErrorMessage } from '../../services/api.js';
import { Plus, X } from 'lucide-react';

const CATEGORY_LABELS = {
  MARKETING: 'Marketing',
  DEVELOPPEMENT: 'Développement',
  LOGISTIQUE: 'Logistique',
  SALAIRES: 'Salaires',
  LOYER: 'Loyer',
  MATERIEL: 'Matériel',
  ADMINISTRATIF: 'Administratif',
  AUTRE: 'Autre',
};

const DONUT_COLORS = [
  'text-primary',
  'text-warning',
  'text-success',
  'text-danger',
  'text-accent-hover',
  'text-dark',
  'text-gray-400',
  'text-gray-600',
];

function formatAmount(amount) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount ?? 0));
}

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_TRANSACTIONS = [];

export function FinancePage() {
  const { currentProjectId } = useProject();

  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [type, setType] = useState('DEPENSE');
  const [category, setCategory] = useState('AUTRE');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISODate());

  const loadData = useCallback(async () => {
    if (!currentProjectId) return;
    try {
      const [summaryResponse, categoriesResponse] = await Promise.all([
        api.get(`/finance/project/${currentProjectId}`),
        api.get('/finance/categories'),
      ]);
      setSummary(summaryResponse.data);
      setCategories(categoriesResponse.data.categories);
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

  async function handleSubmit(event) {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0 || !currentProjectId) return;

    try {
      await api.post('/finance', {
        projectId: currentProjectId,
        type,
        amount: numericAmount,
        category,
        date: new Date(date).toISOString(),
      });
      setAmount('');
      setType('DEPENSE');
      setCategory('AUTRE');
      setDate(todayISODate());
      setIsDialogOpen(false);
      await loadData();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    }
  }

  const transactions = summary?.transactions ?? EMPTY_TRANSACTIONS;
  const totalDepenses = summary?.totalDepenses ?? 0;
  const totalRevenus = summary?.totalRevenus ?? 0;
  const budgetTotal = summary?.budgetTotal ?? 0;
  const budgetRestant = summary?.budgetRestant ?? 0;
  const consumedPercentage = budgetTotal > 0 ? Math.round((totalDepenses / budgetTotal) * 100) : 0;

  const categoryTotals = useMemo(() => {
    const totals = new Map();
    for (const transaction of transactions) {
      if (transaction.type !== 'DEPENSE') continue;
      const key = transaction.category ?? 'AUTRE';
      totals.set(key, (totals.get(key) ?? 0) + Number(transaction.amount));
    }
    return Array.from(totals.entries())
      .map(([key, value], index) => ({
        name: CATEGORY_LABELS[key] ?? key,
        amount: value,
        color: DONUT_COLORS[index % DONUT_COLORS.length],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const donutSegments = categoryTotals.map((segment, index) => {
    const percentage = totalDepenses > 0 ? (segment.amount / totalDepenses) * 100 : 0;
    const offset = categoryTotals
      .slice(0, index)
      .reduce(
        (total, previous) =>
          total + (totalDepenses > 0 ? (previous.amount / totalDepenses) * 100 : 0),
        0,
      );
    return { ...segment, percentage, offset };
  });

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
        <AppSidebar activePage="finance" />

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
                FINANCE
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Chaque franc a une mission.
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                Suis les dépenses et les revenus, protège ta trésorerie.
              </p>
            </div>
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="bg-warning hover:bg-warning-hover text-black font-bold px-5 py-2.5 rounded-full flex items-center gap-2 self-start shadow-sm"
                >
                  <Plus size={18} strokeWidth={2.5} /> Ajouter une opération
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-[1px]" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl focus:outline-none sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="text-lg font-extrabold text-gray-900">
                        Ajouter une opération
                      </Dialog.Title>
                      <Dialog.Description className="mt-1 text-sm text-gray-600">
                        Renseigne les détails pour mettre à jour ton suivi financier.
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
                    <div className="flex gap-2">
                      {[
                        { value: 'DEPENSE', label: 'Dépense' },
                        { value: 'REVENU', label: 'Revenu' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                            type === option.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-300 text-gray-600 hover:border-primary/40'
                          }`}
                          onClick={() => setType(option.value)}
                          type="button"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block space-y-1.5">
                        <span className="text-sm font-semibold text-gray-800">Catégorie</span>
                        <select
                          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          onChange={(event) => setCategory(event.target.value)}
                          value={category}
                        >
                          {categories.map((key) => (
                            <option key={key} value={key}>
                              {CATEGORY_LABELS[key] ?? key}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-sm font-semibold text-gray-800">Montant (FCFA)</span>
                        <input
                          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          min="1"
                          onChange={(event) => setAmount(event.target.value)}
                          placeholder="Ex. 25000"
                          required
                          step="1"
                          type="number"
                          value={amount}
                        />
                      </label>
                    </div>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Date</span>
                      <input
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        onChange={(event) => setDate(event.target.value)}
                        required
                        type="date"
                        value={date}
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
                        Enregistrer
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/60 border border-gray-200/60 rounded-2xl space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">Budget restant</p>
              <p className="text-2xl font-black text-success">{formatAmount(budgetRestant)}</p>
              <p className="text-[10px] text-gray-400">FCFA</p>
            </div>

            <div className="p-4 bg-white/60 border border-gray-200/60 rounded-2xl space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">Dépenses totales</p>
              <p className="text-2xl font-black text-danger">{formatAmount(totalDepenses)}</p>
              <p className="text-[10px] text-gray-400">{consumedPercentage} % du budget</p>
            </div>

            <div className="p-4 bg-white/60 border border-gray-200/60 rounded-2xl space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">Revenus totaux</p>
              <p className="text-2xl font-black text-success">{formatAmount(totalRevenus)}</p>
              <p className="text-[10px] text-gray-400">
                Budget total : {formatAmount(budgetTotal)}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            <Card className="lg:col-span-4 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-5">
              <h3 className="font-extrabold text-sm text-gray-900">Répartition des dépenses</h3>

              {donutSegments.length === 0 ? (
                <p className="text-xs text-gray-400">Aucune dépense enregistrée pour l'instant.</p>
              ) : (
                <>
                  <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {donutSegments.map((segment) => (
                        <path
                          key={segment.name}
                          className={segment.color}
                          strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
                          strokeDashoffset={`${-segment.offset}`}
                          strokeWidth="4.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      ))}
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-sm font-black text-gray-900">
                        {formatAmount(totalDepenses / 1000)} k
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {donutSegments.map((segment) => (
                      <div
                        key={segment.name}
                        className="flex items-center justify-between rounded-xl bg-bg-light p-2 text-[10px]"
                      >
                        <span className="font-medium text-gray-600">{segment.name}</span>
                        <span className="font-extrabold text-gray-900">
                          {Math.round(segment.percentage)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>

            <Card className="lg:col-span-8 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-gray-900">Dernières opérations</h3>

              {transactions.length === 0 ? (
                <p className="text-xs text-gray-400">
                  Aucune opération enregistrée pour l'instant.
                </p>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto">
                  {transactions.map((operation) => (
                    <div
                      key={operation.id}
                      className="flex items-center justify-between gap-3 py-3.5 text-xs"
                    >
                      <span className="font-medium text-gray-400">
                        {new Date(operation.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="font-medium text-gray-400">
                        {CATEGORY_LABELS[operation.category] ?? operation.category ?? 'Autre'}
                      </span>
                      <span
                        className={`font-extrabold ${operation.type === 'REVENU' ? 'text-success' : 'text-gray-900'}`}
                      >
                        {operation.type === 'REVENU' ? '+' : '−'} {formatAmount(operation.amount)}{' '}
                        FCFA
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
