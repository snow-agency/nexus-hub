import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { Plus, Bell, X } from 'lucide-react';

export default function TeamPage() {
  const [members, setMembers] = useState([
    {
      id: 'aminata',
      name: "Aminata Dossou",
      role: "Fondatrice · Direction",
      charge: "7 tâches",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 'fanta',
      name: "Fanta Mensah",
      role: "Croissance · Marketing",
      charge: "5 tâches",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 'kossi',
      name: "Kossi Adjakpa",
      role: "Mentor · Finance",
      charge: "2 suivis",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
    }
  ]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Membre de l’équipe');
  const [inviteError, setInviteError] = useState('');

  const workload = [
    { name: "Aminata", detail: "Direction & fournisseurs", percentage: 82 },
    { name: "Fanta", detail: "Campagne de lancement", percentage: 64 },
    { name: "Kossi", detail: "Prévisionnel financier", percentage: 38 }
  ];

  function handleInvite(event) {
    event.preventDefault();

    const email = inviteEmail.trim().toLowerCase();
    const alreadyInvited = members.some((member) => member.email === email);
    if (alreadyInvited) {
      setInviteError('Une invitation existe déjà pour cette adresse.');
      return;
    }

    setMembers((currentMembers) => [
      ...currentMembers,
      {
        id: email,
        name: inviteName.trim(),
        email,
        role: inviteRole,
        charge: 'Invitation en attente',
        image: null,
        pending: true,
      },
    ]);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Membre de l’équipe');
    setInviteError('');
    setIsInviteOpen(false);
  }

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
            
            <Dialog.Root open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 rounded-xl bg-[#E69D00] px-5 py-2.5 text-xs font-semibold text-[#1E2923] shadow-sm transition-colors hover:bg-[#d18e00]" type="button">
                  <Plus size={16} />
                  Inviter
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-[#18181B]/40 backdrop-blur-[1px]" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[#E8E2D5] bg-white p-6 shadow-xl focus:outline-none sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="text-lg font-extrabold text-[#1E2923]">Inviter un membre</Dialog.Title>
                      <Dialog.Description className="mt-1 text-sm text-gray-500">
                        Ajoute une personne à l’équipe et précise son rôle.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button aria-label="Fermer" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900" type="button">
                        <X aria-hidden="true" size={18} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <form className="mt-6 space-y-4" onSubmit={handleInvite}>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Nom complet</span>
                      <input
                        autoFocus
                        autoComplete="name"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                        minLength={2}
                        onChange={(event) => { setInviteName(event.target.value); setInviteError(''); }}
                        placeholder="Ex. Ama Mensah"
                        required
                        value={inviteName}
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Adresse e-mail</span>
                      <input
                        autoComplete="email"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                        onChange={(event) => { setInviteEmail(event.target.value); setInviteError(''); }}
                        placeholder="ama@exemple.com"
                        required
                        type="email"
                        value={inviteEmail}
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-gray-800">Rôle</span>
                      <select
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                        onChange={(event) => setInviteRole(event.target.value)}
                        value={inviteRole}
                      >
                        <option>Membre de l’équipe</option>
                        <option>Direction</option>
                        <option>Marketing</option>
                        <option>Opérations</option>
                        <option>Finance</option>
                        <option>Mentor</option>
                      </select>
                    </label>

                    {inviteError && <p aria-live="polite" className="text-sm font-medium text-red-700">{inviteError}</p>}

                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                      <Dialog.Close asChild>
                        <button className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50" type="button">
                          Annuler
                        </button>
                      </Dialog.Close>
                      <button className="rounded-lg bg-[#E69D00] px-4 py-2.5 text-sm font-bold text-[#1E2923] hover:bg-[#d18e00]" type="submit">
                        Ajouter à l’équipe
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          {/* TEAM MEMBERS CARDS GRID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white rounded-3xl overflow-hidden border border-[#E8E2D5]/50 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-56 w-full overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#F3EFE6] text-[#1E2923]">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold text-[#005C46]">
                          {member.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-800">Invitation en attente</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base text-[#1E2923]">{member.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{member.role}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-[#F3EFE6] flex justify-between items-center gap-3 text-xs">
                  <span className="text-gray-400">{member.pending ? member.email : 'Charge active'}</span>
                  <span className="font-bold text-[#1E2923]">{member.charge}</span>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM CARD: Répartition de la semaine */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5]/50 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-[#1E2923]">Répartition de la semaine</h3>
            
            <div className="space-y-4">
              {workload.map((item) => (
                <div key={item.name} className="space-y-1.5">
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