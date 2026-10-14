import { z } from 'zod';

export const updateNextActionStatusSchema = z.object({
  status: z.enum(['PROPOSEE', 'FAITE', 'IGNOREE'], {
    message: 'Le statut doit être PROPOSEE, FAITE ou IGNOREE.',
  }),
});
