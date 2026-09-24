import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { runDetection } from '../rules-engine/rules-engine.service.js';
import { pickPrioritySignal } from '../rules-engine/arbitration.js';

export async function getDashboard(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const tasks = await prisma.task.findMany({ where: { projectId } });
  const tasksTotal = tasks.length;
  const tasksDone = tasks.filter((t) => t.status === 'FAIT').length;
  const tasksPercent = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;

  const transactions = await prisma.transaction.findMany({ where: { projectId } });
  const totalDepenses = transactions
    .filter((t) => t.type === 'DEPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const budgetTotal = Number(project.budgetTotal);
  const budgetRestant = budgetTotal - totalDepenses;

  const signaux = await runDetection(projectId);
  const signalPrioritaire = pickPrioritySignal(signaux);

  res.json({
    project: {
      id: project.id,
      name: project.name,
      phase: project.phase,
    },
    progression: {
      tasksTotal,
      tasksDone,
      tasksPercent,
    },
    finance: {
      budgetTotal,
      totalDepenses,
      budgetRestant,
    },
    signaux,
    signalPrioritaire,
    nextAction: null,
  });
}
