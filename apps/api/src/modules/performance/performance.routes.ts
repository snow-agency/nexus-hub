import { Router } from 'express';
import { getPerformance, createGoal, updateGoal, deleteGoal } from './performance.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';

const router = Router();

router.get(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(getPerformance),
);
router.post('/goals', authMiddleware, asyncHandler(createGoal));
router.patch('/goals/:id', authMiddleware, validateUuidParam('id'), asyncHandler(updateGoal));
router.delete('/goals/:id', authMiddleware, validateUuidParam('id'), asyncHandler(deleteGoal));

export default router;
