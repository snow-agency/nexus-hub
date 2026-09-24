import { Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { onboardingSchema } from './onboarding.schema.js';
import { detectPhase } from './phase-detector.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export async function completeOnboarding(req: AuthRequest, res: Response) {
  const result = onboardingSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { name, sector, country, stage } = result.data;
  const phase = detectPhase(stage);

  const project = await prisma.project.create({
    data: {
      name,
      sector,
      country,
      phase,
      budgetTotal: 0,
      userId: req.userId as string,
    },
  });

  res.status(201).json(project);
}
