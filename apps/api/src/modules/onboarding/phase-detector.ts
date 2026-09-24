import { ProjectPhase } from '@prisma/client';

export function detectPhase(stage: 'idee' | 'lancement' | 'croissance'): ProjectPhase {
  switch (stage) {
    case 'idee':
      return ProjectPhase.IDEE_VALIDATION;
    case 'lancement':
      return ProjectPhase.LANCEMENT;
    case 'croissance':
      return ProjectPhase.CROISSANCE;
  }
}
