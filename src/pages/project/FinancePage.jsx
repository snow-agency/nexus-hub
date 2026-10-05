import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Card } from '../../components/ui/Card';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { Bell, Plus, X } from 'lucide-react';

const monthlyExpenseBase = 470000;
const totalBudget = 750000;
const baseCategoryTotals = [
  { name: 'Marketing', amount: 164500, color: 'text-[#FF9900]' },
  { name: 'Ingrédients', amount: 155100, color: 'text-[#00A86B]' },
  { name: 'Logistique', amount: 75200, color: 'text-[#E0533C]' },
  { name: 'Autres', amount: 75200, color: 'text-gray-400' },
];
const initialOperations = [
  {
    id: 'instagram',
    label: 'Campagne Instagram',
    category: 'Marketing',
    amount: 65000,
    type: 'expense',
  },
  {
    id: 'flour',
    label: 'Commande farine locale',
    category: 'Ingrédients',
    amount: 90000,
    type: 'expense',
  },
  {
    id: 'kora',
    label: 'Acompte entreprise Kora',
    category: 'Vente',
    amount: 180000,
    type: 'income',
  },
  {
    id: 'fuel',
    label: 'Carburant livraison',
    category: 'Logistique',
    amount: 22500,
    type: 'expense',
  },
];

function formatAmount(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount);
}

