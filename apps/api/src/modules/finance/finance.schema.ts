import { z } from 'zod';

export const TRANSACTION_CATEGORIES = [
  'MARKETING',
  'DEVELOPPEMENT',
  'LOGISTIQUE',
  'SALAIRES',
  'LOYER',
  'MATERIEL',
  'ADMINISTRATIF',
  'AUTRE',
] as const;

export const createTransactionSchema = z.object({
  projectId: z.string().uuid("L'identifiant du projet est invalide."),
  type: z.enum(['DEPENSE', 'REVENU'], {
    message: 'Le type doit être DEPENSE ou REVENU.',
  }),
  amount: z.number().positive('Le montant doit être un nombre positif.'),
  category: z
    .enum(TRANSACTION_CATEGORIES, {
      message: `La catégorie doit être l'une de : ${TRANSACTION_CATEGORIES.join(', ')}.`,
    })
    .optional(),
  date: z.string().datetime('La date doit être au format ISO (ex. 2026-09-22T10:00:00.000Z).'),
});
