import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { createTaskSchema, updateTaskStatusSchema } from './task.schema.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export async function createTask(req: AuthRequest, res: Response) {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { projectId, title, dueDate } = result.data;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const task = await prisma.task.create({
    data: {
      projectId,
      title,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  });

  res.status(201).json(task);
}

export async function listTasks(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.userId as string },
  });

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const tasks = await prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });

  res.json(tasks);
}

export async function updateTaskStatus(req: AuthRequest, res: Response) {
  const result = updateTaskStatusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { taskId } = req.params;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: { userId: req.userId as string },
    },
  });

  if (!task) {
    return res.status(404).json({ error: 'Tâche introuvable.' });
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status: result.data.status },
  });

  res.json(updated);
}
