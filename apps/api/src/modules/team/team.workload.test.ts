import { describe, expect, it } from 'vitest';
import { computeTeamWorkload } from './team.workload.js';

describe('computeTeamWorkload', () => {
  it('calcule la charge relative au membre le plus chargé', () => {
    const result = computeTeamWorkload(
      ['a', 'b'],
      [
        { status: 'A_FAIRE', assigneeId: 'a' },
        { status: 'A_FAIRE', assigneeId: 'a' },
        { status: 'A_FAIRE', assigneeId: 'b' },
        { status: 'FAIT', assigneeId: 'b' },
        { status: 'A_FAIRE', assigneeId: null },
      ],
    );

    expect(result.byMember.a).toEqual({ openTasks: 2, doneTasks: 0, workloadPercent: 100 });
    expect(result.byMember.b).toEqual({ openTasks: 1, doneTasks: 1, workloadPercent: 50 });
    expect(result.unassignedOpenTasks).toBe(1);
  });

  it('renvoie 0 % quand personne a de tâche ouverte', () => {
    const result = computeTeamWorkload(['a'], [{ status: 'FAIT', assigneeId: 'a' }]);
    expect(result.byMember.a.workloadPercent).toBe(0);
    expect(result.unassignedOpenTasks).toBe(0);
  });

  it('ignore les tâches assignées à un membre inconnu', () => {
    const result = computeTeamWorkload(['a'], [{ status: 'A_FAIRE', assigneeId: 'zzz' }]);
    expect(result.byMember.a.openTasks).toBe(0);
  });
});
