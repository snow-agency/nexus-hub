import { useSearchParams } from 'react-router-dom';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, Plus, Calendar } from 'lucide-react';

export function OrganizationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterByParam = {
    todo: 'À faire',
    'in-progress': 'En cours',
    done: 'Terminé',
  };
  const paramByFilter = {
    'À faire': 'todo',
    'En cours': 'in-progress',
    Terminé: 'done',
  };
  const filter = filterByParam[searchParams.get('filter')] || 'Toutes';

  function setFilter(nextFilter) {
    const nextParam = paramByFilter[nextFilter];
    setSearchParams(nextParam ? { filter: nextParam } : {}, { replace: true });
  }

  const avatarUrl =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';

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
              <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                ORGANISATION
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                La semaine reste simple quand chacun voit l'essentiel.
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                Planifie, attribue et avance sans perdre de vue les blocages.
              </p>
            </div>
            <Button className="bg-[#FF9900] hover:bg-[#e08700] text-black font-bold px-5 py-2.5 rounded-full flex items-center gap-2 self-start shadow-sm">
              <Plus size={18} strokeWidth={2.5} /> Nouvelle tâche
            </Button>
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
          <div
            className={`grid grid-cols-1 gap-6 pt-2 ${filter === 'Toutes' ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}
          >
            {/* COLONNE 1 : À FAIRE */}
            {(filter === 'Toutes' || filter === 'À faire') && (
              <Card className="p-5 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-1">
                  <h3 className="font-extrabold text-sm text-gray-900">À faire</h3>
                  <span className="w-5 h-5 rounded-full bg-[#F7F5F0] text-gray-500 text-xs font-bold flex items-center justify-center">
                    2
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
                    <img
                      src={avatarUrl}
                      alt="Assigné"
                      className="w-5 h-5 rounded-full object-cover"
                    />
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
                    <img
                      src={avatarUrl}
                      alt="Assigné"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  </div>
                </div>
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
                    <img
                      src={avatarUrl}
                      alt="Assigné"
                      className="w-5 h-5 rounded-full object-cover"
                    />
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
                    <img
                      src={avatarUrl}
                      alt="Assigné"
                      className="w-5 h-5 rounded-full object-cover"
                    />
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
                    <img
                      src={avatarUrl}
                      alt="Assigné"
                      className="w-5 h-5 rounded-full object-cover"
                    />
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
                    <img
                      src={avatarUrl}
                      alt="Assigné"
                      className="w-5 h-5 rounded-full object-cover"
                    />
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
