import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, Sparkles } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5F0] font-sans text-[#1D2B27]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="/" aria-label="Nexus Hub, accueil" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#17352B] text-sm font-bold text-white">
            N
          </span>
          <span className="text-sm font-semibold">Nexus Hub</span>
        </a>
        <p className="text-xs text-gray-600">
          Pas encore de compte?{' '}
          <a href="/#inscription" className="font-semibold text-[#C47B00] hover:underline">
            Créer un compte
          </a>
        </p>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-[388px] rounded-xl border border-[#E9E4DA] bg-white p-6 shadow-[0_8px_20px_rgba(37,37,25,0.08)] sm:p-8">
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF5EE] px-2.5 py-1 text-[10px] font-semibold text-[#278458]">
              <Sparkles size={12} />
              Maquette
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight">Bon retour.</h1>
            <p className="mt-1.5 text-xs leading-relaxed text-[#718078]">
              Connectez-vous pour retrouver votre cap, vos tâches et votre budget.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Adresse e-mail"
              leadingIcon={Mail}
              type="email"
              autoComplete="email"
              placeholder="aminata@mafood.tg"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              required
            />

            <Input
              label="Mot de passe"
              leadingIcon={LockKeyhole}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              required
            />

            <div className="flex items-center justify-between gap-3 pt-0.5 text-[10px]">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-3.5 w-3.5 accent-[#F5A000]"
                />
                Se souvenir de moi
              </label>
              <a href="#mot-de-passe-oublie" className="text-gray-500 hover:text-[#005C46]">
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" variant="login" className="justify-center gap-2">
              Se connecter <ArrowRight size={15} />
            </Button>
          </form>
        </Card>
      </main>
    </div>
  )
}
