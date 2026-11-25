import { Sparkles } from 'lucide-react';

export function ComingSoonBanner({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-dark">
      <Sparkles className="mt-0.5 flex-shrink-0 text-accent-hover" size={18} />
      <div className="space-y-0.5">
        <p className="text-xs font-extrabold uppercase tracking-wider text-accent-hover">
          Bientôt disponible
        </p>
        <p className="text-xs leading-relaxed text-gray-700">
          {children ??
            'Cet espace est un aperçu de ce qui arrive. Les données affichées ici sont des exemples, pas encore connectées à ton projet.'}
        </p>
      </div>
    </div>
  );
}
