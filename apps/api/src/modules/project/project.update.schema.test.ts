import { describe, expect, it } from 'vitest';
import { updateProjectSchema } from './project.schema.js';

describe('updateProjectSchema', () => {
  it('accepte un budget seul', () => {
    expect(updateProjectSchema.safeParse({ budgetTotal: 500000 }).success).toBe(true);
  });

  it('accepte un budget à 0', () => {
    expect(updateProjectSchema.safeParse({ budgetTotal: 0 }).success).toBe(true);
  });

  it('refuse un budget négatif', () => {
    expect(updateProjectSchema.safeParse({ budgetTotal: -1 }).success).toBe(false);
  });

  it('accepte une phase valide', () => {
    expect(updateProjectSchema.safeParse({ phase: 'LANCEMENT' }).success).toBe(true);
  });

  it('refuse une phase inconnue', () => {
    expect(updateProjectSchema.safeParse({ phase: 'AUTRE' }).success).toBe(false);
  });

  it('refuse un corps vide', () => {
    expect(updateProjectSchema.safeParse({}).success).toBe(false);
  });
});
