import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Bell, 
  Plus, 
  Calendar,
  X
} from 'lucide-react';

export function OrganizationPage() {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [newTasks, setNewTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Marketing');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const filterByParam = {
    todo: 'À faire',
    'in-progress': 'En cours',
    done: 'Terminé',
  };
  const paramByFilter = {
    'À faire': 'todo',
    'En cours': 'in-progress',
    'Terminé': 'done',
  };
  const filter = filterByParam[searchParams.get('filter')] || 'Toutes';

  function setFilter(nextFilter) {
    const nextParam = paramByFilter[nextFilter];
    setSearchParams(nextParam ? { filter: nextParam } : {}, { replace: true });
  }

  function handleTaskSubmit(event) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title) return;

    setNewTasks((previousTasks) => [
      { id: Date.now(), title, category: taskCategory, dueDate: taskDueDate || 'À planifier' },
      ...previousTasks,
    ]);
    setTaskTitle('');
    setTaskCategory('Marketing');
    setTaskDueDate('');
    setIsTaskDialogOpen(false);
  }

  const avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150";

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
        
        <AppSidebar activePage="organization" />

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

          {/* HEADER PAGE ORGANISATION */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">ORGANISATION</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                La semaine reste simple quand chacun voit l'essentiel.
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                Planifie, attribue et avance sans perdre de vue les blocages.
              </p>
            </div>
            <Dialog.Root open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 self-start rounded-full bg-[#FF9900] px-5 py-2.5 font-bold text-black shadow-sm transition-colors hover:bg-[#e08700]" type="button">
                  <Plus size={18} strokeWidth={2.5} /> Nouvelle tâche
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-[#18181B]/40 backdrop-blur-[1px]" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl focus:outline-none sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="text-lg font-extrabold text-gray-900">Nouvelle tâche</Dialog.Title>
                      <Dialog.Description className="mt-1 text-sm text-gray-600">
                        Ajoute une priorité à la liste « À faire ».
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button aria-label="Fermer" className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900" type="button">
                        <X aria-hidden="true" size={18} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <form className="mt-6 space-y-4" onSubmit={handleTaskSubmit}>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Intitulé</span>
                      <input
                        autoFocus
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                        maxLength={120}
                        onChange={(event) => setTaskTitle(event.target.value)}
                        placeholder="Ex. Préparer la campagne de lancement"
                        required
                        value={taskTitle}
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block space-y-1.5">
                        <span className="text-sm font-semibold text-gray-800">Catégorie</span>
                        <select
                          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                          onChange={(event) => setTaskCategory(event.target.value)}
                          value={taskCategory}
                        >
                          {['Marketing', 'Achats', 'Équipe', 'Produit', 'Logistique', 'Autre'].map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-sm font-semibold text-gray-800">Échéance</span>
                        <input
                          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                          onChange={(event) => setTaskDueDate(event.target.value)}
                          type="date"
                          value={taskDueDate}
                        />
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                      <Dialog.Close asChild>
                        <button className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50" type="button">
                          Annuler
                        </button>
                      </Dialog.Close>
                      <button className="rounded-lg bg-[#FF9900] px-4 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-[#e08700]" type="submit">
                        Ajouter la tâche
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          {/* FILTRES DE STATUT */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {['Toutes', 'À faire', 'En cours', 'Terminé'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === tab
                    ? 'bg-[#18181B] text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white border border-gray-200/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* KANBAN BOARD */}
          <div className={`grid grid-cols-1 gap-6 pt-2 ${filter === 'Toutes' ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}>
            
            {/* COLONNE 1 : À FAIRE */}
            {(filter === 'Toutes' || filter === 'À faire') && (
            <Card className="p-5 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-1">
                <h3 className="font-extrabold text-sm text-gray-900">À faire</h3>
                <span className="w-5 h-5 rounded-full bg-[#F7F5F0] text-gray-500 text-xs font-bold flex items-center justify-center">
                  {2 + newTasks.length}
                </span>
              </div>

              {/* Tâche 1 */}
              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFE8C2] text-[#B86E00] text-[10px] font-bold">
                  Prioritaire
                </span>
                <p className="text-xs font-bold text-gray-900 leading-snug">
                  Valider le budget marketing
                </p>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <Calendar size={12} />
                    <span>Aujourd'hui</span>
                  </div>
                  <img src={avatarUrl} alt="Assigné" className="w-5 h-5 rounded-full object-cover" />
                </div>
              </div>

              {/* Tâche 2 */}
              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFE8C2] text-[#B86E00] text-[10px] font-bold">
                  Marketing
                </span>
                <p className="text-xs font-bold text-gray-900 leading-snug">
                  Rédiger le post Instagram de lancement
                </p>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <Calendar size={12} />
                    <span>Vendredi</span>
                  </div>
                  <img src={avatarUrl} alt="Assigné" className="w-5 h-5 rounded-full object-cover" />
                </div>
              </div>

              {newTasks.map((task) => (
                <div key={task.id} className="space-y-3 rounded-2xl bg-[#F7F5F0] p-4">
                  <span className="inline-block rounded-full bg-[#FFE8C2] px-2.5 py-0.5 text-[10px] font-bold text-[#B86E00]">
                    {task.category}
                  </span>
                  <p className="text-xs font-bold leading-snug text-gray-900">{task.title}</p>
                  <div className="flex items-center gap-1.5 pt-2 text-[10px] font-medium text-gray-400">
                    <Calendar size={12} />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </Card>
            )}

            {/* COLONNE 2 : EN COURS */}
            {(filter === 'Toutes' || filter === 'En cours') && (
            <Card className="p-5 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-1">
                <h3 className="font-extrabold text-sm text-gray-900">En cours</h3>
                <span className="w-5 h-5 rounded-full bg-[#F7F5F0] text-gray-500 text-xs font-bold flex items-center justify-center">
                  2
                </span>
              </div>

              {/* Tâche 1 */}
              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFE8C2] text-[#B86E00] text-[10px] font-bold">
                  Achats
                </span>
                <p className="text-xs font-bold text-gray-900 leading-snug">
                  Négocier le prix du fournisseur de riz
                </p>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <Calendar size={12} />
                    <span>Aujourd'hui</span>
                  </div>
                  <img src={avatarUrl} alt="Assigné" className="w-5 h-5 rounded-full object-cover" />
                </div>
              </div>

              {/* Tâche 2 */}
              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFE8C2] text-[#B86E00] text-[10px] font-bold">
                  Équipe
                </span>
                <p className="text-xs font-bold text-gray-900 leading-snug">
                  Former le livreur aux itinéraires
                </p>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <Calendar size={12} />
                    <span>Demain</span>
                  </div>
                  <img src={avatarUrl} alt="Assigné" className="w-5 h-5 rounded-full object-cover" />
                </div>
              </div>
            </Card>
            )}

            {/* COLONNE 3 : TERMINÉ */}
            {(filter === 'Toutes' || filter === 'Terminé') && (
            <Card className="p-5 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-1">
                <h3 className="font-extrabold text-sm text-gray-900">Terminé</h3>
                <span className="w-5 h-5 rounded-full bg-[#F7F5F0] text-gray-500 text-xs font-bold flex items-center justify-center">
                  2
                </span>
              </div>

              {/* Tâche 1 */}
              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFE8C2] text-[#B86E00] text-[10px] font-bold">
                  Produit
                </span>
                <p className="text-xs font-bold text-gray-900 leading-snug">
                  Charger les photos du menu
                </p>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <Calendar size={12} />
                    <span>Terminé</span>
                  </div>
                  <img src={avatarUrl} alt="Assigné" className="w-5 h-5 rounded-full object-cover" />
                </div>
              </div>

              {/* Tâche 2 */}
              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFE8C2] text-[#B86E00] text-[10px] font-bold">
                  Logistique
                </span>
                <p className="text-xs font-bold text-gray-900 leading-snug">
                  Réserver la vitrine de Tokoin
                </p>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <Calendar size={12} />
                    <span>Terminé</span>
                  </div>
                  <img src={avatarUrl} alt="Assigné" className="w-5 h-5 rounded-full object-cover" />
                </div>
              </div>
            </Card>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}