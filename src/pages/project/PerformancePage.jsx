import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { TrendingUp, Bell } from 'lucide-react';

export default function PerformancePage() {
  const kpis = [
    {
      title: "Chiffre d'affaires",
      value: "1,24 M",
      unit: "FCFA · +18 %",
      color: "text-emerald-600"
    },
    {
      title: "Clients acquis",
      value: "86",
      unit: "objectif 100",
      color: "text-[#1E2923]"
    },
    {
      title: "Conversion",
      value: "12,8 %",
      unit: "+2,1 pts",
      color: "text-emerald-600"
    },
    {
      title: "Commandes récurrentes",
      value: "34 %",
      unit: "objectif 40 %",
      color: "text-rose-500"
    }
  ];

  const monthlyGoals = [
    { title: "100 commandes", progress: 86 },
    { title: "40 % de rétention", progress: 72 },
    { title: "CA de 1,5 M FCFA", progress: 83 },
    { title: "5 partenariats", progress: 60 }
  ];

  const chartData = [
    { month: "Avr", val: 28, height: "30%" },
    { month: "Mai", val: 39, height: "45%" },
    { month: "Juin", val: 46, height: "52%" },
    { month: "Juil", val: 55, height: "62%" },
    { month: "Août", val: 72, height: "80%" },
    { month: "Sept", val: 88, height: "98%" }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
      <AppSidebar activePage="performance" />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER TOP */}
        <header className="px-10 py-5 flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 border border-[#E8E2D5] rounded-full text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Connecté
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
          
          {/* Title Header */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Performance</p>
            <h1 className="text-3xl font-extrabold text-[#1E2923] leading-tight max-w-xl">
              Les chiffres qui racontent vraiment ta progression.
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Des indicateurs adaptés à ta phase de lancement, sans bruit inutile.
            </p>
          </div>

          {/* TOP 4 KPI CARDS */}
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="bg-[#F3EFE6] p-5 rounded-2xl space-y-2">
                <p className="text-xs text-gray-500 font-medium">{kpi.title}</p>
                <p className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-[11px] text-gray-400 font-medium">{kpi.unit}</p>
              </div>
            ))}
          </div>

          {/* MAIN DASHBOARD GRID */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* TRACTION CHART CARD */}
            <div className="col-span-2 bg-white rounded-3xl p-6 border border-[#E8E2D5]/50 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-base text-[#1E2923]">Traction sur 6 mois</h3>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <TrendingUp size={14} />
                  Tendance positive
                </span>
              </div>

              {/* Chart Visual */}
              <div className="h-52 flex items-end justify-between gap-4 pt-6 border-b border-[#F3EFE6] px-4">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-bold text-[#1E2923]">{item.val}</span>
                    <div 
                      className="w-full bg-[#1E2923] rounded-t-lg transition-all duration-500 hover:bg-[#E69D00]" 
                      style={{ height: item.height }}
                    ></div>
                    <span className="text-xs text-gray-400 font-medium mt-2">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MONTHLY GOALS CARD */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5]/50 shadow-sm space-y-5">
              <h3 className="font-bold text-base text-[#1E2923]">Objectifs du mois</h3>

              <div className="space-y-4">
                {monthlyGoals.map((goal, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-[#1E2923]">{goal.title}</span>
                      <span className="font-bold text-gray-500">{goal.progress}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#F3EFE6] rounded-full h-2">
                      <div 
                        className="bg-[#E69D00] h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      </div>
    </div>
  );
}
