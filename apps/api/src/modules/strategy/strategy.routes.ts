import { Router } from 'express';
import {
  getStrategy,
  createStrategyItem,
  updateStrategyItem,
  deleteStrategyItem,
} from './strategy.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';

const router = Router();

router.get(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(getStrategy),
);
router.post('/', authMiddleware, asyncHandler(createStrategyItem));
router.patch('/:id', authMiddleware, validateUuidParam('id'), asyncHandler(updateStrategyItem));
router.delete('/:id', authMiddleware, validateUuidParam('id'), asyncHandler(deleteStrategyItem));

export default router;
