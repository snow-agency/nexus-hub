import { describe, expect, it } from 'vitest';
import { updateNextActionStatusSchema } from './next-action.schema.js';

describe('updateNextActionStatusSchema', () => {
  it('accepte FAITE', () => {
    expect(updateNextActionStatusSchema.safeParse({ status: 'FAITE' }).success).toBe(true);
  });

  it('accepte IGNOREE', () => {
    expect(updateNextActionStatusSchema.safeParse({ status: 'IGNOREE' }).success).toBe(true);
  });

  it('refuse un statut inconnu', () => {
    expect(updateNextActionStatusSchema.safeParse({ status: 'TERMINEE' }).success).toBe(false);
  });

  it('refuse un corps vide', () => {
    expect(updateNextActionStatusSchema.safeParse({}).success).toBe(false);
  });
});
