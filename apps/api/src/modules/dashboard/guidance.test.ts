import { describe, expect, it } from 'vitest';
import { pendingGuidanceKinds } from './guidance.js';

describe('pendingGuidanceKinds', () => {
  it('propose le budget puis la première tâche pour un projet neuf', () => {
    expect(pendingGuidanceKinds({ budgetTotal: 0, tasksCount: 0 })).toEqual([
      'BUDGET_SETUP',
      'FIRST_TASK',
    ]);
  });

  it('ne propose que la première tâche si le budget est renseigné', () => {
    expect(pendingGuidanceKinds({ budgetTotal: 100000, tasksCount: 0 })).toEqual(['FIRST_TASK']);
  });

  it('ne propose que le budget si une tâche existe déjà', () => {
    expect(pendingGuidanceKinds({ budgetTotal: 0, tasksCount: 3 })).toEqual(['BUDGET_SETUP']);
  });

  it('ne propose rien si tout est renseigné', () => {
    expect(pendingGuidanceKinds({ budgetTotal: 100000, tasksCount: 3 })).toEqual([]);
  });
});
