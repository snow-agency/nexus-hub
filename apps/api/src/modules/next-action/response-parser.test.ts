import { describe, expect, it } from 'vitest';
import { parseNextAction } from './response-parser.js';

describe('parseNextAction', () => {
  it("extrait le titre, la raison et l'impact quand le format est respecté", () => {
    const text = `Titre : Réduire les dépenses
Raison : Le budget est presque épuisé.
Impact : Permet d'éviter un dépassement complet.`;

    const result = parseNextAction(text);

    expect(result.title).toBe('Réduire les dépenses');
    expect(result.reason).toBe('Le budget est presque épuisé.');
    expect(result.impact).toBe("Permet d'éviter un dépassement complet.");
  });

  it("utilise des valeurs par défaut si le format n'est pas respecté", () => {
    const result = parseNextAction('Réponse mal formée sans les bons mots-clés.');

    expect(result.title).toBe('Vérifier la situation du projet');
    expect(result.reason).toBe('Un signal a été détecté sur ce projet.');
    expect(result.impact).toBe('Permet de garder le projet sur la bonne voie.');
  });

  it("fonctionne même si les lignes ne sont pas dans l'ordre habituel", () => {
    const text = `Impact : Débloque la suite.
Titre : Valider l'étude de marché
Raison : Le positionnement n'est pas confirmé.`;

    const result = parseNextAction(text);

    expect(result.title).toBe("Valider l'étude de marché");
    expect(result.reason).toBe("Le positionnement n'est pas confirmé.");
    expect(result.impact).toBe('Débloque la suite.');
  });
});
