import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { createProjectSchema } from './project.schema.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export async function createProject(req: AuthRequest, res: Response) {
  const result = createProjectSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { name, sector, country, budgetTotal, objective } = result.data;

  const project = await prisma.project.create({
    data: {
      name,
      sector,
      country,
      budgetTotal,
      objective,
      userId: req.userId as string,
    },
  });

  res.status(201).json(project);
}

export async function listProjects(req: AuthRequest, res: Response) {
  const projects = await prisma.project.findMany({
    where: { userId: req.userId as string },
    orderBy: { createdAt: 'desc' },
  });

  res.json(projects);
}

export async function getProject(req: AuthRequest, res: Response) {
  const { id } = req.params;

  const project = await prisma.project.findFirst({
    where: { id, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  res.json(project);
}
