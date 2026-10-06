import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { runDetection } from '../rules-engine/rules-engine.service.js';
import { pickPrioritySignal } from '../rules-engine/arbitration.js';
import { draftNextAction } from '../rules-engine/next-action.js';
import { computeTaskProgress } from './progression.js';
import { computeFinanceSummary } from '../finance/finance.utils.js';

async function ensureNextAction(projectId: string, signal: { id: string; type: string } | null) {
  if (!signal) {
    return null;
  }

  const existing = await prisma.nextAction.findFirst({
    where: { projectId, signalId: signal.id, status: 'PROPOSEE' },
  });

  if (existing) {
    return existing;
  }

  const draft = draftNextAction(signal);

  return prisma.nextAction.create({
    data: {
      projectId,
      signalId: signal.id,
      title: draft.title,
      reason: draft.reason,
      status: 'PROPOSEE',
    },
  });
}

export async function getDashboard(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const tasks = await prisma.task.findMany({ where: { projectId } });
  const transactions = await prisma.transaction.findMany({ where: { projectId } });
  const finance = computeFinanceSummary(transactions, Number(project.budgetTotal));

  const signaux = await runDetection(projectId);
  const signalPrioritaire = pickPrioritySignal(signaux);
  const nextAction = await ensureNextAction(projectId, signalPrioritaire);

  res.json({
    project: {
      id: project.id,
      name: project.name,
      phase: project.phase,
    },
    progression: computeTaskProgress(tasks),
    finance: {
      budgetTotal: finance.budgetTotal,
      totalDepenses: finance.totalDepenses,
      budgetRestant: finance.budgetRestant,
    },
    signaux,
    signalPrioritaire,
    nextAction,
  });
}
