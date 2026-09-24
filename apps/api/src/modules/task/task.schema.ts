import { z } from 'zod';

export const createTaskSchema = z.object({
  projectId: z.string().uuid("L'identifiant du projet est invalide."),
  title: z.string().min(2, 'Le titre de la tâche doit contenir au moins 2 caractères.'),
  dueDate: z.string().datetime().optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['A_FAIRE', 'FAIT'], {
    message: 'Le statut doit être A_FAIRE ou FAIT.',
  }),
});
