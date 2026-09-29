import { describe, expect, it } from 'vitest';
import { buildPrompt } from './prompt-builder.js';
import type { Project, Signal } from '@prisma/client';

function project(overrides: Partial<Project> = {}): Project {
  return {
    id: 'proj-1',
    userId: 'user-1',
    name: 'MomoFood',
    sector: 'Livraison de repas',
    country: 'Bénin',
    phase: 'IDEE_VALIDATION',
    budgetTotal: 0 as unknown as Project['budgetTotal'],
    objective: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function signal(overrides: Partial<Signal> = {}): Signal {
  return {
    id: 'sig-1',
    projectId: 'proj-1',
    type: 'BUDGET_DEPASSE',
    severity: 'HAUTE',
    detectedAt: new Date(),
    resolved: false,
    ...overrides,
  };
}

describe('buildPrompt', () => {
  it('inclut le nom, le secteur et la phase du projet', () => {
    const prompt = buildPrompt(project(), signal());

    expect(prompt).toContain('MomoFood');
    expect(prompt).toContain('Livraison de repas');
    expect(prompt).toContain('IDEE_VALIDATION');
  });

  it('décrit le problème de budget dépassé', () => {
    const prompt = buildPrompt(project(), signal({ type: 'BUDGET_DEPASSE' }));

    expect(prompt).toContain('budget');
  });

  it('décrit le problème de tâche en retard', () => {
    const prompt = buildPrompt(project(), signal({ type: 'TACHE_RETARD' }));

    expect(prompt).toContain('échéance');
  });

  it('impose le format Titre/Raison/Impact', () => {
    const prompt = buildPrompt(project(), signal());

    expect(prompt).toContain('Titre :');
    expect(prompt).toContain('Raison :');
    expect(prompt).toContain('Impact :');
  });
});
