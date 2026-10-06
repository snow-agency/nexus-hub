import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { Plus, Bell } from 'lucide-react';

export default function TeamPage() {
  const members = [
    {
      name: "Aminata Dossou",
      role: "Fondatrice · Direction",
      charge: "7 tâches",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Fanta Mensah",
      role: "Croissance · Marketing",
      charge: "5 tâches",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Kossi Adjakpa",
      role: "Mentor · Finance",
      charge: "2 suivis",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
    }
  ];

  const workload = [
    { name: "Aminata", detail: "Direction & fournisseurs", percentage: 82 },
    { name: "Fanta", detail: "Campagne de lancement", percentage: 64 },
    { name: "Kossi", detail: "Prévisionnel financier", percentage: 38 }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
      <AppSidebar activePage="team" />

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
          
          {/* Header Title Section */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Équipe</p>
              <h1 className="text-3xl font-extrabold text-[#1E2923] leading-tight max-w-xl">
                Les bons talents, alignés sur le même cap.
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Clarifie les rôles, répartis la charge et garde les responsabilités visibles.
              </p>
            </div>
            
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#E69D00] hover:bg-[#d18e00] text-[#1E2923] text-xs font-semibold rounded-xl shadow-sm transition-colors">
              <Plus size={16} />
              Inviter
            </button>
          </div>

          {/* TEAM MEMBERS CARDS GRID */}
          <div className="grid grid-cols-3 gap-6">
            {members.map((member, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-[#E8E2D5]/50 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-56 w-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base text-[#1E2923]">{member.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{member.role}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-[#F3EFE6] flex justify-between items-center text-xs">
                  <span className="text-gray-400">Charge active</span>
                  <span className="font-bold text-[#1E2923]">{member.charge}</span>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM CARD: Répartition de la semaine */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5]/50 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-[#1E2923]">Répartition de la semaine</h3>
            
            <div className="space-y-4">
              {workload.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <p className="text-gray-700">
                      <span className="font-bold text-[#1E2923]">{item.name}</span> · {item.detail}
                    </p>
                    <span className="font-bold text-[#1E2923]">{item.percentage}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-[#F3EFE6] rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
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
