import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Le nom du projet doit contenir au moins 2 caractères.'),
  sector: z.string().min(2, 'Le secteur est requis.'),
  country: z.string().min(2, 'Le pays est requis.'),
  budgetTotal: z.number().positive('Le budget doit être un nombre positif.'),
  objective: z.string().optional(),
});
