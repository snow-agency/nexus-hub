import { z } from 'zod';

export const STRATEGY_KINDS = ['ETAPE_MARCHE', 'POSITIONNEMENT', 'SECTION_PLAN'] as const;

const progress = z
  .number({ message: 'La progression doit être un nombre.' })
  .int('La progression doit être un entier.')
  .min(0, 'La progression doit être comprise entre 0 et 100.')
  .max(100, 'La progression doit être comprise entre 0 et 100.');

const title = z
  .string()
  .trim()
  .min(2, 'Le titre doit contenir au moins 2 caractères.')
  .max(200, 'Le titre ne peut pas dépasser 200 caractères.');

const content = z.string().max(2000, 'Le texte ne peut pas dépasser 2000 caractères.');

export const createStrategyItemSchema = z.object({
  projectId: z.string().uuid("L'identifiant du projet est invalide."),
  kind: z.enum(STRATEGY_KINDS, {
    message: 'Le type doit être ETAPE_MARCHE, POSITIONNEMENT ou SECTION_PLAN.',
  }),
  title,
  content: content.optional(),
  progress: progress.optional(),
});

export const updateStrategyItemSchema = z
  .object({
    title: title.optional(),
    content: content.optional(),
    progress: progress.optional(),
    done: z.boolean().optional(),
    position: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Fournis au moins un champ à modifier.',
  });
