import React from 'react';
import { 
  Plus, 
  MessageSquare,
  LayoutDashboard,
  Folder,
  Kanban,
  CreditCard,
  Compass,
  Users,
  BarChart3,
  Globe,
  Bell
} from 'lucide-react';

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
    <div className="flex min-h-screen bg-[#F8F5EE] text-[#1E2923] font-sans">
      
      {/* SIDEBAR LEFT */}
      <aside className="w-64 border-r border-[#E8E2D5] p-6 flex flex-col justify-between bg-[#F8F5EE]">
        <div>
          {/* Logo & Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#1E2923] text-white flex items-center justify-center font-bold text-lg">
              N
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Nexus Hub</h1>
              <p className="text-xs text-gray-500">Votre cap entrepreneurial</p>
            </div>
          </div>

          {/* Active Project */}
          <div className="mb-8">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Projet actif</p>
            <h2 className="font-bold text-base">MomoFood</h2>
            <p className="text-xs text-gray-500 mb-2">Resto-livraison · Lomé</p>
            <span className="inline-block px-2.5 py-0.5 text-[11px] bg-emerald-100 text-emerald-700 rounded-full font-medium">
              Phase · Lancement
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard size={18} />} label="Vue d'ensemble" />
            <NavItem icon={<Folder size={18} />} label="Mon projet" />
            <NavItem icon={<Kanban size={18} />} label="Organisation" />
            <NavItem icon={<CreditCard size={18} />} label="Finance" />
            <NavItem icon={<Compass size={18} />} label="Stratégie" />
            <NavItem icon={<Users size={18} />} label="Équipe" active />
            <NavItem icon={<BarChart3 size={18} />} label="Performance" />
            <NavItem icon={<Globe size={18} />} label="Réseau" />
          </nav>
        </div>

        {/* Copilot Card */}
        <div className="bg-[#1E2923] text-white p-4 rounded-2xl space-y-3">
          <p className="text-xs text-gray-300">Besoin d'un éclairage ?</p>
          <p className="text-sm font-semibold leading-snug">Demandez à votre copilote.</p>
          <button className="w-full py-2 bg-[#E69D00] hover:bg-[#d18e00] text-[#1E2923] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors">
            <MessageSquare size={14} />
            Discuter
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col">
        
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
        <div className="px-10 py-4 flex-1 max-w-6xl space-y-6">
          
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
  );
}

{/* Helper component for Nav Items */}
function NavItem({ icon, label, active = false }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
        active 
          ? 'bg-[#1E2923] text-white' 
          : 'text-gray-600 hover:bg-[#E8E2D5]/40 hover:text-[#1E2923]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}