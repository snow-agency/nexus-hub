import { describe, expect, it } from 'vitest';
import { detectPhase } from './phase-detector.js';
import { onboardingSchema } from './onboarding.schema.js';

describe('detectPhase', () => {
  it('mappe idee vers IDEE_VALIDATION', () => {
    expect(detectPhase('idee')).toBe('IDEE_VALIDATION');
  });

  it('mappe lancement vers LANCEMENT', () => {
    expect(detectPhase('lancement')).toBe('LANCEMENT');
  });

  it('mappe croissance vers CROISSANCE', () => {
    expect(detectPhase('croissance')).toBe('CROISSANCE');
  });
});

describe('onboardingSchema', () => {
  it('accepte un onboarding valide', () => {
    const result = onboardingSchema.safeParse({
      name: 'Nexus',
      sector: 'Agri',
      country: 'Togo',
      stage: 'idee',
    });

    expect(result.success).toBe(true);
  });

  it('rejette un stade inconnu', () => {
    const result = onboardingSchema.safeParse({
      name: 'Nexus',
      sector: 'Agri',
      country: 'Togo',
      stage: 'scale',
    });

    expect(result.success).toBe(false);
  });
});
