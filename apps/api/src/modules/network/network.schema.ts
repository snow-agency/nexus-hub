import { z } from 'zod';

export const CONTACT_TYPES = [
  'MENTOR',
  'PARTENAIRE',
  'INVESTISSEUR',
  'CLIENT',
  'FOURNISSEUR',
  'AUTRE',
] as const;

export const OPPORTUNITY_KINDS = [
  'FINANCEMENT',
  'INCUBATION',
  'FORMATION',
  'EVENEMENT',
  'AUTRE',
] as const;

export const OPPORTUNITY_STATUSES = ['A_EXPLORER', 'EN_COURS', 'OBTENUE', 'ECARTEE'] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Ce champ ne peut pas dépasser ${max} caractères.`)
    .optional()
    .nullable();

const httpUrl = z
  .string()
  .trim()
  .max(500, "L'adresse ne peut pas dépasser 500 caractères.")
  .refine((value) => {
    try {
      const { protocol } = new URL(value);
      return protocol === 'http:' || protocol === 'https:';
    } catch {
      return false;
    }
  }, "L'adresse doit commencer par http:// ou https://.");

const emailField = z.string().trim().email("L'adresse e-mail est invalide.");

export const createContactSchema = z.object({
  projectId: z.string().uuid("L'identifiant du projet est invalide."),
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.').max(120),
  organization: optionalText(120),
  type: z.enum(CONTACT_TYPES, { message: 'Le type de contact est invalide.' }),
  email: emailField.optional().nullable(),
  phone: optionalText(40),
  notes: optionalText(1000),
});

export const updateContactSchema = z
  .object({
    name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.').max(120),
    organization: optionalText(120),
    type: z.enum(CONTACT_TYPES, { message: 'Le type de contact est invalide.' }),
    email: emailField.nullable(),
    phone: optionalText(40),
    notes: optionalText(1000),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Fournis au moins un champ à modifier.',
  });

export const createOpportunitySchema = z.object({
  projectId: z.string().uuid("L'identifiant du projet est invalide."),
  title: z.string().trim().min(2, 'Le titre doit contenir au moins 2 caractères.').max(160),
  description: optionalText(1000),
  kind: z.enum(OPPORTUNITY_KINDS, { message: "Le type d'opportunité est invalide." }),
  status: z.enum(OPPORTUNITY_STATUSES, { message: 'Le statut est invalide.' }).optional(),
  deadline: z.string().datetime('La date doit être au format ISO.').optional().nullable(),
  url: httpUrl.optional().nullable(),
});

export const updateOpportunitySchema = z
  .object({
    title: z.string().trim().min(2, 'Le titre doit contenir au moins 2 caractères.').max(160),
    description: optionalText(1000),
    kind: z.enum(OPPORTUNITY_KINDS, { message: "Le type d'opportunité est invalide." }),
    status: z.enum(OPPORTUNITY_STATUSES, { message: 'Le statut est invalide.' }),
    deadline: z.string().datetime('La date doit être au format ISO.').nullable(),
    url: httpUrl.nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Fournis au moins un champ à modifier.',
  });
