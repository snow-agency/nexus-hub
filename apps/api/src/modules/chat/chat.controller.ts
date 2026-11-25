import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { chatComplete, type ChatTurn } from '../next-action/ai-client.js';
import { parseProposals, stripProposalsBlock } from '../proposals/proposal-parser.js';
import { listPendingProposals, saveProposals } from '../proposals/proposals.service.js';
import { buildChatSystemPrompt } from './chat.prompt.js';
import { sendMessageSchema } from './chat.schema.js';
import { loadProjectSnapshot } from './project-snapshot.js';
import { snapshotToText } from './snapshot-text.js';

const HISTORY_FOR_AI = 12;
const HISTORY_FOR_UI = 50;

async function ownedProject(projectId: string, userId: string) {
  return prisma.project.findFirst({ where: { id: projectId, userId } });
}

export async function getChat(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  if (!(await ownedProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const recent = await prisma.chatMessage.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    take: HISTORY_FOR_UI,
  });

  res.json({
    messages: recent.reverse(),
    proposals: await listPendingProposals(projectId),
  });
}

export async function sendMessage(req: AuthRequest, res: Response) {
  const { projectId } = req.params;
  const parsedBody = sendMessageSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error.issues[0].message });
  }

  if (!(await ownedProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const snapshot = await loadProjectSnapshot(projectId);
  if (!snapshot) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const history = await prisma.chatMessage.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    take: HISTORY_FOR_AI,
  });

  const turns: ChatTurn[] = [
    ...history.reverse().map((message) => ({
      role: message.role === 'USER' ? ('user' as const) : ('assistant' as const),
      content: message.content,
    })),
    { role: 'user', content: parsedBody.data.message },
  ];

  const raw = await chatComplete({
    system: buildChatSystemPrompt(snapshotToText(snapshot)),
    messages: turns,
    maxTokens: 3000,
  });

  if (raw === null || raw.trim() === '') {
    return res.status(503).json({ error: "L'IA est indisponible, réessaie dans un instant." });
  }

  const reply = stripProposalsBlock(raw) || 'Voici mes propositions :';

  const userMessage = await prisma.chatMessage.create({
    data: { projectId, role: 'USER', content: parsedBody.data.message },
  });
  const assistantMessage = await prisma.chatMessage.create({
    data: { projectId, role: 'ASSISTANT', content: reply },
  });

  const proposals = await saveProposals(projectId, parseProposals(raw), 'CHAT');

  res.status(201).json({ userMessage, assistantMessage, proposals });
}

export async function clearChat(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  if (!(await ownedProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  await prisma.chatMessage.deleteMany({ where: { projectId } });
  res.status(204).end();
}
