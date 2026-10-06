import { describe, expect, it } from 'vitest';
import { BUDGET_THRESHOLD, hasOverdueTasks, isBudgetDepasse } from './detection.js';
import { draftNextAction } from './next-action.js';

describe('isBudgetDepasse', () => {
  it('déclenche à 80 % du budget', () => {
    expect(isBudgetDepasse(80, 100)).toBe(true);
    expect(isBudgetDepasse(79, 100)).toBe(false);
  });

  it('déclenche dès la première dépense si le budget est à 0', () => {
    expect(isBudgetDepasse(1, 0)).toBe(true);
    expect(isBudgetDepasse(0, 0)).toBe(false);
  });

  it('expose le seuil du cahier des charges', () => {
    expect(BUDGET_THRESHOLD).toBe(0.8);
  });
});

describe('hasOverdueTasks', () => {
  const now = new Date('2026-09-25T00:00:00.000Z');

  it('détecte une tâche à faire en retard', () => {
    expect(
      hasOverdueTasks([{ status: 'A_FAIRE', dueDate: new Date('2026-09-24T00:00:00.000Z') }], now),
    ).toBe(true);
  });

  it('ignore les tâches faites ou sans échéance', () => {
    expect(
      hasOverdueTasks(
        [
          { status: 'FAIT', dueDate: new Date('2026-09-24T00:00:00.000Z') },
          { status: 'A_FAIRE', dueDate: null },
        ],
        now,
      ),
    ).toBe(false);
  });
});

describe('draftNextAction', () => {
  it('propose une action budget', () => {
    expect(draftNextAction({ type: 'BUDGET_DEPASSE' }).title).toBe('Revoir le budget du projet');
  });

  it('propose une action tâche en retard', () => {
    expect(draftNextAction({ type: 'TACHE_RETARD' }).title).toBe('Traiter les tâches en retard');
  });
});
