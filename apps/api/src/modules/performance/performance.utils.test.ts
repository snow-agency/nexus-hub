import { describe, expect, it } from 'vitest';
import {
  computeKpis,
  computeSeries,
  goalProgress,
  lastMonths,
  monthKey,
} from './performance.utils.js';
import { createGoalSchema, updateGoalSchema } from './performance.schema.js';

const NOW = new Date('2026-09-15T10:00:00.000Z');

describe('lastMonths', () => {
  it('renvoie 6 mois du plus ancien au plus récent', () => {
    const months = lastMonths(NOW);
    expect(months.map((m) => m.month)).toEqual([
      '2026-04',
      '2026-05',
      '2026-06',
      '2026-07',
      '2026-08',
      '2026-09',
    ]);
    expect(months[0].label).toBe('Avr');
    expect(months[5].label).toBe('Sept');
  });

  it('passe correctement la frontière de l’année', () => {
    const months = lastMonths(new Date('2026-02-10T00:00:00.000Z'));
    expect(months.map((m) => m.month)).toEqual([
      '2025-09',
      '2025-10',
      '2025-11',
      '2025-12',
      '2026-01',
      '2026-02',
    ]);
    expect(months[3].label).toBe('Déc');
  });
});

describe('computeSeries', () => {
  it('renvoie des zéros quand il n’y a aucune donnée', () => {
    const series = computeSeries(NOW, [], []);
    expect(series).toHaveLength(6);
    expect(series.every((s) => s.revenus === 0 && s.depenses === 0 && s.tasksCreated === 0)).toBe(
      true,
    );
  });

  it('agrège revenus, dépenses et tâches par mois et ignore les mois hors fenêtre', () => {
    const series = computeSeries(
      NOW,
      [
        { type: 'REVENU', amount: '1000', date: new Date('2026-09-01T00:00:00.000Z') },
        { type: 'REVENU', amount: 500, date: new Date('2026-09-20T00:00:00.000Z') },
        { type: 'DEPENSE', amount: '300', date: new Date('2026-08-31T23:00:00.000Z') },
        { type: 'DEPENSE', amount: 999, date: new Date('2025-01-01T00:00:00.000Z') },
      ],
      [
        { status: 'A_FAIRE', dueDate: null, createdAt: new Date('2026-09-02T00:00:00.000Z') },
        { status: 'FAIT', dueDate: null, createdAt: new Date('2026-04-02T00:00:00.000Z') },
      ],
    );
    expect(series[5]).toMatchObject({
      month: '2026-09',
      revenus: 1500,
      depenses: 0,
      tasksCreated: 1,
    });
    expect(series[4]).toMatchObject({ month: '2026-08', depenses: 300 });
    expect(series[0].tasksCreated).toBe(1);
    expect(series.reduce((sum, s) => sum + s.depenses, 0)).toBe(300);
  });
});

describe('computeKpis', () => {
  it('gère un projet vide sans division par zéro', () => {
    expect(computeKpis(NOW, [], [], 0)).toEqual({
      taskCompletionRate: 0,
      budgetUsedPercent: 0,
      totalRevenus: 0,
      totalDepenses: 0,
      net: 0,
      overdueTasks: 0,
      openTasks: 0,
    });
  });

  it('calcule taux de complétion, budget utilisé, net et retards', () => {
    const kpis = computeKpis(
      NOW,
      [
        { status: 'FAIT', dueDate: null, createdAt: NOW },
        { status: 'A_FAIRE', dueDate: new Date('2026-09-01T00:00:00.000Z'), createdAt: NOW },
        { status: 'A_FAIRE', dueDate: new Date('2026-10-01T00:00:00.000Z'), createdAt: NOW },
        { status: 'A_FAIRE', dueDate: null, createdAt: NOW },
      ],
      [
        { type: 'DEPENSE', amount: '250', date: NOW },
        { type: 'REVENU', amount: 400, date: NOW },
      ],
      1000,
    );
    expect(kpis).toEqual({
      taskCompletionRate: 25,
      budgetUsedPercent: 25,
      totalRevenus: 400,
      totalDepenses: 250,
      net: 150,
      overdueTasks: 1,
      openTasks: 3,
    });
  });
});

describe('goalProgress', () => {
  it('borne entre 0 et 100 et gère une cible nulle', () => {
    expect(goalProgress(50, 100)).toBe(50);
    expect(goalProgress(150, 100)).toBe(100);
    expect(goalProgress(0, 100)).toBe(0);
    expect(goalProgress(10, 0)).toBe(0);
    expect(goalProgress(-5, 100)).toBe(0);
  });
});

describe('monthKey', () => {
  it('formate en UTC', () => {
    expect(monthKey(new Date('2026-01-31T23:59:59.000Z'))).toBe('2026-01');
  });
});

describe('goal schemas', () => {
  const projectId = '11111111-1111-1111-1111-111111111111';

  it('accepte un objectif valide et refuse une cible nulle', () => {
    expect(
      createGoalSchema.safeParse({ projectId, title: '100 commandes', target: 100 }).success,
    ).toBe(true);
    expect(
      createGoalSchema.safeParse({ projectId, title: '100 commandes', target: 0 }).success,
    ).toBe(false);
  });

  it('exige au moins un champ pour la mise à jour', () => {
    expect(updateGoalSchema.safeParse({}).success).toBe(false);
    expect(updateGoalSchema.safeParse({ current: 12 }).success).toBe(true);
    expect(updateGoalSchema.safeParse({ deadline: null }).success).toBe(true);
  });
});
