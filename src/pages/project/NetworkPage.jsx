import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { Search, ChevronRight, DollarSign, Bell, CalendarDays, Clock3, X, Check } from 'lucide-react';

export default function NetworkPage() {
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [sessionRequested, setSessionRequested] = useState(false);
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');

  const today = new Date();
  const minSessionDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  function handleSessionSubmit(event) {
    event.preventDefault();
    setSessionRequested(true);
  }

  const opportunities = [
    {
      title: "Fonds Jeunes Entrepreneurs Togo",
      subtitle: "Financement · Jusqu'à 2 500 000 FCFA",
      match: "92 % compatible"
    },
    {
      title: "Programme AgriFood Lomé",
      subtitle: "Incubation · Candidature avant le 28 sept.",
      match: "86 % compatible"
    },
    {
      title: "Masterclass acquisition locale",
      subtitle: "Formation · En ligne · 2 heures",
      match: "Recommandée"
    }
  ];

  const nearbyEntrepreneurs = [
    {
      name: "Fanta · Kora Bio",
      sector: "Agroalimentaire · Lomé",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80"
    },
    {
      name: "Aminata · Atelier 228",
      sector: "Commerce · Lomé",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      name: "Komlan · Livré Vite",
      sector: "Logistique · Lomé",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
      <AppSidebar activePage="network" />

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
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Réseau</p>
              <h1 className="text-3xl font-extrabold text-[#1E2923] leading-tight max-w-xl">
                Les bonnes connexions accélèrent les bons projets.
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Mentors, financements et programmes sélectionnés selon ton secteur, ton pays et ta phase.
              </p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E2D5] rounded-xl text-xs font-semibold text-[#1E2923] shadow-sm hover:bg-gray-50 transition-colors">
              <Search size={15} />
              Explorer
            </button>
          </div>

          {/* TWO MAIN CARDS GRID */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* RECOMMENDED MENTOR CARD */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5]/50 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" 
                  alt="Kossi Diabaté" 
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div>
                  <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider rounded-md mb-2">
                    Mentor recommandé
                  </span>
                  <h3 className="font-bold text-lg text-[#1E2923]">Kossi Diabaté</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Finance · Restauration · 12 ans d'expérience
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Dialog.Root
                  open={isSessionDialogOpen}
                  onOpenChange={(isOpen) => {
                    setIsSessionDialogOpen(isOpen);
                    if (isOpen) setSessionRequested(false);
                  }}
                >
                  <Dialog.Trigger asChild>
                    <button className="w-full py-3 bg-[#E69D00] hover:bg-[#d18e00] text-[#1E2923] text-xs font-bold rounded-xl transition-colors" type="button">
                      Planifier une session
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-40 bg-[#18181B]/45 backdrop-blur-[1px]" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[#E8E2D5] bg-white p-6 shadow-xl focus:outline-none sm:p-7">
                      {sessionRequested ? (
                        <div className="py-4 text-center">
                          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <Check aria-hidden="true" size={22} />
                          </span>
                          <Dialog.Title className="mt-4 text-lg font-bold text-[#1E2923]">Demande envoyée</Dialog.Title>
                          <Dialog.Description className="mt-2 text-sm leading-relaxed text-gray-500">
                            Ta demande de session avec Kossi Diabaté est prête. Il pourra confirmer le créneau choisi.
                          </Dialog.Description>
                          <button
                            className="mt-6 w-full rounded-xl bg-[#E69D00] px-4 py-3 text-sm font-bold text-[#1E2923] transition-colors hover:bg-[#d18e00]"
                            onClick={() => setIsSessionDialogOpen(false)}
                            type="button"
                          >
                            Fermer
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Dialog.Title className="text-lg font-bold text-[#1E2923]">Planifier une session</Dialog.Title>
                              <Dialog.Description className="mt-1 text-sm text-gray-500">
                                Choisis un créneau pour échanger avec ton mentor.
                              </Dialog.Description>
                            </div>
                            <Dialog.Close asChild>
                              <button aria-label="Fermer" className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900" type="button">
                                <X aria-hidden="true" size={18} />
                              </button>
                            </Dialog.Close>
                          </div>

                          <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#F8F5EE] p-3">
                            <img
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                              alt=""
                              className="h-11 w-11 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold text-[#1E2923]">Kossi Diabaté</p>
                              <p className="text-xs text-gray-500">Finance · Restauration · 12 ans d'expérience</p>
                            </div>
                          </div>

                          <form className="mt-5 space-y-4" onSubmit={handleSessionSubmit}>
                            <label className="block space-y-1.5">
                              <span className="text-sm font-semibold text-gray-800">Date souhaitée</span>
                              <span className="relative block">
                                <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                  className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                                  min={minSessionDate}
                                  onChange={(event) => setSessionDate(event.target.value)}
                                  required
                                  type="date"
                                  value={sessionDate}
                                />
                              </span>
                            </label>

                            <label className="block space-y-1.5">
                              <span className="text-sm font-semibold text-gray-800">Heure souhaitée</span>
                              <span className="relative block">
                                <Clock3 aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                  className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                                  onChange={(event) => setSessionTime(event.target.value)}
                                  required
                                  type="time"
                                  value={sessionTime}
                                />
                              </span>
                            </label>

                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                              <Dialog.Close asChild>
                                <button className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50" type="button">
                                  Annuler
                                </button>
                              </Dialog.Close>
                              <button className="rounded-lg bg-[#E69D00] px-4 py-2.5 text-sm font-bold text-[#1E2923] transition-colors hover:bg-[#d18e00]" type="submit">
                                Envoyer la demande
                              </button>
                            </div>
                          </form>
                        </>
                      )}
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            </div>

            {/* OPPORTUNITIES CARD */}
            <div className="col-span-2 bg-white rounded-3xl p-6 border border-[#E8E2D5]/50 shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-base text-[#1E2923]">Opportunités pour MomoFood</h3>
                <span className="text-xs text-gray-400">3 correspondances</span>
              </div>

              <div className="space-y-3">
                {opportunities.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#F8F5EE] hover:bg-[#f3efe4] rounded-2xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        <DollarSign size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1E2923]">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                      <span>{item.match}</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ENTREPRENEURS NEARBY CARD */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5]/50 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#1E2923]">Entrepreneurs à proximité</h3>
            
            <div className="grid grid-cols-3 gap-4">
              {nearbyEntrepreneurs.map((item, idx) => (
                <div key={idx} className="bg-[#F8F5EE] p-4 rounded-2xl flex items-center gap-3 hover:bg-[#f3efe4] transition-colors cursor-pointer">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[#1E2923]">{item.name}</h4>
                    <p className="text-[11px] text-gray-400">{item.sector}</p>
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
