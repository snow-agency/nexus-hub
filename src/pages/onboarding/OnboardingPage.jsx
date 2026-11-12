import { useState } from 'react';
import { ArrowRight, Building2, Globe2, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, getApiErrorMessage } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProject } from '../../context/ProjectContext.jsx';

const STAGES = [
  { value: 'idee', label: 'Idée / validation', description: 'Je teste encore mon idée.' },
  { value: 'lancement', label: 'Lancement', description: 'Je lance mon activité.' },
  { value: 'croissance', label: 'Croissance', description: 'Je fais grandir ce qui existe déjà.' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshProjects } = useProject();

  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [country, setCountry] = useState('');
  const [stage, setStage] = useState('idee');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/onboarding', { name, sector, country, stage });
      await refreshProjects();
      navigate('/dashboard', { replace: true });
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-light font-sans text-dark">
      <header className="mx-auto flex w-full max-w-6xl items-center gap-3 px-5 py-4 sm:px-8">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark text-sm font-bold text-white">
          N
        </span>
        <span className="text-sm font-semibold">Nexus Hub</span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <section className="w-full max-w-[460px] rounded-xl border border-bg-light bg-white p-6 shadow-[0_8px_20px_rgba(37,37,25,0.08)] sm:p-8">
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1 text-[10px] font-semibold text-accent-hover">
              <Rocket aria-hidden="true" size={12} />
              Premier projet
            </span>

            <h1 className="mt-4 text-2xl font-bold leading-tight">
              {user?.name ? `Bienvenue, ${user.name.split(' ')[0]}.` : 'Bienvenue.'}
            </h1>

            <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
              Décris ton projet en quelques champs — Nexus Hub s'en servira pour suivre ta
              progression, ton budget et te proposer la bonne action au bon moment.
            </p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-gray-800">Nom du projet</span>
              <input
                autoFocus
                className="h-11 w-full rounded-xl border border-bg-light bg-bg-light px-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex. MomoFood"
                required
                value={name}
              />
            </label>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-gray-800">Secteur</span>
                <span className="relative block">
                  <Building2
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={15}
                  />
                  <input
                    className="h-11 w-full rounded-xl border border-bg-light bg-bg-light pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    onChange={(event) => setSector(event.target.value)}
                    placeholder="Ex. Restauration"
                    required
                    value={sector}
                  />
                </span>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-gray-800">Pays</span>
                <span className="relative block">
                  <Globe2
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={15}
                  />
                  <input
                    className="h-11 w-full rounded-xl border border-bg-light bg-bg-light pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    onChange={(event) => setCountry(event.target.value)}
                    placeholder="Ex. Togo"
                    required
                    value={country}
                  />
                </span>
              </label>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-800">Où en es-tu ?</span>
              <div className="grid gap-2 sm:grid-cols-3">
                {STAGES.map((item) => (
                  <button
                    className={`rounded-xl border p-3 text-left text-xs transition-colors ${
                      stage === item.value
                        ? 'border-primary bg-primary/10 font-semibold text-primary'
                        : 'border-bg-light bg-bg-light text-gray-600 hover:border-primary/40'
                    }`}
                    key={item.value}
                    onClick={() => setStage(item.value)}
                    type="button"
                  >
                    <p className="font-bold">{item.label}</p>
                    <p className="mt-0.5 text-[10px] text-gray-500">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p aria-live="polite" className="text-xs font-medium text-red-700">
                {error}
              </p>
            )}

            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-dark shadow-sm transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Création...' : 'Créer mon projet'}
              {!isLoading && <ArrowRight aria-hidden="true" size={15} />}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
