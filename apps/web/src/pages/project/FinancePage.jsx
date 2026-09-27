import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { 
  Bell, 
  Plus
} from 'lucide-react';

export function FinancePage() {
  const avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150";

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
              <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">FINANCE</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Chaque franc a une mission.
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                Suis les dépenses, protège ta trésorerie et anticipe les trente prochains jours.
              </p>
            </div>
            <Button className="bg-[#FF9900] hover:bg-[#e08700] text-black font-bold px-5 py-2.5 rounded-full flex items-center gap-2 self-start shadow-sm">
              <Plus size={18} strokeWidth={2.5} /> Ajouter une dépense
            </Button>
          </div>

          {/* METRICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/60 border border-gray-200/60 rounded-2xl space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">Budget disponible</p>
              <p className="text-2xl font-black text-gray-900">280 000</p>
              <p className="text-[10px] text-gray-400">FCFA</p>
            </div>

            <div className="p-4 bg-white/60 border border-gray-200/60 rounded-2xl space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">Dépenses du mois</p>
              <p className="text-2xl font-black text-[#D9381E]">470 000</p>
              <p className="text-[10px] text-gray-400">63 % consommés</p>
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

            {/* Répartition (Donut) */}
            <Card className="lg:col-span-4 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-5">
              <h3 className="font-extrabold text-sm text-gray-900">Répartition</h3>

              {/* Donut Chart représentatif en SVG */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#FF9900]"
                    strokeDasharray="35 100"
                    strokeWidth="4.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#00A86B]"
                    strokeDasharray="33 100"
                    strokeDashoffset="-35"
                    strokeWidth="4.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#E0533C]"
                    strokeDasharray="16 100"
                    strokeDashoffset="-68"
                    strokeWidth="4.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-gray-400"
                    strokeDasharray="16 100"
                    strokeDashoffset="-84"
                    strokeWidth="4.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-sm font-black text-gray-900">470 k</p>
                </div>
              </div>

              {/* Légendes */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2 bg-[#F7F5F0] rounded-xl flex justify-between items-center text-[10px]">
                  <span className="text-gray-600 font-medium">Marketing</span>
                  <span className="font-extrabold text-gray-900">35%</span>
                </div>
                <div className="p-2 bg-[#F7F5F0] rounded-xl flex justify-between items-center text-[10px]">
                  <span className="text-gray-600 font-medium">Ingrédients</span>
                  <span className="font-extrabold text-gray-900">33%</span>
                </div>
                <div className="p-2 bg-[#F7F5F0] rounded-xl flex justify-between items-center text-[10px]">
                  <span className="text-gray-600 font-medium">Logistique</span>
                  <span className="font-extrabold text-gray-900">16%</span>
                </div>
                <div className="p-2 bg-[#F7F5F0] rounded-xl flex justify-between items-center text-[10px]">
                  <span className="text-gray-600 font-medium">Autres</span>
                  <span className="font-extrabold text-gray-900">16%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* TABLEAU DES DERNIÈRES OPÉRATIONS */}
          <Card className="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900">Dernières opérations</h3>

            <div className="divide-y divide-gray-100">
              <div className="py-3.5 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900">Campagne Instagram</span>
                <span className="text-gray-400 font-medium">Marketing</span>
                <span className="font-extrabold text-gray-900">- 65 000 FCFA</span>
              </div>

              <div className="py-3.5 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900">Commande farine locale</span>
                <span className="text-gray-400 font-medium">Ingrédients</span>
                <span className="font-extrabold text-gray-900">- 90 000 FCFA</span>
              </div>

              <div className="py-3.5 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900">Acompte entreprise Kora</span>
                <span className="text-gray-400 font-medium">Vente</span>
                <span className="font-extrabold text-[#00A86B]">+ 180 000 FCFA</span>
              </div>

              <div className="py-3.5 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900">Carburant livraison</span>
                <span className="text-gray-400 font-medium">Logistique</span>
                <span className="font-extrabold text-gray-900">- 22 500 FCFA</span>
              </div>
            </div>
          </Card>

        </main>
      </div>
    </div>
  );
}