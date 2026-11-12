import { z } from 'zod';

export const createGoalSchema = z.object({
  projectId: z.string().uuid("L'identifiant du projet est invalide."),
  title: z.string().trim().min(2, "L'intitulé doit contenir au moins 2 caractères.").max(120),
  target: z.number().positive("L'objectif doit être un nombre positif."),
  current: z.number().nonnegative('La valeur actuelle ne peut pas être négative.').optional(),
  unit: z.string().trim().max(20, "L'unité est trop longue.").optional(),
  deadline: z.string().datetime("L'échéance doit être au format ISO.").optional(),
});

export const updateGoalSchema = z
  .object({
    title: z.string().trim().min(2, "L'intitulé doit contenir au moins 2 caractères.").max(120),
    target: z.number().positive("L'objectif doit être un nombre positif."),
    current: z.number().nonnegative('La valeur actuelle ne peut pas être négative.'),
    unit: z.string().trim().max(20, "L'unité est trop longue.").nullable(),
    deadline: z.string().datetime("L'échéance doit être au format ISO.").nullable(),
  })
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Fournis au moins un champ à modifier.',
  });
