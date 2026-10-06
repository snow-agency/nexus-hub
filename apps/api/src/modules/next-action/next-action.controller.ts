import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { runDetection } from '../rules-engine/rules-engine.service.js';
import { pickPrioritySignal } from '../rules-engine/arbitration.js';
import { buildPrompt } from './prompt-builder.js';
import { parseNextAction } from './response-parser.js';
import { askClaude } from './ai-client.js';

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

  const prompt = buildPrompt(project, signal);
  const rawResponse = await askClaude(prompt);
  const parsed = parseNextAction(rawResponse);

  const nextAction = await prisma.nextAction.create({
    data: {
      projectId,
      signalId: signal.id,
      title: parsed.title,
      reason: parsed.reason,
      impact: parsed.impact,
      status: 'PROPOSEE',
    },
  });

  res.status(201).json(nextAction);
}
