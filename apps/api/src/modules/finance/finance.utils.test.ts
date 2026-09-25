import { describe, expect, it } from 'vitest';
import { computeFinanceSummary } from './finance.utils.js';
import { createTransactionSchema } from './finance.schema.js';

describe('computeFinanceSummary', () => {
  it('calcule solde, totaux et budget restant', () => {
    const summary = computeFinanceSummary(
      [
        { type: 'REVENU', amount: 150 },
        { type: 'DEPENSE', amount: 40 },
        { type: 'DEPENSE', amount: '10' },
      ],
      200,
    );

    expect(summary).toEqual({
      totalDepenses: 50,
      totalRevenus: 150,
      solde: 100,
      budgetTotal: 200,
      budgetRestant: 150,
    });
  });

  it('retourne un solde nul sans transaction', () => {
    expect(computeFinanceSummary([], 80)).toMatchObject({
      totalDepenses: 0,
      totalRevenus: 0,
      solde: 0,
      budgetRestant: 80,
    });
  });
});

describe('createTransactionSchema', () => {
  it('accepte une dépense valide', () => {
    const result = createTransactionSchema.safeParse({
      projectId: '11111111-1111-1111-1111-111111111111',
      type: 'DEPENSE',
      amount: 12.5,
      date: '2026-09-22T10:00:00.000Z',
    });

    expect(result.success).toBe(true);
  });

  it('rejette un type inconnu', () => {
    const result = createTransactionSchema.safeParse({
      projectId: '11111111-1111-1111-1111-111111111111',
      type: 'TRANSFER',
      amount: 12.5,
      date: '2026-09-22T10:00:00.000Z',
    });

    expect(result.success).toBe(false);
  });
});
