import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import {
  createContactSchema,
  updateContactSchema,
  createOpportunitySchema,
  updateOpportunitySchema,
} from './network.schema.js';
import { sortOpportunities } from './network.utils.js';

async function ownsProject(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  return project !== null;
}

export async function getNetwork(req: AuthRequest, res: Response) {
  const { projectId } = req.params;

  if (!(await ownsProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const [contacts, opportunities] = await Promise.all([
    prisma.contact.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } }),
    prisma.opportunity.findMany({ where: { projectId } }),
  ]);

  res.json({ contacts, opportunities: sortOpportunities(opportunities) });
}

export async function createContact(req: AuthRequest, res: Response) {
  const result = createContactSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { projectId, ...data } = result.data;

  if (!(await ownsProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const contact = await prisma.contact.create({
    data: {
      projectId,
      name: data.name,
      type: data.type,
      organization: data.organization ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      notes: data.notes ?? null,
    },
  });

  res.status(201).json(contact);
}

export async function updateContact(req: AuthRequest, res: Response) {
  const result = updateContactSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { id } = req.params;
  const existing = await prisma.contact.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Contact introuvable.' });
  }

  const contact = await prisma.contact.update({ where: { id }, data: result.data });

  res.json(contact);
}

export async function deleteContact(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const existing = await prisma.contact.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Contact introuvable.' });
  }

  await prisma.contact.delete({ where: { id } });

  res.status(204).send();
}

export async function createOpportunity(req: AuthRequest, res: Response) {
  const result = createOpportunitySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { projectId, deadline, ...data } = result.data;

  if (!(await ownsProject(projectId, req.userId as string))) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  const opportunity = await prisma.opportunity.create({
    data: {
      projectId,
      title: data.title,
      kind: data.kind,
      status: data.status,
      description: data.description ?? null,
      url: data.url ?? null,
      deadline: deadline ? new Date(deadline) : null,
      aiSuggested: false,
    },
  });

  res.status(201).json(opportunity);
}

export async function updateOpportunity(req: AuthRequest, res: Response) {
  const result = updateOpportunitySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { id } = req.params;
  const existing = await prisma.opportunity.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Opportunité introuvable.' });
  }

  const { deadline, ...rest } = result.data;

  const opportunity = await prisma.opportunity.update({
    where: { id },
    data: {
      ...rest,
      ...(deadline !== undefined ? { deadline: deadline ? new Date(deadline) : null } : {}),
    },
  });

  res.json(opportunity);
}

export async function deleteOpportunity(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const existing = await prisma.opportunity.findFirst({
    where: { id, project: { userId: req.userId as string } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Opportunité introuvable.' });
  }

  await prisma.opportunity.delete({ where: { id } });

  res.status(204).send();
}
