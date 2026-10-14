import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Le nom du projet doit contenir au moins 2 caractères.'),
  sector: z.string().min(2, 'Le secteur est requis.'),
  country: z.string().min(2, 'Le pays est requis.'),
  budgetTotal: z.number().positive('Le budget doit être un nombre positif.'),
  objective: z.string().optional(),
});

export const updateProjectSchema = z
  .object({
    budgetTotal: z.number().nonnegative('Le budget ne peut pas être négatif.').optional(),
    objective: z.string().max(500, "L'objectif ne peut pas dépasser 500 caractères.").optional(),
    phase: z
      .enum(['IDEE_VALIDATION', 'LANCEMENT', 'CROISSANCE'], {
        message: 'La phase doit être IDEE_VALIDATION, LANCEMENT ou CROISSANCE.',
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.budgetTotal !== undefined || data.objective !== undefined || data.phase !== undefined,
    { message: 'Fournis au moins un champ à modifier : budgetTotal, objective ou phase.' },
  );
