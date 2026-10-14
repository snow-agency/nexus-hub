import { Router } from 'express';
import { generateNextAction, updateNextActionStatus } from './next-action.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';

const router = Router();

router.post('/:projectId/generate', authMiddleware, asyncHandler(generateNextAction));
router.patch(
  '/:id/status',
  authMiddleware,
  validateUuidParam('id'),
  asyncHandler(updateNextActionStatus),
);

export default router;
