import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { createTransactionSchema } from './finance.schema.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export async function createTransaction(req: AuthRequest, res: Response) {
  const result = createTransactionSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { projectId, type, amount, category, date } = result.data;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const transaction = await prisma.transaction.create({
    data: {
      projectId,
      type,
      amount,
      category,
      date: new Date(date),
    },
  });

  res.status(201).json(transaction);
}

export async function listTransactions(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const transactions = await prisma.transaction.findMany({
    where: { projectId },
    orderBy: { date: 'desc' },
  });

  const totalDepenses = transactions
    .filter((t) => t.type === 'DEPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalRevenus = transactions
    .filter((t) => t.type === 'REVENU')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  res.json({
    transactions,
    solde: totalRevenus - totalDepenses,
    totalDepenses,
    totalRevenus,
    budgetTotal: Number(project.budgetTotal),
    budgetRestant: Number(project.budgetTotal) - totalDepenses,
  });
}
