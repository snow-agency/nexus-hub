import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { runDetection } from '../rules-engine/rules-engine.service.js';
import { pickPrioritySignal } from '../rules-engine/arbitration.js';
import { buildPrompt } from './prompt-builder.js';
import { parseNextAction } from './response-parser.js';
import { askClaude } from './ai-client.js';
import { updateNextActionStatusSchema } from './next-action.schema.js';

export async function generateNextAction(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const signaux = await runDetection(projectId);
  const signal = pickPrioritySignal(signaux);

  if (!signal) {
    return res.json({ nextAction: null, message: "Aucun problème détecté pour l'instant." });
  }

  const existing = await prisma.nextAction.findMany({
    where: { projectId, signalId: signal.id },
    orderBy: { createdAt: 'desc' },
  });

  const proposed = existing.find((action) => action.status === 'PROPOSEE');

  if (!proposed && existing.length > 0) {
    return res.json({
      nextAction: null,
      message: 'La recommandation pour ce problème a déjà été traitée.',
    });
  }

  const prompt = buildPrompt(project, signal);
  const rawResponse = await askClaude(prompt);

  if (rawResponse === null) {
    if (proposed) {
      return res.json({
        nextAction: proposed,
        message: "L'IA est indisponible : le texte existant est conservé.",
      });
    }

    return res.status(503).json({
      error: "L'IA est indisponible, réessaie dans un instant.",
    });
  }

  const parsed = parseNextAction(rawResponse);

  if (proposed) {
    const updated = await prisma.nextAction.update({
      where: { id: proposed.id },
      data: {
        title: parsed.title,
        reason: parsed.reason,
        impact: parsed.impact,
      },
    });

    return res.json(updated);
  }

  const created = await prisma.nextAction.create({
    data: {
      projectId,
      signalId: signal.id,
      title: parsed.title,
      reason: parsed.reason,
      impact: parsed.impact,
      status: 'PROPOSEE',
    },
  });

  return res.status(201).json(created);
}

export async function updateNextActionStatus(req: AuthRequest, res: Response) {
  const result = updateNextActionStatusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { id } = req.params;

  const existing = await prisma.nextAction.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Next Action introuvable.' });
  }

  const updated = await prisma.nextAction.update({
    where: { id },
    data: { status: result.data.status },
  });

  return res.json(updated);
}
