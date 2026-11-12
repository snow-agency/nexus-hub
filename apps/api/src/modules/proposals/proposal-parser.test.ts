import { describe, expect, it } from 'vitest';
import {
  MAX_PROPOSALS,
  normalizeTitle,
  parseProposals,
  stripProposalsBlock,
} from './proposal-parser.js';

const task = {
  type: 'TACHE',
  title: 'Valider le budget',
  reason: 'Le budget est vide.',
  payload: { dueInDays: 7 },
};
const bmc = {
  type: 'BLOC_BMC',
  title: 'Segments clients',
  reason: 'Bloc manquant.',
  payload: { block: 'SEGMENTS_CLIENTS', content: 'Actifs de 22 à 40 ans' },
};

describe('parseProposals', () => {
  it('parse un tableau JSON brut', () => {
    expect(parseProposals(JSON.stringify([task, bmc]))).toHaveLength(2);
  });

  it('parse un bloc ```proposals entouré de texte', () => {
    const text = `Voici ce que je te conseille.\n\n\`\`\`proposals\n${JSON.stringify([task])}\n\`\`\``;
    expect(parseProposals(text)).toHaveLength(1);
  });

  it('parse un bloc ```json', () => {
    expect(parseProposals(`\`\`\`json\n${JSON.stringify([bmc])}\n\`\`\``)).toHaveLength(1);
  });

  it('ignore les entrées invalides sans échouer', () => {
    const invalid = { type: 'TACHE', title: 'x', reason: '', payload: {} };
    const unknown = { type: 'HACK', title: 'Truc', reason: 'Raison', payload: {} };
    const wrongBlock = { ...bmc, payload: { block: 'AUTRE_BLOC', content: 'abc' } };
    expect(parseProposals(JSON.stringify([invalid, unknown, wrongBlock, task]))).toHaveLength(1);
  });

  it('renvoie [] pour du texte sans JSON ou un JSON cassé', () => {
    expect(parseProposals('Aucune proposition.')).toEqual([]);
    expect(parseProposals('```proposals\n[{"type": \n```')).toEqual([]);
  });

  it('récupère les propositions complètes quand la réponse est tronquée', () => {
    const truncated = `${JSON.stringify([task, bmc]).slice(0, -1)}`.slice(0, -25);
    const result = parseProposals(truncated);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].title).toBe('Valider le budget');
  });

  it(`limite à ${MAX_PROPOSALS} propositions`, () => {
    const many = Array.from({ length: 12 }, (_, i) => ({ ...task, title: `Tâche numéro ${i}` }));
    expect(parseProposals(JSON.stringify(many))).toHaveLength(MAX_PROPOSALS);
  });

  it('rejette un délai hors bornes', () => {
    const bad = { ...task, payload: { dueInDays: 9999 } };
    expect(parseProposals(JSON.stringify([bad]))).toEqual([]);
  });
});

describe('stripProposalsBlock', () => {
  it('retire le bloc de propositions et garde le texte', () => {
    const text = `Fais ceci.\n\n\`\`\`proposals\n${JSON.stringify([task])}\n\`\`\``;
    expect(stripProposalsBlock(text)).toBe('Fais ceci.');
  });

  it('ne touche pas au texte sans bloc', () => {
    expect(stripProposalsBlock('Bonjour')).toBe('Bonjour');
  });
});

describe('normalizeTitle', () => {
  it('ignore casse, accents et ponctuation', () => {
    expect(normalizeTitle('Définir les clients-cibles !')).toBe(
      normalizeTitle('definir les clients cibles'),
    );
  });
});
