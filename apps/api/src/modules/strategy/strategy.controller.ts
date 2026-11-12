import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { createStrategyItemSchema, updateStrategyItemSchema } from './strategy.schema.js';
import { computeMarketProgress } from './strategy.logic.js';

export async function getStrategy(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const items = await prisma.strategyItem.findMany({
    where: { projectId },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  });

  const etapes = items.filter((item) => item.kind === 'ETAPE_MARCHE');
  const sections = items.filter((item) => item.kind === 'SECTION_PLAN');
  const positionnements = items.filter((item) => item.kind === 'POSITIONNEMENT');
  const positionnement = positionnements[positionnements.length - 1] ?? null;

  res.json({ etapes, positionnement, sections, progressMarche: computeMarketProgress(etapes) });
}

export async function createStrategyItem(req: AuthRequest, res: Response) {
  const result = createStrategyItemSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { projectId, kind, title, content, progress } = result.data;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  if (kind === 'POSITIONNEMENT') {
    const existing = await prisma.strategyItem.findFirst({
      where: { projectId, kind },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      const updated = await prisma.strategyItem.update({
        where: { id: existing.id },
        data: { title, content },
      });
      return res.json(updated);
    }
  }

  const last = await prisma.strategyItem.findFirst({
    where: { projectId, kind },
    orderBy: { position: 'desc' },
  });

  const created = await prisma.strategyItem.create({
    data: {
      projectId,
      kind,
      title,
      content,
      progress: progress ?? 0,
      position: last ? last.position + 1 : 0,
    },
  });

  res.status(201).json(created);
}

export async function updateStrategyItem(req: AuthRequest, res: Response) {
  const result = updateStrategyItemSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { id } = req.params;

  const existing = await prisma.strategyItem.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Élément de stratégie introuvable.' });
  }

  const updated = await prisma.strategyItem.update({ where: { id }, data: result.data });

  res.json(updated);
}

export async function deleteStrategyItem(req: AuthRequest, res: Response) {
  const { id } = req.params;

  const existing = await prisma.strategyItem.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Élément de stratégie introuvable.' });
  }

  await prisma.strategyItem.delete({ where: { id } });

  res.status(204).send();
}
