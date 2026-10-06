import { useState } from 'react';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, Check, Save } from 'lucide-react';

const PROJECT_DATA_KEY = 'nexusHubProjectData';
const DEFAULT_FORM_DATA = {
  description:
    'MomoFood rend les repas maison accessibles en moins de 30 minutes dans les quartiers actifs de Lomé.',
  secteur: 'Food & livraison',
  pays: 'Togo',
  budget: '750 000 FCFA',
  objectif: '100 commandes / mois',
};

function loadFormState() {
  try {
    const savedData = window.localStorage.getItem(PROJECT_DATA_KEY);
    if (!savedData) return { formData: DEFAULT_FORM_DATA, isSaved: false };

    const parsedData = JSON.parse(savedData);
    if (!parsedData || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
      return { formData: DEFAULT_FORM_DATA, isSaved: false };
    }

    return { formData: { ...DEFAULT_FORM_DATA, ...parsedData }, isSaved: true };
  } catch {
    return { formData: DEFAULT_FORM_DATA, isSaved: false };
  }
}

export function ProjectPage() {
  const [formState, setFormState] = useState(loadFormState);
  const { formData, isSaved } = formState;

  function updateField(field, value) {
    setFormState((previousState) => ({
      formData: { ...previousState.formData, [field]: value },
      isSaved: false,
    }));
  }

  function handleSave() {
    window.localStorage.setItem(PROJECT_DATA_KEY, JSON.stringify(formData));
    setFormState((previousState) => ({ ...previousState, isSaved: true }));
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
        <AppSidebar activePage="project" />

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
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          {/* HEADER PAGE MON PROJET */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                MON PROJET
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Une vision claire, de l'idée à la croissance.
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                {formData.description}
              </p>
            </div>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-[#FFB800] hover:bg-[#E0A200] text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 self-start shadow-sm"
            >
              {isSaved ? <Check size={16} strokeWidth={2.5} /> : <Save size={16} />}
              {isSaved ? 'Enregistré' : 'Enregistrer'}
            </Button>
          </div>

          {/* SECTION : CARTE D'IDENTITÉ & PHASE DÉTECTÉE */}
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Carte d'identité */}
            <Card className="lg:col-span-8 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-5">
              <h3 className="font-extrabold text-base text-gray-900">Carte d'identité</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 font-medium">Secteur</label>
                  <input
                    type="text"
                    value={formData.secteur}
                    onChange={(e) => updateField('secteur', e.target.value)}
                    className="w-full bg-[#F7F5F0] border-0 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#005C46] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 font-medium">Pays pilote</label>
                  <input
                    type="text"
                    value={formData.pays}
                    onChange={(e) => updateField('pays', e.target.value)}
                    className="w-full bg-[#F7F5F0] border-0 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#005C46] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 font-medium">Budget global</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => updateField('budget', e.target.value)}
                    className="w-full bg-[#F7F5F0] border-0 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#005C46] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 font-medium">Objectif</label>
                  <input
                    type="text"
                    value={formData.objectif}
                    onChange={(e) => updateField('objectif', e.target.value)}
                    className="w-full bg-[#F7F5F0] border-0 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#005C46] outline-none"
                  />
                </div>
              </div>
            </Card>

            {/* Phase détectée */}
            <Card className="lg:col-span-4 p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  PHASE DÉTECTÉE
                </p>
                <h3 className="text-2xl font-black text-[#00A86B]">Lancement</h3>
                <p className="text-xs text-gray-500 leading-relaxed pt-1">
                  Tu as déjà testé ton offre et prépares tes premières ventes régulières.
                </p>
              </div>

              {/* Étapes verticales */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00A86B] text-white flex items-center justify-center text-xs font-bold">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-xs font-bold text-gray-900">Idée validée</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00A86B] text-white flex items-center justify-center text-xs font-bold">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-xs font-bold text-gray-900">Offre structurée</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FF9900] text-white flex items-center justify-center text-xs font-extrabold">
                    3
                  </span>
                  <span className="text-xs font-bold text-gray-900">Premiers clients</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span className="text-xs font-semibold text-gray-400">Croissance</span>
                </div>
              </div>
            </Card>
          </div>

          {/* SECTION : BUSINESS MODEL CANVAS */}
          <Card className="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-gray-900">Business Model Canvas</h3>
              <span className="text-xs text-gray-400 font-medium">7/9 blocs complétés</span>
            </div>

            {/* Grille BMC */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ligne 1 */}
              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-1">
                <p className="text-[11px] font-bold text-gray-900">Proposition de valeur</p>
                <p className="text-xs text-gray-500">Repas maison livrés en 30 min</p>
              </div>

              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-1">
                <p className="text-[11px] font-bold text-gray-900">Segments clients</p>
                <p className="text-xs text-gray-500">Actifs de 22 à 40 ans</p>
              </div>

              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-1">
                <p className="text-[11px] font-bold text-gray-900">Canaux</p>
                <p className="text-xs text-gray-500">WhatsApp, Instagram, bouche-à-oreille</p>
              </div>

              {/* Ligne 2 */}
              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-1">
                <p className="text-[11px] font-bold text-gray-900">Relations clients</p>
                <p className="text-xs text-gray-500">Suivi personnel et fidélité</p>
              </div>

              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-1">
                <p className="text-[11px] font-bold text-gray-900">Revenus</p>
                <p className="text-xs text-gray-500">Commandes et abonnements</p>
              </div>

              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-1">
                <p className="text-[11px] font-bold text-gray-900">Ressources clés</p>
                <p className="text-xs text-gray-500">Cuisine, livreurs, recettes</p>
              </div>

              {/* Ligne 3 */}
              <div className="p-4 bg-[#F7F5F0] rounded-2xl space-y-1">
                <p className="text-[11px] font-bold text-gray-900">Activités clés</p>
                <p className="text-xs text-gray-500">Préparation et livraison</p>
              </div>

              <div className="p-4 bg-transparent border border-dashed border-gray-300 rounded-2xl space-y-1 flex flex-col justify-center">
                <p className="text-[11px] font-bold text-gray-800">Partenaires</p>
                <p className="text-xs text-gray-400">À compléter</p>
              </div>

              <div className="p-4 bg-transparent border border-dashed border-gray-300 rounded-2xl space-y-1 flex flex-col justify-center">
                <p className="text-[11px] font-bold text-gray-800">Structure de coûts</p>
                <p className="text-xs text-gray-400">À compléter</p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
