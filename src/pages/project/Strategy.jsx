import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { Search, Target, CheckCircle2, Circle, Download, ArrowRight, Bell } from 'lucide-react';

export default function StrategyPage() {
  const steps = [
    { title: "Définir les clients cibles", completed: true },
    { title: "Cartographier 5 concurrents", completed: true },
    { title: "Réaliser 15 entretiens", completed: false },
    { title: "Valider le prix psychologique", completed: false },
  ];

  const businessPlanSections = [
    { id: "01", title: "Résumé exécutif", status: "Complet", color: "text-emerald-600" },
    { id: "02", title: "Marché", status: "78 %", color: "text-emerald-600" },
    { id: "03", title: "Opérations", status: "65 %", color: "text-emerald-600" },
    { id: "04", title: "Prévisions", status: "52 %", color: "text-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
      <AppSidebar activePage="strategy" />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER TOP */}
        <header className="px-10 py-5 flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 border border-[#E8E2D5] rounded-full text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Connecté · 4G
          </div>
          <button className="p-2 bg-white/60 border border-[#E8E2D5] rounded-full text-gray-600 hover:bg-white transition-colors">
            <Bell size={16} />
          </button>
          <button className="px-4 py-2 bg-white/60 border border-[#E8E2D5] rounded-full text-xs font-medium text-gray-700 hover:bg-white transition-colors">
            Changer de projet
          </button>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
            alt="User avatar" 
            className="w-9 h-9 rounded-full object-cover border border-[#E8E2D5]"
          />
        </header>

        {/* PAGE CONTENT */}
        <div className="px-2 py-4 flex-1 max-w-6xl space-y-6">
          
          {/* Header Title Section */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Stratégie</p>
              <h1 className="text-3xl font-extrabold text-[#1E2923] leading-tight max-w-xl">
                Transforme ton intuition en décisions solides.
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Une méthode guidée pour comprendre le marché, affiner ton positionnement et bâtir un plan crédible.
              </p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E2D5] rounded-xl text-xs font-semibold text-[#1E2923] shadow-sm hover:bg-gray-50 transition-colors">
              <Download size={15} />
              Exporter le business plan
            </button>
          </div>

          {/* TWO MAIN CARDS GRID */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* CARD 1: Étude de marché */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5]/50 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Search size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1E2923]">Étude de marché</h3>
                  <p className="text-xs text-gray-400">Progression · 78 %</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#F3EFE6] rounded-full h-2">
                <div className="bg-[#E69D00] h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>

              {/* Steps List */}
              <div className="space-y-2.5">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-[#F8F5EE] rounded-2xl">
                    {step.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-500 text-white" />
                    ) : (
                      <Circle size={18} className="text-gray-300" />
                    )}
                    <span className={`text-xs font-medium ${step.completed ? 'text-[#1E2923]' : 'text-gray-600'}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 2: Positionnement */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5]/50 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1E2923]">Positionnement</h3>
                    <p className="text-xs text-emerald-600 font-medium">Promesse validée</p>
                  </div>
                </div>

                <blockquote className="text-lg font-bold text-[#1E2923] leading-snug pt-2">
                  « Le goût de la maison, livré avant que la faim ne gagne. »
                </blockquote>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Face aux fast-foods, MomoFood se distingue par des recettes locales, une relation humaine et une livraison fiable.
                </p>
              </div>

              <div className="pt-6">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#E69D00] hover:bg-[#d18e00] text-[#1E2923] text-xs font-semibold rounded-xl transition-colors">
                  Affiner le positionnement
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>

          {/* BOTTOM SECTION: Business Plan Grid */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5]/50 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Plan d'affaires</p>
            
            <div className="grid grid-cols-4 gap-4">
              {businessPlanSections.map((item) => (
                <div key={item.id} className="bg-[#F8F5EE] p-4 rounded-2xl space-y-3 hover:bg-[#f3efe4] transition-colors cursor-pointer">
                  <span className="text-xs text-gray-400 font-medium">{item.id}</span>
                  <h4 className="font-bold text-sm text-[#1E2923]">{item.title}</h4>
                  <p className={`text-xs font-semibold ${item.color}`}>{item.status}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      </div>
    </div>
  );
}
