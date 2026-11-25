import { z } from 'zod';

export const sendMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Le message est vide.')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères.'),
});
