import { createElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  Briefcase,
  Coins,
  Globe,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '../ui/Button.jsx'

const AUTH_STORAGE_KEY = 'nexusHubAuthenticated'

const navigationItems = [
  { id: 'dashboard', label: "Vue d'ensemble", icon: LayoutDashboard, to: '/dashboard' },
  { id: 'project', label: 'Mon projet', icon: Briefcase, to: '/project' },
  { id: 'organization', label: 'Organisation', icon: Layers, to: '/organization' },
  { id: 'finance', label: 'Finance', icon: Coins, to: '/finance' },
  { label: 'Stratégie', icon: Target },
  { label: 'Équipe', icon: Users },
  { label: 'Performance', icon: TrendingUp },
  { label: 'Réseau', icon: Globe },
]

export function AppSidebar({ activePage }) {
  const navigate = useNavigate()

  function handleLogout() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    navigate('/auth', { replace: true })
  }

  return (
    <aside className="w-64 flex-shrink-0 flex-col justify-between hidden lg:flex border-r border-gray-300/70 pr-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18181B] text-base font-bold text-white">
            N
          </div>
          <div>
            <h1 className="text-base font-extrabold leading-tight text-gray-900">Nexus Hub</h1>
            <p className="text-[11px] text-gray-500">Votre cap entrepreneurial</p>
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <p className="text-[11px] font-medium text-gray-400">Projet actif</p>
          <h2 className="text-lg font-extrabold leading-tight text-gray-900">MomoFood</h2>
          <p className="text-xs text-gray-500">Resto-livraison · Lomé</p>
          <div className="pt-2">
            <span className="inline-block rounded-full bg-[#E6F4EA] px-3 py-1 text-[11px] font-semibold text-[#005C46]">
              Phase · Lancement
            </span>
          </div>
        </div>

        <nav aria-label="Navigation principale" className="space-y-1 pt-2">
          {navigationItems.map(({ id, label, icon, to }) => {
            const isActive = id === activePage
            const className = `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-[#18181B] font-semibold text-white'
                : 'font-medium text-gray-600 hover:bg-black/5'
            }`
            const contents = (
              <>
                {createElement(icon, { size: 18 })}
                <span>{label}</span>
              </>
            )

            return to ? (
              <Link
                key={id}
                aria-current={isActive ? 'page' : undefined}
                className={className}
                to={to}
              >
                {contents}
              </Link>
            ) : (
              <a key={label} className={className} href="#">
                {contents}
              </a>
            )
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="space-y-3 rounded-2xl bg-[#18181B] p-5 text-white">
          <p className="text-[11px] text-gray-400">Besoin d'un éclairage ?</p>
          <p className="text-sm font-extrabold leading-snug">Demandez à votre copilote.</p>
          <Button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB800] py-2.5 text-xs font-bold text-black hover:bg-[#E0A200]">
            <MessageCircle size={15} /> Discuter
          </Button>
        </div>

        <button
          aria-label="Se déconnecter"
          className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-black/5"
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