export function FinancePage() {
  const avatarUrl =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [newExpenses, setNewExpenses] = useState([]);
  const [expenseLabel, setExpenseLabel] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Marketing');
  const [expenseAmount, setExpenseAmount] = useState('');

  const totalExpenses =
    monthlyExpenseBase + newExpenses.reduce((total, expense) => total + expense.amount, 0);
  const availableBudget = Math.max(0, totalBudget - totalExpenses);
  const consumedPercentage = Math.round((totalExpenses / totalBudget) * 100);
  const categoryTotals = baseCategoryTotals.map((category) => ({
    ...category,
    amount:
      category.amount +
      newExpenses
        .filter((expense) => expense.category === category.name)
        .reduce((total, expense) => total + expense.amount, 0),
  }));
  const operations = [
    ...newExpenses.map((expense) => ({ ...expense, type: 'expense' })),
    ...initialOperations,
  ];

  function handleExpenseSubmit(event) {
    event.preventDefault();
    const amount = Number(expenseAmount);
    const label = expenseLabel.trim();

    if (!label || !Number.isFinite(amount) || amount <= 0) return;

    setNewExpenses((previousExpenses) => [
      { id: Date.now(), label, category: expenseCategory, amount },
      ...previousExpenses,
    ]);
    setExpenseLabel('');
    setExpenseCategory('Marketing');
    setExpenseAmount('');
    setIsExpenseDialogOpen(false);
  }

  const donutSegments = categoryTotals.map((category, index) => {
    const percentage = (category.amount / totalExpenses) * 100;
    const offset = categoryTotals
      .slice(0, index)
      .reduce(
        (total, previousCategory) => total + (previousCategory.amount / totalExpenses) * 100,
        0,
      );

    return { ...category, percentage, offset };
  });

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
        <AppSidebar activePage="finance" />

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 space-y-6 overflow-y-auto">
          {/* Header Supérieur */}
          <header className="flex items-center justify-end gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-gray-200/80 text-xs text-gray-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Connecté
            </div>
            <button className="w-8 h-8 rounded-full bg-white/80 border border-gray-200/80 flex items-center justify-center text-gray-700 hover:text-black">
              <Bell size={16} />
            </button>
            <button className="px-3 py-1 rounded-full bg-white/80 border border-gray-200/80 text-xs font-semibold text-gray-700 hover:bg-white">
              Changer de projet
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </header>

          {/* HEADER PAGE FINANCE */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                FINANCE
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Chaque franc a une mission.
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                Suis les dépenses, protège ta trésorerie et anticipe les trente prochains jours.
              </p>
            </div>
            <Dialog.Root open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="bg-[#FF9900] hover:bg-[#e08700] text-black font-bold px-5 py-2.5 rounded-full flex items-center gap-2 self-start shadow-sm"
                >
                  <Plus size={18} strokeWidth={2.5} /> Ajouter une dépense
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-[#18181B]/40 backdrop-blur-[1px]" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl focus:outline-none sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="text-lg font-extrabold text-gray-900">
                        Ajouter une dépense
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

                  <form className="mt-6 space-y-4" onSubmit={handleExpenseSubmit}>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Libellé</span>
                      <input
                        autoFocus
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                        onChange={(event) => setExpenseLabel(event.target.value)}
                        placeholder="Ex. Achat de fournitures"
                        required
                        value={expenseLabel}
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block space-y-1.5">
                        <span className="text-sm font-semibold text-gray-800">Catégorie</span>
                        <select
                          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                          onChange={(event) => setExpenseCategory(event.target.value)}
                          value={expenseCategory}
                        >
                          {baseCategoryTotals.map(({ name }) => (
                            <option key={name}>{name}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-sm font-semibold text-gray-800">Montant (FCFA)</span>
                        <input
                          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                          min="1"
                          onChange={(event) => setExpenseAmount(event.target.value)}
                          placeholder="Ex. 25000"
                          required
                          step="1"
                          type="number"
                          value={expenseAmount}
                        />
                      </label>
                    </div>

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
                        className="rounded-lg bg-[#FF9900] px-4 py-2.5 text-sm font-bold text-gray-900 hover:bg-[#e08700]"
                        type="submit"
                      >
                        Enregistrer la dépense
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          {/* METRICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/60 border border-gray-200/60 rounded-2xl space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">Budget disponible</p>
              <p className="text-2xl font-black text-gray-900">{formatAmount(availableBudget)}</p>
              <p className="text-[10px] text-gray-400">FCFA</p>
            </div>

            <div className="p-4 bg-white/60 border border-gray-200/60 rounded-2xl space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">Dépenses du mois</p>
              <p className="text-2xl font-black text-[#D9381E]">{formatAmount(totalExpenses)}</p>
              <p className="text-[10px] text-gray-400">{consumedPercentage} % consommés</p>
            </div>

            <div className="p-4 bg-white/60 border border-gray-200/60 rounded-2xl space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">Entrées prévues</p>
              <p className="text-2xl font-black text-[#00A86B]">650 000</p>
              <p className="text-[10px] text-gray-400">sur 30 jours</p>
            </div>
          </div>

          {/* CHARTS ROW */}
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Flux de trésorerie */}
            <Card className="lg:col-span-8 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm flex flex-col justify-between min-h-[280px]">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-gray-900">Flux de trésorerie</h3>
                <span className="text-xs font-bold text-[#00A86B]">+24 % ce mois</span>
              </div>

              {/* Conteneur axe / grilles du graphique */}
              <div className="w-full mt-12 pt-8 border-b border-gray-200 flex justify-between text-[11px] text-gray-400 font-medium px-2">
                <span>S1</span>
                <span>S2</span>
                <span>S3</span>
                <span>S4</span>
                <span>S5</span>
                <span>S6</span>
                <span>S7</span>
                <span>S8</span>
              </div>
            </Card>

            {/* Répartition */}
            <Card className="lg:col-span-4 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-5">
              <h3 className="font-extrabold text-sm text-gray-900">Répartition</h3>

              {/* Donut Chart représentatif en SVG */}
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
                    {formatAmount(totalExpenses / 1000)} k
                  </p>
                </div>
              </div>

              {/* Légendes */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {donutSegments.map((segment) => (
                  <div
                    key={segment.name}
                    className="flex items-center justify-between rounded-xl bg-[#F7F5F0] p-2 text-[10px]"
                  >
                    <span className="font-medium text-gray-600">{segment.name}</span>
                    <span className="font-extrabold text-gray-900">
                      {Math.round(segment.percentage)}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* TABLEAU DES DERNIÈRES OPÉRATIONS */}
          <Card className="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900">Dernières opérations</h3>

            <div className="divide-y divide-gray-100">
              {operations.map((operation) => (
                <div
                  key={operation.id}
                  className="flex items-center justify-between gap-3 py-3.5 text-xs"
                >
                  <span className="font-bold text-gray-900">{operation.label}</span>
                  <span className="font-medium text-gray-400">{operation.category}</span>
                  <span
                    className={`font-extrabold ${operation.type === 'income' ? 'text-[#00A86B]' : 'text-gray-900'}`}
                  >
                    {operation.type === 'income' ? '+' : '−'} {formatAmount(operation.amount)} FCFA
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
