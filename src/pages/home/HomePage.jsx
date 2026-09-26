import { Button } from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle,
  ChartNoAxesColumnIncreasing,
  Handshake,
  Lightbulb,
  Network,
  ShieldCheck,
  Target,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'

export function HomePage() {
  const spaces = [
    { icon: BriefcaseBusiness, title: 'Mon projet', description: 'Gardez le cap sur vos priorités.' },
    { icon: Users, title: 'Mon équipe', description: 'Faites avancer les bonnes personnes.' },
    { icon: Target, title: 'Ma stratégie', description: 'Transformez votre vision en actions.' },
    { icon: Wallet, title: 'Mes finances', description: 'Suivez vos chiffres avec clarté.' },
    { icon: ChartNoAxesColumnIncreasing, title: 'Performance', description: 'Mesurez vos progrès simplement.' },
    { icon: Network, title: 'Mon réseau', description: 'Trouvez les bons relais de croissance.' },
    { icon: Lightbulb, title: 'Mes idées', description: 'Structurez vos prochaines étapes.' },
    { icon: Handshake, title: 'Mes opportunités', description: 'Passez des rencontres aux résultats.' },
  ]

  const connections = [
    { name: 'Aminata Diallo', role: 'Conseillère en stratégie', image: 'photo-1534528741775-53994a69daeb' },
    { name: 'Thomas N’Guessan', role: 'Entrepreneur', image: 'photo-1500648767791-00dcc994a43e' },
    { name: 'Mariam Traoré', role: 'Experte en financement', image: 'photo-1531123897727-8f129e1688ce' },
  ]

  return (
    <div className="bg-[#F7F5F0] min-h-screen text-gray-900 font-sans">
      {/* Navbar de la page d'accueil */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#005C46] text-white flex items-center justify-center font-bold text-sm">
            N
          </div>
          <span className="font-bold text-lg tracking-tight">Nexus Hub</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700 font-medium">
          <a href="#fonctionnalites" className="transition-colors hover:text-[#005C46]">Fonctionnalités</a>
          <a href="#services" className="transition-colors hover:text-[#005C46]">Services</a>
          <a href="#reseau" className="transition-colors hover:text-[#005C46]">Réseau</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="/auth" className="text-sm font-medium text-gray-700 hover:text-black px-3 py-2">
            Se connecter
          </a>
          <Button className="bg-[#FFB800] text-black hover:bg-[#E0A200] font-semibold text-sm px-5 py-2 rounded-lg">
            S'inscrire
          </Button>
        </div>
      </header>

      {/* BANNIÈRE HERO (Hero Section) */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Colonne de gauche: Texte & CTA */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-[#005C46] text-xs font-semibold">
            <ShieldCheck size={14} />
            <span>Simplicité & Efficacité</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            L'accompagnateur qui dit <span className="text-[#FFB800]">quoi faire</span> et <span className="text-[#005C46]">pourquoi</span>.
          </h1>

          <p className="text-gray-600 text-base leading-relaxed max-w-lg">
            Nexus Hub réunit stratégie, opérations et réseau dans un seul espace. Vous avancez sans jamais douter seul face à vos chiffres.
          </p>

          <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:gap-5">
            <Button variant="accent" className="w-full justify-between sm:w-[297px]">
              Explorer <ArrowRight size={22} />
            </Button>
            <Button variant="outline" className="w-full sm:w-[284px]">
              Voir les fonctionnalités
            </Button>
          </div>

          {/* Témoignage / Preuve sociale sous le bouton */}
          <div className="flex items-center gap-3 pt-4 text-xs text-gray-600">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-emerald-700 border-2 border-[#F7F5F0]"></div>
              <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-[#F7F5F0]"></div>
              <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#F7F5F0]"></div>
            </div>
            <span>Rejoint par de nombreux entrepreneurs en Afrique.</span>
          </div>
        </div>

        {/* Colonne de droite: Image Bannière */}
        <div className="relative">
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl border border-gray-200/60 aspect-[4/3] bg-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
              alt="Femme travaillant sur son projet Nexus Hub" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Forme décorative lumineuse en arrière-plan */}
          <div className="absolute -top-6 -right-6 w-72 h-72 bg-amber-200/50 rounded-full blur-3xl -z-0"></div>
          <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl -z-0"></div>
        </div>
      </section>

      {/* SECTION 3 PILIERS */}
      <section className="mx-auto max-w-7xl border-t border-gray-200/60 px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Un suivi clair, fluide et structuré</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">Trois piliers pour avancer sereinement</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#005C46] flex items-center justify-center mb-4">
              <CheckCircle size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Un parcours adapté à votre phase</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Selon votre étape de croissance, votre calendrier de tâches s'ajuste pour éviter la dispersion.
            </p>
          </Card>

          <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FFB800] flex items-center justify-center mb-4">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Une exécution continue</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Finies les indécisions : sachez exactement sur quoi concentrer vos efforts quotidiens.
            </p>
          </Card>

          <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#005C46] flex items-center justify-center mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Une seule vision Action</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Centralisez vos données opérationnelles et financières sans perte d'information.
            </p>
          </Card>
        </div>
      </section>

      <section id="services" className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <Card className="rounded-xl bg-[#17352B] p-7 text-white shadow-sm md:p-9">
          <span className="inline-flex rounded-full bg-[#FFB800] px-3 py-1 text-[10px] font-bold uppercase text-[#17352B]">
            Votre prochaine étape
          </span>
          <h2 className="mt-5 max-w-sm text-2xl font-bold leading-tight">
            Relancez votre projet et avancez sereinement.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            Un plan clair, des priorités adaptées et un accompagnement pour transformer vos idées en résultats.
          </p>
          <ul className="mt-5 space-y-2 text-xs text-white/85">
            <li className="flex items-center gap-2"><CheckCircle size={15} className="text-[#FFB800]" /> Un plan adapté à votre phase</li>
            <li className="flex items-center gap-2"><CheckCircle size={15} className="text-[#FFB800]" /> Des objectifs concrets à suivre</li>
            <li className="flex items-center gap-2"><CheckCircle size={15} className="text-[#FFB800]" /> Les bons conseils au bon moment</li>
          </ul>
          <a href="#fonctionnalites" className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#FFB800] px-5 py-3 text-sm font-semibold text-[#17352B] transition-colors hover:bg-[#E0A200]">
            Construire mon plan <ArrowRight size={16} />
          </a>
        </Card>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#005C46]">Un accompagnement qui avance avec vous</span>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
            Trois questions, une réponse claire.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
            Où en êtes-vous ? Quelle est la prochaine priorité ? Qui peut vous aider ? Nexus Hub rassemble les repères pour décider et agir.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ['01', 'Votre situation', 'Un diagnostic pour savoir où vous en êtes.'],
              ['02', 'Votre priorité', 'Une prochaine action, pas dix urgences.'],
              ['03', 'Vos ressources', 'Les outils et personnes utiles à votre projet.'],
              ['04', 'Vos progrès', 'Des indicateurs faciles à suivre.'],
            ].map(([number, title, description]) => (
              <Card key={number} className="rounded-lg border border-gray-200 bg-white p-4">
                <span className="text-[10px] font-bold text-[#005C46]">{number}</span>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="fonctionnalites" className="bg-white/55 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-8 max-w-xl text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Tout au même endroit</span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">Huit espaces, un seul cap</h2>
            <p className="mt-2 text-sm text-gray-600">Les outils essentiels pour faire grandir votre activité, réunis dans un parcours cohérent.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {spaces.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="rounded-lg border border-gray-200/80 bg-white p-4 transition-shadow hover:shadow-sm md:p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#005C46]">
                  <Icon size={18} />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="reseau" className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#005C46]">Grandir ensemble</span>
          <h2 className="mt-2 max-w-md text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
            Avancez avec les bonnes connexions.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-600">
            Échangez avec des entrepreneurs et des experts qui comprennent vos défis et peuvent vous aider à franchir une étape.
          </p>
          <div className="mt-6 space-y-3">
            {connections.map(({ name, role, image }) => (
              <Card key={name} className="flex items-center gap-3 rounded-lg border border-gray-200/80 bg-white p-3">
                <img
                  src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=96&q=80`}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
                  <p className="text-xs text-gray-600">{role}</p>
                </div>
                <ArrowRight className="ml-auto text-[#005C46]" size={16} />
              </Card>
            ))}
          </div>
        </div>
        <Card className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-[#A56C00]">
            <Handshake size={20} />
          </span>
          <h3 className="mt-5 text-xl font-bold text-gray-900">Le bon échange peut tout débloquer.</h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Trouvez un regard extérieur, partagez votre expérience et construisez des relations professionnelles utiles et durables.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-gray-700">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5">Mentorat</span>
            <span className="rounded-full bg-amber-50 px-3 py-1.5">Expertise</span>
            <span className="rounded-full bg-gray-100 px-3 py-1.5">Partenariats</span>
          </div>
        </Card>
      </section>

      <section id="inscription" className="bg-[#17352B] px-6 py-10 text-center text-white">
        <h2 className="text-xl font-bold md:text-2xl">Prêt à donner un cap à votre projet ?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
          Faites le premier pas et donnez à vos ambitions un plan pour avancer.
        </p>
        <a href="#fonctionnalites" className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#FFB800] px-5 py-2.5 text-sm font-semibold text-[#17352B] transition-colors hover:bg-[#E0A200]">
          C’est parti <ArrowRight size={15} />
        </a>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold text-[#005C46]">Nexus Hub</span>
        <span>Un cap clair pour faire grandir votre projet.</span>
      </footer>
    </div>
  );
}