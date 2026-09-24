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
