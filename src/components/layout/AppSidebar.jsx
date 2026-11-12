import { createElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProject } from '../../context/ProjectContext.jsx';
import {
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
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';

const navigationItems = [
  { id: 'dashboard', label: "Vue d'ensemble", icon: LayoutDashboard, to: '/dashboard' },
  { id: 'project', label: 'Mon projet', icon: Briefcase, to: '/project' },
  { id: 'organization', label: 'Organisation', icon: Layers, to: '/organization' },
  { id: 'finance', label: 'Finance', icon: Coins, to: '/finance' },
  { id: 'strategy', label: 'Stratégie', icon: Target, to: '/strategy' },
  { id: 'team', label: 'Équipe', icon: Users, to: '/team' },
  { id: 'performance', label: 'Performance', icon: TrendingUp, to: '/performance' },
  { id: 'network', label: 'Réseau', icon: Globe, to: '/network' },
];

const PHASE_LABELS = {
  IDEE_VALIDATION: 'Idée · Validation',
  LANCEMENT: 'Lancement',
  CROISSANCE: 'Croissance',
};

export function AppSidebar({ activePage }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { currentProject } = useProject();

  function handleLogout() {
    logout();
    navigate('/auth', { replace: true });
  }

  return (
    <aside className="w-64 flex-shrink-0 flex-col justify-between hidden lg:flex border-r border-gray-300/70 pr-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dark text-base font-bold text-white">
            N
          </div>
          <div>
            <h1 className="text-base font-extrabold leading-tight text-gray-900">Nexus Hub</h1>
            <p className="text-[11px] text-gray-500">Votre cap entrepreneurial</p>
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <p className="text-[11px] font-medium text-gray-400">Projet actif</p>
          <h2 className="text-lg font-extrabold leading-tight text-gray-900">
            {currentProject?.name ?? '—'}
          </h2>
          <p className="text-xs text-gray-500">
            {[currentProject?.sector, currentProject?.country].filter(Boolean).join(' · ')}
          </p>
          {currentProject && (
            <div className="pt-2">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                Phase · {PHASE_LABELS[currentProject.phase] ?? currentProject.phase}
              </span>
            </div>
          )}
        </div>

        <nav aria-label="Navigation principale" className="space-y-1 pt-2">
          {navigationItems.map(({ id, label, icon, to }) => {
            const isActive = id === activePage;
            const className = `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-dark font-semibold text-white'
                : 'font-medium text-gray-600 hover:bg-black/5'
            }`;
            const contents = (
              <>
                {createElement(icon, { size: 18 })}
                <span>{label}</span>
              </>
            );

            return (
              <Link
                key={id}
                aria-current={isActive ? 'page' : undefined}
                className={className}
                to={to}
              >
                {contents}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="space-y-3 rounded-2xl bg-dark p-5 text-white">
          <p className="text-[11px] text-gray-400">Besoin d'un éclairage ?</p>
          <p className="text-sm font-extrabold leading-snug">Demandez à votre copilote.</p>
          <Button className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-xs font-bold text-black hover:bg-accent-hover">
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
  );
}
