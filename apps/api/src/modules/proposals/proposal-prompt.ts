export const PROPOSAL_FORMAT_RULES = `Format d'une proposition (objet JSON) :
{"type": "TACHE" | "ETAPE_STRATEGIE" | "POSITIONNEMENT" | "OBJECTIF" | "OPPORTUNITE" | "BLOC_BMC", "title": "...", "reason": "pourquoi maintenant, 1 phrase", "payload": {...}}
payload selon le type :
- TACHE : {"dueInDays": 0-365 (optionnel)}
- ETAPE_STRATEGIE : {} (title = étape d'étude de marché)
- POSITIONNEMENT : {"content": "description du positionnement"} (title = la promesse en une phrase)
- OBJECTIF : {"target": nombre > 0, "unit": "commandes" (optionnel), "deadlineInDays": 1-730 (optionnel)}
- OPPORTUNITE : {"kind": "FINANCEMENT" | "INCUBATION" | "FORMATION" | "EVENEMENT" | "AUTRE", "description": "..."} (title = TYPE de programme à rechercher ; n'invente jamais de nom d'organisme, de montant ni de date précise)
- BLOC_BMC : {"block": "PROPOSITION_VALEUR" | "SEGMENTS_CLIENTS" | "CANAUX" | "RELATIONS_CLIENTS" | "REVENUS" | "RESSOURCES_CLES" | "ACTIVITES_CLES" | "PARTENAIRES" | "STRUCTURE_COUTS", "content": "..."}`;

export function buildProposalSystemPrompt(): string {
  return `Tu es le copilote de Nexus Hub, une plateforme qui aide des entrepreneurs (surtout en Afrique francophone) à piloter leur projet.
Tu analyses l'état réel du projet et tu proposes entre 3 et 6 actions concrètes, prioritaires et réalisables dans la semaine ou le mois.

Règles strictes :
- Réponds UNIQUEMENT avec un tableau JSON valide (aucun texte autour, pas de markdown).
- Écris en français, avec un ton direct et simple, tutoiement.
- Ne propose JAMAIS quelque chose qui existe déjà (tâches, étapes, blocs déjà renseignés, opportunités déjà suivies).
- N'invente aucun chiffre, aucun nom de personne ou d'organisme. Appuie-toi uniquement sur les données fournies.
- Varie les types quand c'est pertinent (une tâche urgente, une étape de stratégie, un bloc du Business Model Canvas manquant, un objectif mesurable...).
- Si le budget n'est pas renseigné ou s'il n'y a aucune tâche, commence par ça.

${PROPOSAL_FORMAT_RULES}`;
}

export function buildProposalUserPrompt(
  snapshotText: string,
  pendingTitles: string[],
  focus?: string,
): string {
  const pending =
    pendingTitles.length > 0
      ? `\n\nPropositions déjà en attente (ne les répète pas) :\n${pendingTitles.map((t) => `- ${t}`).join('\n')}`
      : '';
  const focusLine = focus ? `\n\nDemande de l'utilisateur : ${focus}` : '';

  return `État actuel du projet :\n${snapshotText}${pending}${focusLine}\n\nGénère maintenant le tableau JSON de propositions.`;
}
