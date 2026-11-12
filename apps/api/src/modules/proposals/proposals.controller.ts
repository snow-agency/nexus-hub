import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { applyProposal } from './proposal-apply.js';
import {
  autoGenerateProposals,
  generateProposals,
  listPendingProposals,
} from './proposals.service.js';

async function ownedProject(projectId: string, userId: string) {
  return prisma.project.findFirst({ where: { id: projectId, userId } });
}

async function ownedProposal(id: string, userId: string) {
  return prisma.proposal.findFirst({ where: { id, project: { userId } } });
}

export async function listProposals(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  if (!(await ownedProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  res.json({ proposals: await listPendingProposals(projectId) });
}

export async function autoProposals(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  if (!(await ownedProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  await autoGenerateProposals(projectId);
  res.json({ proposals: await listPendingProposals(projectId) });
}

export async function generateNow(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  if (!(await ownedProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const { aiAvailable } = await generateProposals(projectId, 'AUTO');

  if (!aiAvailable) {
    return res.status(503).json({ error: "L'IA est indisponible, réessaie dans un instant." });
  }

  res.status(201).json({ proposals: await listPendingProposals(projectId) });
}

async function decide(
  proposalId: string,
  userId: string,
  status: 'ACCEPTEE' | 'REFUSEE',
  allowOverwrite = true,
): Promise<{ error?: { code: number; message: string }; result?: { kind: string; id: string } }> {
  const proposal = await ownedProposal(proposalId, userId);
  if (!proposal) {
    return { error: { code: 404, message: 'Proposition introuvable.' } };
  }

  return prisma.$transaction(async (tx) => {
    const claimed = await tx.proposal.updateMany({
      where: { id: proposalId, status: 'PROPOSEE' },
      data: { status, decidedAt: new Date() },
    });

    if (claimed.count === 0) {
      return { error: { code: 409, message: 'Cette proposition a déjà été traitée.' } };
    }

    if (status === 'REFUSEE') {
      return {};
    }

    return { result: await applyProposal(tx, proposal, new Date(), allowOverwrite) };
  });
}

export async function acceptProposal(req: AuthRequest, res: Response) {
  const outcome = await decide(req.params.id, req.userId as string, 'ACCEPTEE');

  if (outcome.error) {
    return res.status(outcome.error.code).json({ error: outcome.error.message });
  }

  res.json({ accepted: true, created: outcome.result });
}

export async function rejectProposal(req: AuthRequest, res: Response) {
  const outcome = await decide(req.params.id, req.userId as string, 'REFUSEE');

  if (outcome.error) {
    return res.status(outcome.error.code).json({ error: outcome.error.message });
  }

  res.json({ rejected: true });
}

export async function acceptAll(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  if (!(await ownedProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const pending = await listPendingProposals(projectId);
  let accepted = 0;

  for (const proposal of pending) {
    try {
      const outcome = await decide(proposal.id, req.userId as string, 'ACCEPTEE', false);
      if (!outcome.error) accepted += 1;
    } catch {
      // proposition laissée en attente (ex. cible déjà remplie)
    }
  }

  res.json({ accepted });
}
