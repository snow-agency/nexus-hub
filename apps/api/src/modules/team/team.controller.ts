import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { createMemberSchema, updateMemberSchema } from './team.schema.js';
import { computeTeamWorkload } from './team.workload.js';

export async function listTeam(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const [members, tasks] = await Promise.all([
    prisma.teamMember.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' } }),
    prisma.task.findMany({
      where: { projectId },
      select: { status: true, assigneeId: true },
    }),
  ]);

  const { byMember, unassignedOpenTasks } = computeTeamWorkload(
    members.map((member) => member.id),
    tasks,
  );

  res.json({
    members: members.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      email: member.email,
      ...byMember[member.id],
    })),
    unassignedOpenTasks,
  });
}

export async function createMember(req: AuthRequest, res: Response) {
  const result = createMemberSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { projectId, name, role, email } = result.data;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const member = await prisma.teamMember.create({ data: { projectId, name, role, email } });

  res.status(201).json(member);
}

export async function updateMember(req: AuthRequest, res: Response) {
  const result = updateMemberSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { id } = req.params;

  const existing = await prisma.teamMember.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Membre introuvable.' });
  }

  const member = await prisma.teamMember.update({ where: { id }, data: result.data });

  res.json(member);
}

export async function deleteMember(req: AuthRequest, res: Response) {
  const { id } = req.params;

  const existing = await prisma.teamMember.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Membre introuvable.' });
  }

  await prisma.teamMember.delete({ where: { id } });

  res.status(204).send();
}
