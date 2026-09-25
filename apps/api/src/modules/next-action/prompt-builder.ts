import { Signal, Project } from '@prisma/client';

const signalDescriptions: Record<string, string> = {
  BUDGET_DEPASSE: 'le budget du projet est dépassé ou presque épuisé',
  TACHE_RETARD: 'une ou plusieurs tâches ont dépassé leur échéance',
};

export function buildPrompt(project: Project, signal: Signal): string {
  const description = signalDescriptions[signal.type] ?? 'un problème a été détecté';

  return `Tu es un assistant qui aide un entrepreneur à savoir quoi faire ensuite sur son projet.

Projet : ${project.name} (secteur : ${project.sector}, phase : ${project.phase})
Problème détecté : ${description}.

Réponds en français, de façon brève et actionnable, avec exactement ce format :
Titre : (une action concrète à faire, 5-10 mots)
Raison : (pourquoi cette action est nécessaire maintenant, 1 phrase)
Impact : (ce que ça débloque, 1 phrase courte, sans inventer de chiffre)

Ne réponds rien d'autre que ce format.`;
}
