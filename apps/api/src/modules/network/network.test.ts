import { describe, expect, it } from 'vitest';
import { isDeadlineSoon, isOpenOpportunity, sortOpportunities } from './network.utils.js';
import { createOpportunitySchema, createContactSchema } from './network.schema.js';

const projectId = '11111111-1111-1111-1111-111111111111';

describe('sortOpportunities', () => {
  it('place les ouvertes avant les clôturées, par échéance croissante, sans date en dernier', () => {
    const sorted = sortOpportunities([
      { id: 'closed', status: 'OBTENUE', deadline: '2026-01-01T00:00:00.000Z' },
      { id: 'nodate', status: 'A_EXPLORER', deadline: null },
      { id: 'late', status: 'EN_COURS', deadline: '2026-12-01T00:00:00.000Z' },
      { id: 'soon', status: 'A_EXPLORER', deadline: '2026-03-01T00:00:00.000Z' },
    ]);

    expect(sorted.map((o) => o.id)).toEqual(['soon', 'late', 'nodate', 'closed']);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const input = [
      { status: 'ECARTEE', deadline: null },
      { status: 'A_EXPLORER', deadline: null },
    ];
    sortOpportunities(input);
    expect(input[0].status).toBe('ECARTEE');
  });
});

describe('isOpenOpportunity / isDeadlineSoon', () => {
  it('reconnaît les statuts ouverts', () => {
    expect(isOpenOpportunity({ status: 'EN_COURS' })).toBe(true);
    expect(isOpenOpportunity({ status: 'ECARTEE' })).toBe(false);
  });

  it('détecte une échéance dans les 14 jours', () => {
    const now = new Date('2026-06-01T00:00:00.000Z');
    expect(isDeadlineSoon('2026-06-10T00:00:00.000Z', now)).toBe(true);
    expect(isDeadlineSoon('2026-07-01T00:00:00.000Z', now)).toBe(false);
    expect(isDeadlineSoon('2026-05-30T00:00:00.000Z', now)).toBe(false);
    expect(isDeadlineSoon(null, now)).toBe(false);
  });
});

describe('network schemas', () => {
  it('rejette une url non http(s)', () => {
    const base = { projectId, title: 'Fonds', kind: 'FINANCEMENT' };
    expect(createOpportunitySchema.safeParse({ ...base, url: 'javascript:alert(1)' }).success).toBe(
      false,
    );
    expect(createOpportunitySchema.safeParse({ ...base, url: 'https://exemple.org' }).success).toBe(
      true,
    );
  });

  it('ignore aiSuggested envoyé par le client et exige un nom de contact valide', () => {
    const parsed = createOpportunitySchema.parse({
      projectId,
      title: 'Fonds',
      kind: 'AUTRE',
      aiSuggested: true,
    });
    expect('aiSuggested' in parsed).toBe(false);
    expect(createContactSchema.safeParse({ projectId, name: 'A', type: 'MENTOR' }).success).toBe(
      false,
    );
  });
});
