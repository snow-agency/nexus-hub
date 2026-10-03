
import { useState } from 'react';
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, Sparkles, UserRound, } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register(name, email, password);

      await login(email, password, true);

      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError( error.response?.data?.error || 'Une erreur est survenue. Veuillez réessayer.', );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5F0] font-sans text-[#1D2B27]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link aria-label="Nexus Hub, accueil" className="flex items-center gap-2" to="/" >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#17352B] text-sm font-bold text-white"> N </span>
          <span className="text-sm font-semibold">Nexus Hub</span>
        </Link>

        <p className="text-xs text-gray-600">
          Déjà un compte?{' '}
          <Link className="font-semibold text-[#C47B00] hover:underline" to="/auth" > Se connecter </Link>
        </p>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <section className="w-full max-w-[420px] rounded-xl border border-[#E9E4DA] bg-white p-6 shadow-[0_8px_20px_rgba(37,37,25,0.08)] sm:p-8">
          <div className="mb-5">
            <Link className="inline-flex items-center gap-1 text-xs text-gray-600 transition-colors hover:text-[#005C46]" to="/" >
              <ArrowLeft aria-hidden="true" size={14} />
              Retour à l’accueil
            </Link>

            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#EAF5EE] px-2.5 py-1 text-[10px] font-semibold text-[#278458]">
              <Sparkles aria-hidden="true" size={12} />
              Créer votre espace
            </span>

            <h1 className="mt-3 text-2xl font-bold leading-tight"> Votre projet commence ici. </h1>

            <p className="mt-1.5 text-xs leading-relaxed text-[#718078]"> Créez votre compte pour organiser vos priorités et faire avancer votre projet. </p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-gray-800"> Nom complet </span>

              <span className="relative block">
                <UserRound aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />

                <input
                  autoComplete="name"
                  className="h-11 w-full rounded-xl border border-[#E8E1D5] bg-[#FAF7F1] pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                  minLength={2}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError('');
                  }}
                  placeholder="Aminata Diallo"
                  required
                  type="text"
                  value={name}
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-gray-800"> Adresse e-mail </span>

              <span className="relative block">
                <Mail aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />

                <input
                  autoComplete="email"
                  className="h-11 w-full rounded-xl border border-[#E8E1D5] bg-[#FAF7F1] pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError('');
                  }}
                  placeholder="aminata@mafood.tg"
                  required
                  type="email"
                  value={email}
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-gray-800"> Mot de passe </span>

              <span className="relative block">
                <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />

                <input
                  autoComplete="new-password"
                  className="h-11 w-full rounded-xl border border-[#E8E1D5] bg-[#FAF7F1] pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                  minLength={8}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  placeholder="8 caractères minimum"
                  required
                  type="password"
                  value={password}
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-gray-800"> Confirmer le mot de passe </span>

              <span className="relative block">
                <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />

                <input
                  autoComplete="new-password"
                  className="h-11 w-full rounded-xl border border-[#E8E1D5] bg-[#FAF7F1] pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10"
                  onChange={(event) => {
                    setPasswordConfirmation(event.target.value);
                    setError('');
                  }}
                  placeholder="Répétez votre mot de passe"
                  required
                  type="password"
                  value={passwordConfirmation}
                />
              </span>
            </label>

            {error && (
              <p
                aria-live="polite"
                className="text-xs font-medium text-red-700"
              >
                {error}
              </p>
            )}

            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#F5A000] px-4 text-sm font-medium text-[#14241E] shadow-sm transition-colors hover:bg-[#E39600] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
              {!isLoading && <ArrowRight aria-hidden="true" size={15} />}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

