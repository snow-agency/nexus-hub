import type { ProjectPhase } from '@prisma/client';

export function detectPhase(stage: 'idee' | 'lancement' | 'croissance'): ProjectPhase {
  switch (stage) {
    case 'idee':
      return 'IDEE_VALIDATION';
    case 'lancement':
      return 'LANCEMENT';
    case 'croissance':
      return 'CROISSANCE';
  }
}
