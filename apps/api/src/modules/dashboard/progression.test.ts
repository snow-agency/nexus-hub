import { describe, expect, it } from 'vitest';
import { computeTaskProgress } from './progression.js';

describe('computeTaskProgress', () => {
  it('retourne 0 % sans tâche', () => {
    expect(computeTaskProgress([])).toEqual({
      tasksTotal: 0,
      tasksDone: 0,
      tasksPercent: 0,
    });
  });

  it('arrondit le pourcentage de tâches faites', () => {
    expect(
      computeTaskProgress([{ status: 'FAIT' }, { status: 'A_FAIRE' }, { status: 'A_FAIRE' }]),
    ).toEqual({
      tasksTotal: 3,
      tasksDone: 1,
      tasksPercent: 33,
    });
  });
});
