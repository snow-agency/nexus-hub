import { z } from 'zod';

export const onboardingSchema = z.object({
  name: z.string().min(2, 'Le nom du projet doit contenir au moins 2 caractères.'),
  sector: z.string().min(2, 'Le secteur est requis.'),
  country: z.string().min(2, 'Le pays est requis.'),
  stage: z.enum(['idee', 'lancement', 'croissance'], {
    message: 'Le stade doit être : idee, lancement ou croissance.',
  }),
});
