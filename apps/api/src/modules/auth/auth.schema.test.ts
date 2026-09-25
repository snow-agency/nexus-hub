import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './auth.schema.js';

describe('registerSchema', () => {
  it('accepte un utilisateur valide', () => {
    const result = registerSchema.safeParse({
      email: 'ada@nexus.hub',
      password: 'secret1',
      name: 'Ada',
    });

    expect(result.success).toBe(true);
  });

  it('rejette un mot de passe trop court', () => {
    const result = registerSchema.safeParse({
      email: 'ada@nexus.hub',
      password: '123',
      name: 'Ada',
    });

    expect(result.success).toBe(false);
  });

  it('rejette un email invalide', () => {
    const result = registerSchema.safeParse({
      email: 'pas-un-email',
      password: 'secret1',
      name: 'Ada',
    });

    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('exige email et mot de passe', () => {
    expect(loginSchema.safeParse({ email: 'ada@nexus.hub' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'ada@nexus.hub', password: 'secret1' }).success).toBe(
      true,
    );
  });
});
