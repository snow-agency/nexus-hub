export interface ProjectSnapshot {
  project: {
    name: string;
    sector: string;
    country: string;
    phase: string;
    budgetTotal: number;
    objective: string | null;
  };
  tasks: {
    open: Array<{ title: string; dueDate: Date | null; assignee: string | null }>;
    doneCount: number;
    totalCount: number;
  };
  finance: {
    totalDepenses: number;
    totalRevenus: number;
    budgetRestant: number;
    topCategories: Array<{ category: string; amount: number }>;
  };
  signals: Array<{ type: string; severity: string }>;
  strategy: {
    etapes: Array<{ title: string; done: boolean }>;
    positionnement: string | null;
    sections: Array<{ title: string; progress: number }>;
  };
  bmc: Array<{ block: string; content: string }>;
  team: Array<{ name: string; role: string }>;
  goals: Array<{ title: string; current: number; target: number; unit: string | null }>;
  network: { contacts: number; opportunities: Array<{ title: string; status: string }> };
}

const fmt = (value: number) => new Intl.NumberFormat('fr-FR').format(Math.round(value));
const date = (value: Date | null) => (value ? value.toISOString().slice(0, 10) : 'sans échéance');

/** Texte compact décrivant l'état du projet, injecté dans les prompts de l'IA. */
export function snapshotToText(s: ProjectSnapshot, now = new Date()): string {
  const lines: string[] = [];

  lines.push(`Date du jour : ${now.toISOString().slice(0, 10)}`);
  lines.push(
    `Projet : ${s.project.name} (${s.project.sector}, ${s.project.country}) — phase ${s.project.phase}`,
  );
  lines.push(`Objectif : ${s.project.objective ?? 'non défini'}`);
  lines.push(
    `Budget : total ${fmt(s.project.budgetTotal)} FCFA, dépensé ${fmt(s.finance.totalDepenses)}, revenus ${fmt(s.finance.totalRevenus)}, restant ${fmt(s.finance.budgetRestant)}`,
  );

  if (s.finance.topCategories.length > 0) {
    lines.push(
      `Dépenses par catégorie : ${s.finance.topCategories.map((c) => `${c.category} ${fmt(c.amount)}`).join(', ')}`,
    );
  }

  lines.push(`Tâches : ${s.tasks.doneCount} faites sur ${s.tasks.totalCount}`);
  if (s.tasks.open.length > 0) {
    lines.push('Tâches à faire :');
    for (const task of s.tasks.open) {
      lines.push(
        `- ${task.title} (échéance ${date(task.dueDate)}${task.assignee ? `, assignée à ${task.assignee}` : ''})`,
      );
    }
  }

  if (s.signals.length > 0) {
    lines.push(`Alertes actives : ${s.signals.map((a) => `${a.type} (${a.severity})`).join(', ')}`);
  }

  if (s.strategy.etapes.length > 0) {
    lines.push(
      `Étude de marché : ${s.strategy.etapes.map((e) => `${e.done ? '[x]' : '[ ]'} ${e.title}`).join(' ; ')}`,
    );
  }
  if (s.strategy.positionnement) {
    lines.push(`Positionnement : ${s.strategy.positionnement}`);
  }
  if (s.strategy.sections.length > 0) {
    lines.push(
      `Plan d'affaires : ${s.strategy.sections.map((p) => `${p.title} ${p.progress} %`).join(', ')}`,
    );
  }

  if (s.bmc.length > 0) {
    lines.push(`Business Model Canvas renseigné : ${s.bmc.map((b) => b.block).join(', ')}`);
  }

  if (s.team.length > 0) {
    lines.push(`Équipe : ${s.team.map((m) => `${m.name} (${m.role})`).join(', ')}`);
  }

  if (s.goals.length > 0) {
    lines.push(
      `Objectifs : ${s.goals.map((g) => `${g.title} ${g.current}/${g.target}${g.unit ? ` ${g.unit}` : ''}`).join(' ; ')}`,
    );
  }

  lines.push(`Réseau : ${s.network.contacts} contact(s)`);
  if (s.network.opportunities.length > 0) {
    lines.push(
      `Opportunités suivies : ${s.network.opportunities.map((o) => `${o.title} (${o.status})`).join(' ; ')}`,
    );
  }

  return lines.join('\n');
}
