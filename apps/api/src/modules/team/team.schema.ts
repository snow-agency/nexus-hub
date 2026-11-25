import { z } from 'zod';

const nameField = z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.').max(80);
const roleField = z.string().trim().min(2, 'Le rôle doit contenir au moins 2 caractères.').max(80);
const emailField = z.string().trim().email("L'adresse e-mail est invalide.");

export const createMemberSchema = z.object({
  projectId: z.string().uuid("L'identifiant du projet est invalide."),
  name: nameField,
  role: roleField,
  email: emailField.optional(),
});

export const updateMemberSchema = z
  .object({
    name: nameField.optional(),
    role: roleField.optional(),
    email: emailField.nullable().optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.role !== undefined || data.email !== undefined,
    {
      message: 'Fournis au moins un champ à modifier : name, role ou email.',
    },
  );
