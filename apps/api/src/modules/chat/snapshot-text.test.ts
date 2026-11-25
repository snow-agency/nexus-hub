import { describe, expect, it } from 'vitest';
import { snapshotToText, type ProjectSnapshot } from './snapshot-text.js';

const base: ProjectSnapshot = {
  project: {
    name: 'MomoFood',
    sector: 'Restauration',
    country: 'Togo',
    phase: 'LANCEMENT',
    budgetTotal: 750000,
    objective: null,
  },
  tasks: { open: [], doneCount: 0, totalCount: 0 },
  finance: { totalDepenses: 0, totalRevenus: 0, budgetRestant: 750000, topCategories: [] },
  signals: [],
  strategy: { etapes: [], positionnement: null, sections: [] },
  bmc: [],
  team: [],
  goals: [],
  network: { contacts: 0, opportunities: [] },
};

describe('snapshotToText', () => {
  const now = new Date('2026-11-12T10:00:00Z');

  it('décrit le projet, le budget et la date du jour', () => {
    const text = snapshotToText(base, now);
    expect(text).toContain('2026-11-12');
    expect(text).toContain('MomoFood (Restauration, Togo)');
    expect(text).toContain('Objectif : non défini');
    expect(text).toContain('Tâches : 0 faites sur 0');
  });

  it('liste les tâches ouvertes avec échéance et assigné', () => {
    const text = snapshotToText(
      {
        ...base,
        tasks: {
          open: [
            {
              title: 'Valider le menu',
              dueDate: new Date('2026-11-20T00:00:00Z'),
              assignee: 'Fanta',
            },
          ],
          doneCount: 2,
          totalCount: 3,
        },
      },
      now,
    );
    expect(text).toContain('- Valider le menu (échéance 2026-11-20, assignée à Fanta)');
    expect(text).toContain('2 faites sur 3');
  });

  it("n'inclut pas les sections vides", () => {
    const text = snapshotToText(base, now);
    expect(text).not.toContain('Équipe :');
    expect(text).not.toContain('Alertes actives');
  });
});
