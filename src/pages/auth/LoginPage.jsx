import { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AUTH_STORAGE_KEY = 'nexusHubAuthenticated';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;
    storage.setItem(AUTH_STORAGE_KEY, 'true');
    otherStorage.removeItem(AUTH_STORAGE_KEY);

    navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5F0] font-sans text-[#1D2B27]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3 sm:gap-5">
          <a aria-label="Nexus Hub, accueil" className="flex items-center gap-2" href="/">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#17352B] text-sm font-bold text-white">
              N
            </span>
            <span className="text-sm font-semibold">Nexus Hub</span>
          </a>
        </div>
        <p className="text-xs text-gray-600">
          Pas encore de compte?{' '}
          <Link className="font-semibold text-[#C47B00] hover:underline" to="/register">
            Créer un compte
          </Link>
        </p>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <section className="w-full max-w-[388px] rounded-xl border border-[#E9E4DA] bg-white p-6 shadow-[0_8px_20px_rgba(37,37,25,0.08)] sm:p-8">
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF5EE] px-2.5 py-1 text-[10px] font-semibold text-[#278458]">
              <Sparkles aria-hidden="true" size={12} />
              Maquette
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight">Bon retour.</h1>
            <p className="mt-1.5 text-xs leading-relaxed text-[#718078]">
              Connectez-vous pour retrouver votre cap, vos tâches et votre budget.
            </p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-gray-800">Adresse e-mail</span>
              <span className="relative block">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={15}
                />
                <input
                  autoComplete="email"
                  className="h-11 w-full rounded-xl border border-[#E8E1D5] bg-[#FAF7F1] pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="aminata@mafood.tg"
                  required
                  type="email"
                  value={email}
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-gray-800">Mot de passe</span>
              <span className="relative block">
                <LockKeyhole
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={15}
                />
                <input
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl border border-[#E8E1D5] bg-[#FAF7F1] pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                />
              </span>
            </label>

            <div className="flex items-center justify-between gap-3 pt-0.5 text-[10px]">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  checked={rememberMe}
                  className="h-3.5 w-3.5 accent-[#F5A000]"
                  onChange={(event) => setRememberMe(event.target.checked)}
                  type="checkbox"
                />
                Se souvenir de moi
              </label>
              <a className="text-gray-500 hover:text-[#005C46]" href="#mot-de-passe-oublie">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#F5A000] px-4 text-sm font-medium text-[#14241E] shadow-sm transition-colors hover:bg-[#E39600]"
              type="submit"
            >
              Se connecter <ArrowRight aria-hidden="true" size={15} />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
