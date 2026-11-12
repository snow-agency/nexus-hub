import { z } from 'zod';

export const BMC_BLOCKS = [
  'PROPOSITION_VALEUR',
  'SEGMENTS_CLIENTS',
  'CANAUX',
  'RELATIONS_CLIENTS',
  'REVENUS',
  'RESSOURCES_CLES',
  'ACTIVITES_CLES',
  'PARTENAIRES',
  'STRUCTURE_COUTS',
] as const;

export const OPPORTUNITY_KINDS = [
  'FINANCEMENT',
  'INCUBATION',
  'FORMATION',
  'EVENEMENT',
  'AUTRE',
] as const;

const title = z.string().trim().min(2).max(140);
const reason = z.string().trim().min(2).max(400);

export const aiProposalSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('TACHE'),
    title,
    reason,
    payload: z.object({
      dueInDays: z.number().int().min(0).max(365).optional(),
    }),
  }),
  z.object({
    type: z.literal('ETAPE_STRATEGIE'),
    title,
    reason,
    payload: z.object({}).passthrough(),
  }),
  z.object({
    type: z.literal('POSITIONNEMENT'),
    title,
    reason,
    payload: z.object({ content: z.string().trim().min(2).max(600) }),
  }),
  z.object({
    type: z.literal('OBJECTIF'),
    title,
    reason,
    payload: z.object({
      target: z.number().positive().max(1_000_000_000),
      unit: z.string().trim().max(30).optional(),
      deadlineInDays: z.number().int().min(1).max(730).optional(),
    }),
  }),
  z.object({
    type: z.literal('OPPORTUNITE'),
    title,
    reason,
    payload: z.object({
      kind: z.enum(OPPORTUNITY_KINDS).default('AUTRE'),
      description: z.string().trim().max(500).optional(),
    }),
  }),
  z.object({
    type: z.literal('BLOC_BMC'),
    title,
    reason,
    payload: z.object({
      block: z.enum(BMC_BLOCKS),
      content: z.string().trim().min(2).max(600),
    }),
  }),
]);

export type AiProposal = z.infer<typeof aiProposalSchema>;
