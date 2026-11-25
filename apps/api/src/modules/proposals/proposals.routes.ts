import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';
import { aiLimiter } from '../../middlewares/rate-limit.js';
import {
  acceptAll,
  acceptProposal,
  autoProposals,
  generateNow,
  listProposals,
  rejectProposal,
} from './proposals.controller.js';

const router = Router();

router.get(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(listProposals),
);
router.post(
  '/project/:projectId/auto',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(autoProposals),
);
router.post(
  '/project/:projectId/generate',
  authMiddleware,
  validateUuidParam('projectId'),
  aiLimiter,
  asyncHandler(generateNow),
);
router.post(
  '/project/:projectId/accept-all',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(acceptAll),
);
router.post('/:id/accept', authMiddleware, validateUuidParam('id'), asyncHandler(acceptProposal));
router.post('/:id/reject', authMiddleware, validateUuidParam('id'), asyncHandler(rejectProposal));

export default router;
