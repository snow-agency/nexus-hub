import { Response } from 'express';
import type { NextAction } from '@prisma/client';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { runDetection } from '../rules-engine/rules-engine.service.js';
import { pickPrioritySignal } from '../rules-engine/arbitration.js';
import { draftNextAction } from '../rules-engine/next-action.js';
import { computeTaskProgress } from './progression.js';
import { computeFinanceSummary } from '../finance/finance.utils.js';
import { GUIDANCE, GUIDANCE_KINDS, pendingGuidanceKinds, type GuidanceKind } from './guidance.js';

type NextActionView = NextAction & { kind: 'SIGNAL' | GuidanceKind };

async function ensureNextAction(
  projectId: string,
  signal: { id: string; type: string } | null,
): Promise<NextActionView | null> {
  if (!signal) {
    return null;
  }

  const existing = await prisma.nextAction.findMany({
    where: { projectId, signalId: signal.id },
    orderBy: { createdAt: 'desc' },
  });

  const proposed = existing.find((action) => action.status === 'PROPOSEE');

  if (proposed) {
    return { ...proposed, kind: 'SIGNAL' };
  }

  if (existing.length > 0) {
    // Déjà traitée (faite ou ignorée) pour ce signal : on ne la repropose pas.
    return null;
  }

  const draft = draftNextAction(signal);

  const created = await prisma.nextAction.create({
    data: {
      projectId,
      signalId: signal.id,
      title: draft.title,
      reason: draft.reason,
      status: 'PROPOSEE',
    },
  });

  return { ...created, kind: 'SIGNAL' };
}

async function ensureGuidance(
  projectId: string,
  state: { budgetTotal: number; tasksCount: number },
): Promise<NextActionView | null> {
  const pending = pendingGuidanceKinds(state);

  // Si l'utilisateur a fait ce qui était demandé, l'action passe à "faite".
  for (const kind of GUIDANCE_KINDS) {
    if (!pending.includes(kind)) {
      await prisma.nextAction.updateMany({
        where: { projectId, signalId: null, title: GUIDANCE[kind].title, status: 'PROPOSEE' },
        data: { status: 'FAITE' },
      });
    }
  }

  for (const kind of pending) {
    const content = GUIDANCE[kind];

    const existing = await prisma.nextAction.findFirst({
      where: { projectId, signalId: null, title: content.title },
      orderBy: { createdAt: 'desc' },
    });

    if (!existing) {
      const created = await prisma.nextAction.create({
        data: {
          projectId,
          title: content.title,
          reason: content.reason,
          impact: content.impact,
          status: 'PROPOSEE',
        },
      });
      return { ...created, kind };
    }

    if (existing.status === 'PROPOSEE') {
      return { ...existing, kind };
    }
    // Déjà traitée ou ignorée : on passe à la suivante.
  }

  return null;
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

  const nextAction =
    (await ensureNextAction(projectId, signalPrioritaire)) ??
    (await ensureGuidance(projectId, {
      budgetTotal: Number(project.budgetTotal),
      tasksCount: tasks.length,
    }));

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
