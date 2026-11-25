import type { Prisma, Proposal, ProposalSource } from '@prisma/client';
import { prisma } from '../../db/prisma.js';
import { chatComplete } from '../next-action/ai-client.js';
import { loadProjectSnapshot } from '../chat/project-snapshot.js';
import { snapshotToText } from '../chat/snapshot-text.js';
import { buildProposalSystemPrompt, buildProposalUserPrompt } from './proposal-prompt.js';
import { normalizeTitle, parseProposals } from './proposal-parser.js';
import type { AiProposal } from './proposal.schema.js';

const AUTO_COOLDOWN_MS = 12 * 60 * 60 * 1000;
const generating = new Set<string>();

export async function listPendingProposals(projectId: string): Promise<Proposal[]> {
  return prisma.proposal.findMany({
    where: { projectId, status: 'PROPOSEE' },
    orderBy: { createdAt: 'desc' },
  });
}

/** Enregistre des propositions déjà validées, en écartant les doublons des propositions en attente. */
export async function saveProposals(
  projectId: string,
  proposals: AiProposal[],
  source: ProposalSource,
): Promise<Proposal[]> {
  const pending = await listPendingProposals(projectId);
  const seen = new Set(pending.map((p) => `${p.type}:${normalizeTitle(p.title)}`));
  const created: Proposal[] = [];

  for (const proposal of proposals) {
    const key = `${proposal.type}:${normalizeTitle(proposal.title)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    created.push(
      await prisma.proposal.create({
        data: {
          projectId,
          type: proposal.type,
          title: proposal.title,
          reason: proposal.reason,
          payload: proposal.payload as Prisma.InputJsonValue,
          source,
        },
      }),
    );
  }

  return created;
}

export async function generateProposals(
  projectId: string,
  source: ProposalSource,
  focus?: string,
): Promise<{ created: Proposal[]; aiAvailable: boolean }> {
  if (generating.has(projectId)) {
    return { created: [], aiAvailable: true };
  }

  generating.add(projectId);
  try {
    return await runGeneration(projectId, source, focus);
  } finally {
    generating.delete(projectId);
  }
}

async function runGeneration(
  projectId: string,
  source: ProposalSource,
  focus?: string,
): Promise<{ created: Proposal[]; aiAvailable: boolean }> {
  const snapshot = await loadProjectSnapshot(projectId);
  if (!snapshot) {
    return { created: [], aiAvailable: true };
  }

  const pending = await listPendingProposals(projectId);
  const raw = await chatComplete({
    system: buildProposalSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: buildProposalUserPrompt(
          snapshotToText(snapshot),
          pending.map((p) => p.title),
          focus,
        ),
      },
    ],
    maxTokens: 4000,
  });

  if (raw === null) {
    return { created: [], aiAvailable: false };
  }

  const created = await saveProposals(projectId, parseProposals(raw), source);
  return { created, aiAvailable: true };
}

/** Génération automatique : au plus une fois toutes les 12 h, et seulement s'il n'y a rien en attente. */
export async function autoGenerateProposals(projectId: string): Promise<Proposal[]> {
  const pending = await listPendingProposals(projectId);
  if (pending.length > 0) {
    return pending;
  }

  const last = await prisma.proposal.findFirst({
    where: { projectId, source: 'AUTO' },
    orderBy: { createdAt: 'desc' },
  });
  if (last && Date.now() - last.createdAt.getTime() < AUTO_COOLDOWN_MS) {
    return pending;
  }

  const { created } = await generateProposals(projectId, 'AUTO');
  return created;
}
