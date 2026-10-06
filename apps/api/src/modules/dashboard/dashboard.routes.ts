import { Router } from 'express';
import { getDashboard } from './dashboard.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';

const router = Router();

router.get(
  '/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(getDashboard),
);

export default router;
