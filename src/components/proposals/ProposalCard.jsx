import { Check, X } from 'lucide-react';

const TYPE_LABELS = {
  TACHE: 'Tâche',
  ETAPE_STRATEGIE: 'Stratégie',
  POSITIONNEMENT: 'Positionnement',
  OBJECTIF: 'Objectif',
  OPPORTUNITE: 'Opportunité · à vérifier',
  BLOC_BMC: 'Business Model Canvas',
};

function describe(proposal) {
  const { payload } = proposal;
  switch (proposal.type) {
    case 'TACHE':
      return payload.dueInDays !== undefined ? `Échéance dans ${payload.dueInDays} jour(s)` : null;
    case 'OBJECTIF':
      return `Cible : ${payload.target}${payload.unit ? ` ${payload.unit}` : ''}`;
    case 'POSITIONNEMENT':
    case 'BLOC_BMC':
      return payload.content;
    case 'OPPORTUNITE':
      return payload.description ?? null;
    default:
      return null;
  }
}

export function ProposalCard({ proposal, onAccept, onReject, busy }) {
  const detail = describe(proposal);

  return (
    <div className="space-y-2 rounded-2xl border border-gray-200/70 bg-white p-3.5">
      <span className="inline-block rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-hover">
        {TYPE_LABELS[proposal.type] ?? proposal.type}
      </span>
      <p className="text-xs font-bold leading-snug text-gray-900">{proposal.title}</p>
      {detail && <p className="text-[11px] leading-relaxed text-gray-600">{detail}</p>}
      <p className="text-[11px] italic leading-relaxed text-gray-400">{proposal.reason}</p>
      <div className="flex gap-2 pt-1">
        <button
          className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          disabled={busy}
          onClick={() => onAccept(proposal.id)}
          type="button"
        >
          <Check size={13} strokeWidth={3} /> Appliquer
        </button>
        <button
          className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-bg-light disabled:opacity-60"
          disabled={busy}
          onClick={() => onReject(proposal.id)}
          type="button"
        >
          <X size={13} /> Ignorer
        </button>
      </div>
    </div>
  );
}
