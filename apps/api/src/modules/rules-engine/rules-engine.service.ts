import { prisma } from '../../db/prisma.js';
import { SignalType, SignalSeverity } from '@prisma/client';
import { isBudgetDepasse } from './detection.js';

async function upsertSignal(projectId: string, type: SignalType, severity: SignalSeverity) {
  const existing = await prisma.signal.findFirst({
    where: { projectId, type, resolved: false },
  });

  if (existing) {
    return existing;
  }

  return prisma.signal.create({
    data: { projectId, type, severity },
  });
}

async function resolveSignal(projectId: string, type: SignalType) {
  await prisma.signal.updateMany({
    where: { projectId, type, resolved: false },
    data: { resolved: true },
  });
}

async function checkBudgetDepasse(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return;

  const transactions = await prisma.transaction.findMany({
    where: { projectId, type: 'DEPENSE' },
  });
  const totalDepenses = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const budgetTotal = Number(project.budgetTotal);

  if (isBudgetDepasse(totalDepenses, budgetTotal)) {
    await upsertSignal(projectId, 'BUDGET_DEPASSE', 'HAUTE');
  } else {
    await resolveSignal(projectId, 'BUDGET_DEPASSE');
  }
}

async function checkTacheRetard(projectId: string) {
  const now = new Date();
  const tachesRetard = await prisma.task.findMany({
    where: { projectId, status: 'A_FAIRE', dueDate: { lt: now } },
  });

  if (tachesRetard.length > 0) {
    await upsertSignal(projectId, 'TACHE_RETARD', 'MOYENNE');
  } else {
    await resolveSignal(projectId, 'TACHE_RETARD');
  }
}

export async function runDetection(projectId: string) {
  await checkBudgetDepasse(projectId);
  await checkTacheRetard(projectId);

  return prisma.signal.findMany({
    where: { projectId, resolved: false },
    orderBy: { detectedAt: 'desc' },
  });
}
