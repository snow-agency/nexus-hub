import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives, réessaie dans quelques minutes.' },
});

export const aiLimiter = rateLimit({
  keyGenerator: (req) => (req as { userId?: string }).userId ?? 'anonymous',
  windowMs: 60 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Limite d'utilisation de l'IA atteinte, réessaie plus tard." },
});
