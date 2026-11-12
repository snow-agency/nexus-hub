import type { Prisma, Proposal } from '@prisma/client';
import { aiProposalSchema } from './proposal.schema.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Applique une proposition acceptée (dans la transaction fournie). Renvoie un résumé de ce qui a été créé. */
export async function applyProposal(
  tx: Prisma.TransactionClient,
  proposal: Proposal,
  now = new Date(),
  allowOverwrite = true,
): Promise<{ kind: string; id: string }> {
  const parsed = aiProposalSchema.safeParse({
    type: proposal.type,
    title: proposal.title,
    reason: proposal.reason,
    payload: proposal.payload,
  });

  if (!parsed.success) {
    throw new Error('Proposition invalide.');
  }

  const { projectId } = proposal;
  const data = parsed.data;

  switch (data.type) {
    case 'TACHE': {
      const task = await tx.task.create({
        data: {
          projectId,
          title: data.title,
          dueDate:
            data.payload.dueInDays !== undefined
              ? new Date(now.getTime() + data.payload.dueInDays * DAY_MS)
              : undefined,
        },
      });
      return { kind: 'task', id: task.id };
    }

    case 'ETAPE_STRATEGIE': {
      const position = await tx.strategyItem.count({
        where: { projectId, kind: 'ETAPE_MARCHE' },
      });
      const item = await tx.strategyItem.create({
        data: { projectId, kind: 'ETAPE_MARCHE', title: data.title, position },
      });
      return { kind: 'strategy', id: item.id };
    }

    case 'POSITIONNEMENT': {
      const existing = await tx.strategyItem.findFirst({
        where: { projectId, kind: 'POSITIONNEMENT' },
      });
      if (existing && !allowOverwrite) {
        throw new Error('Le positionnement existe déjà : applique cette proposition à la main.');
      }
      const item = existing
        ? await tx.strategyItem.update({
            where: { id: existing.id },
            data: { title: data.title, content: data.payload.content },
          })
        : await tx.strategyItem.create({
            data: {
              projectId,
              kind: 'POSITIONNEMENT',
              title: data.title,
              content: data.payload.content,
            },
          });
      return { kind: 'strategy', id: item.id };
    }

    case 'OBJECTIF': {
      const goal = await tx.goal.create({
        data: {
          projectId,
          title: data.title,
          target: data.payload.target,
          unit: data.payload.unit,
          deadline:
            data.payload.deadlineInDays !== undefined
              ? new Date(now.getTime() + data.payload.deadlineInDays * DAY_MS)
              : undefined,
        },
      });
      return { kind: 'goal', id: goal.id };
    }

    case 'OPPORTUNITE': {
      const opportunity = await tx.opportunity.create({
        data: {
          projectId,
          title: data.title,
          description: data.payload.description,
          kind: data.payload.kind,
          aiSuggested: true,
        },
      });
      return { kind: 'opportunity', id: opportunity.id };
    }

    case 'BLOC_BMC': {
      if (!allowOverwrite) {
        const existingBlock = await tx.bmcBlock.findUnique({
          where: { projectId_block: { projectId, block: data.payload.block } },
        });
        if (existingBlock) {
          throw new Error('Ce bloc est déjà rempli : applique cette proposition à la main.');
        }
      }
      const block = await tx.bmcBlock.upsert({
        where: { projectId_block: { projectId, block: data.payload.block } },
        create: { projectId, block: data.payload.block, content: data.payload.content },
        update: { content: data.payload.content },
      });
      return { kind: 'bmc', id: block.id };
    }
  }
}
