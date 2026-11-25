import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { BMC_BLOCKS, buildBmcBlocks } from './bmc.logic.js';

const blockSchema = z.enum(BMC_BLOCKS, { message: 'Bloc du Business Model Canvas invalide.' });
const contentSchema = z.object({
  content: z.string().max(1000, 'Le texte ne peut pas dépasser 1000 caractères.'),
});

async function findOwnedProject(projectId: string, userId: string) {
  return prisma.project.findFirst({ where: { id: projectId, userId } });
}

export async function getBmc(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  if (!(await findOwnedProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const rows = await prisma.bmcBlock.findMany({ where: { projectId } });

  res.json(buildBmcBlocks(rows));
}

export async function putBmcBlock(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  const block = blockSchema.safeParse(req.params.block);
  if (!block.success) {
    return res.status(400).json({ error: block.error.issues[0].message });
  }

  const body = contentSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: body.error.issues[0].message });
  }

  if (!(await findOwnedProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const content = body.data.content.trim();

  if (content === '') {
    await prisma.bmcBlock.deleteMany({ where: { projectId, block: block.data } });
    return res.json({ block: block.data, content: '' });
  }

  const saved = await prisma.bmcBlock.upsert({
    where: { projectId_block: { projectId, block: block.data } },
    create: { projectId, block: block.data, content },
    update: { content },
  });

  res.json({ block: saved.block, content: saved.content });
}
