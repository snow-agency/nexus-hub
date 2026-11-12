import { Response } from 'express';
import type { Goal } from '@prisma/client';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { createGoalSchema, updateGoalSchema } from './performance.schema.js';
import { computeKpis, computeSeries, goalProgress } from './performance.utils.js';

function withProgress(goal: Goal) {
  return { ...goal, progress: goalProgress(goal.current, goal.target) };
}

export async function getPerformance(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const [tasks, transactions, goals] = await Promise.all([
    prisma.task.findMany({ where: { projectId } }),
    prisma.transaction.findMany({ where: { projectId } }),
    prisma.goal.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' } }),
  ]);

  const now = new Date();

  res.json({
    kpis: computeKpis(now, tasks, transactions, Number(project.budgetTotal)),
    series: computeSeries(now, transactions, tasks),
    goals: goals.map(withProgress),
  });
}

export async function createGoal(req: AuthRequest, res: Response) {
  const result = createGoalSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { projectId, title, target, current, unit, deadline } = result.data;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const goal = await prisma.goal.create({
    data: {
      projectId,
      title,
      target,
      current: current ?? 0,
      unit: unit || null,
      deadline: deadline ? new Date(deadline) : null,
    },
  });

  res.status(201).json(withProgress(goal));
}

export async function updateGoal(req: AuthRequest, res: Response) {
  const result = updateGoalSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { id } = req.params;

  const existing = await prisma.goal.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Objectif introuvable.' });
  }

  const { deadline, unit, ...rest } = result.data;

  const goal = await prisma.goal.update({
    where: { id },
    data: {
      ...rest,
      ...(unit !== undefined && { unit: unit || null }),
      ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
    },
  });

  res.json(withProgress(goal));
}

export async function deleteGoal(req: AuthRequest, res: Response) {
  const { id } = req.params;

  const existing = await prisma.goal.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Objectif introuvable.' });
  }

  await prisma.goal.delete({ where: { id } });

  res.status(204).send();
}
