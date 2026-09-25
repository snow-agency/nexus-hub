import { describe, expect, it } from 'vitest';
import { pickPrioritySignal } from './arbitration.js';
import type { Signal } from '@prisma/client';

function signal(overrides: Partial<Signal>): Signal {
  return {
    id: 'sig-1',
    projectId: 'proj-1',
    type: 'TACHE_RETARD',
    severity: 'MOYENNE',
    detectedAt: new Date('2026-09-01T10:00:00.000Z'),
    resolved: false,
    ...overrides,
  };
}

describe('pickPrioritySignal', () => {
  it('retourne null sans signal', () => {
    expect(pickPrioritySignal([])).toBeNull();
  });

  it('privilégie la sévérité HAUTE', () => {
    const basse = signal({ id: 'b', severity: 'BASSE' });
    const haute = signal({ id: 'h', type: 'BUDGET_DEPASSE', severity: 'HAUTE' });
    const moyenne = signal({ id: 'm', severity: 'MOYENNE' });

    expect(pickPrioritySignal([basse, haute, moyenne])?.id).toBe('h');
  });

  it('à sévérité égale, garde le signal le plus ancien', () => {
    const recent = signal({
      id: 'recent',
      severity: 'HAUTE',
      detectedAt: new Date('2026-09-02T10:00:00.000Z'),
    });
    const ancien = signal({
      id: 'ancien',
      severity: 'HAUTE',
      detectedAt: new Date('2026-09-01T10:00:00.000Z'),
    });

    expect(pickPrioritySignal([recent, ancien])?.id).toBe('ancien');
  });
});
