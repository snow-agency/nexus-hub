import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { 
  LayoutDashboard, 
  Briefcase, 
  Layers, 
  Coins, 
  Target, 
  Users, 
  TrendingUp, 
  Globe, 
  Bell, 
  Check, 
  ChevronRight,
} from 'lucide-react';

export function DashboardPage() {
  const [isActionDone, setIsActionDone] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
        
        <AppSidebar activePage="dashboard" />

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
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </header>

          {/* HERO DIAGNOSTIC & ACTION VERTE */}
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Colonne Gauche : Diagnostic & Progression */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">OÙ EN EST MON PROJET</p>
                <h1 className="text-3xl md:text-[38px] font-black text-gray-900 leading-[1.15]">
                  Voilà, tu passes à l'échelle. <br />
                  <span className="text-[#FF9900]">Sécurise le marketing.</span>
                </h1>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-xl">
                  MomoFood est à 64 % du lancement. Le budget marketing dépasse la prévision de 20 % — c'est ta seule vraie alerte aujourd'hui.
                </p>
              </div>

              {/* Card Progression */}
              <Card className="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Progression du lancement</p>
                    <p className="text-4xl font-black text-gray-900 mt-0.5">64%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-gray-400 font-medium">Objectif</p>
                    <p className="text-xs font-bold text-gray-900 mt-1">Ouverture · Semaine 3</p>
                  </div>
                </div>

                {/* Barre de progression bicolore / dégradée comme sur la maquette */}
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
                  <div className="bg-[#005C46] h-full" style={{ width: '35%' }}></div>
                  <div className="bg-[#FF9900] h-full" style={{ width: '29%' }}></div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                  <div className="bg-[#F7F5F0] p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-medium">Budget restant</p>
                    <p className="text-lg font-black text-gray-900 mt-0.5">280 k</p>
                    <p className="text-[9px] text-gray-400">FCFA</p>
                  </div>
                  <div className="bg-[#F7F5F0] p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-medium">Tâches faites</p>
                    <p className="text-lg font-black text-gray-900 mt-1">18/25</p>
                  </div>
                  <div className="bg-[#F7F5F0] p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-medium">Équipe</p>
                    <p className="text-lg font-black text-gray-900 mt-0.5">4</p>
                    <p className="text-[9px] text-gray-400">membres</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Colonne Droite : prochaine action */}
            <div className={`lg:col-span-5 p-7 rounded-3xl flex flex-col justify-between shadow-sm ${isActionDone ? 'bg-[#00A86B] text-white' : 'bg-[#F5A000] text-[#18181B]'}`}>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${isActionDone ? 'bg-black/20 text-white' : 'bg-black/10 text-gray-900'}`}>
                  {isActionDone ? 'ACTION TRAITÉE' : 'ACTION À TRAITER'}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold leading-snug mt-6">
                  {isActionDone ? 'Excellent. Ton prochain cap arrive demain.' : 'Sécurise ton budget marketing.'}
                </h2>
                <div className={`mt-6 space-y-2 text-xs leading-relaxed font-medium ${isActionDone ? 'text-white/90' : 'text-gray-900/75'}`}>
                  <p>Raison · Dépenses marketing à +20 % ce mois</p>
                  <p>Échéance · Vendredi 18 septembre</p>
                  <p>Impact · Protège le budget du lancement</p>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <Button
                  type="button"
                  onClick={() => navigate('/organization?filter=todo')}
                  className={`w-full font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm ${isActionDone ? 'bg-[#FFB800] hover:bg-[#E0A200] text-black' : 'bg-[#18181B] hover:bg-[#2A2A2C] text-white'}`}
                >
                  Voir les actions à traiter <ChevronRight size={18} />
                </Button>
                <Button
                  type="button"
                  disabled={isActionDone}
                  onClick={() => setIsActionDone(true)}
                  className={`w-full font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 ${isActionDone ? 'bg-white/70 text-gray-700' : 'bg-white/80 hover:bg-white text-gray-900'}`}
                >
                  <Check size={16} strokeWidth={3} />
                  {isActionDone ? "C'est fait" : 'Marquer comme fait'}
                </Button>
              </div>
            </div>
          </div>

          {/* POINTS DE VIGILANCE & FINANCE */}
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Points de vigilance */}
            <Card className="lg:col-span-5 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-gray-900">Points de vigilance</h3>
                <span className="w-5 h-5 rounded-full bg-[#FFE8C2] text-[#FF9900] text-xs font-extrabold flex items-center justify-center">3</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-[#F7F5F0] rounded-2xl flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF9900] mt-1 flex-shrink-0"></span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Budget marketing +20%</p>
                    <p className="text-[10px] text-gray-400">Trimestre en cours</p>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F7F5F0] rounded-2xl flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF9900] mt-1 flex-shrink-0"></span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Commande de farines retardée</p>
                    <p className="text-[10px] text-gray-400">Fournisseur · +2 jours</p>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F7F5F0] rounded-2xl flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A86B] mt-1 flex-shrink-0"></span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Cuisine : 1 poste à pourvoir</p>
                    <p className="text-[10px] text-gray-400">Avant ouverture</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Finance - en FCFA */}
            <Card className="lg:col-span-7 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-gray-900">Finance · en FCFA</h3>
                <button className="text-[11px] font-bold text-gray-700 hover:text-black flex items-center gap-1 bg-[#F7F5F0] px-3 py-1.5 rounded-full">
                  Voir le budget <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#F7F5F0] rounded-2xl">
                  <p className="text-[10px] text-gray-400 font-medium">Budget total</p>
                  <p className="text-lg font-black text-gray-900 mt-1">750 000</p>
                  <p className="text-[9px] text-gray-400">FCFA</p>
                </div>
                <div className="p-3.5 bg-[#F7F5F0] rounded-2xl">
                  <p className="text-[10px] text-gray-400 font-medium">Dépensé</p>
                  <p className="text-lg font-black text-gray-900 mt-1">470 000</p>
                  <p className="text-[9px] text-gray-400">63 % du budget</p>
                </div>
                <div className="p-3.5 bg-[#F7F5F0] rounded-2xl">
                  <p className="text-[10px] text-gray-400 font-medium">Prévision 30J</p>
                  <p className="text-lg font-black text-[#00A86B] mt-1">+180 000</p>
                  <p className="text-[9px] text-[#00A86B] font-medium">flux positif</p>
                </div>
              </div>

              {/* Barres de répartition */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-800">Marketing</span>
                    <span className="text-gray-900">165 000 <span className="text-[#FF9900] text-[10px]">+20%</span></span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#FF9900] h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-800">Ingrédients</span>
                    <span className="text-gray-900">190 000</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#00A86B] h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-800">Logistique</span>
                    <span className="text-gray-900">115 000</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gray-500 h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* TES 8 ESPACES */}
          <div className="space-y-3 pt-2">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">TES 8 ESPACES</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-4 bg-[#18181B] text-white rounded-2xl flex items-center gap-3">
                <LayoutDashboard size={18} className="text-[#FFB800]" />
                <div>
                  <p className="font-bold text-xs">Vue d'ensemble</p>
                  <p className="text-[10px] text-gray-400">ton cap</p>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-gray-200/60 rounded-2xl flex items-center gap-3">
                <Briefcase size={18} className="text-[#00A86B]" />
                <div>
                  <p className="font-bold text-xs text-gray-900">Mon projet</p>
                  <p className="text-[10px] text-gray-400">la vision</p>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-gray-200/60 rounded-2xl flex items-center gap-3">
                <Layers size={18} className="text-[#00A86B]" />
                <div>
                  <p className="font-bold text-xs text-gray-900">Organisation</p>
                  <p className="text-[10px] text-gray-400">les tâches</p>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-gray-200/60 rounded-2xl flex items-center gap-3">
                <Coins size={18} className="text-[#00A86B]" />
                <div>
                  <p className="font-bold text-xs text-gray-900">Finance</p>
                  <p className="text-[10px] text-gray-400">en FCFA</p>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-gray-200/60 rounded-2xl flex items-center gap-3">
                <Target size={18} className="text-[#00A86B]" />
                <div>
                  <p className="font-bold text-xs text-gray-900">Stratégie</p>
                  <p className="text-[10px] text-gray-400">le plan</p>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-gray-200/60 rounded-2xl flex items-center gap-3">
                <Users size={18} className="text-[#00A86B]" />
                <div>
                  <p className="font-bold text-xs text-gray-900">Équipe</p>
                  <p className="text-[10px] text-gray-400">les talents</p>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-gray-200/60 rounded-2xl flex items-center gap-3">
                <TrendingUp size={18} className="text-[#00A86B]" />
                <div>
                  <p className="font-bold text-xs text-gray-900">Performance</p>
                  <p className="text-[10px] text-gray-400">les KPI</p>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-gray-200/60 rounded-2xl flex items-center gap-3">
                <Globe size={18} className="text-[#00A86B]" />
                <div>
                  <p className="font-bold text-xs text-gray-900">Réseau</p>
                  <p className="text-[10px] text-gray-400">les connexions</p>
                </div>
              </Card>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}