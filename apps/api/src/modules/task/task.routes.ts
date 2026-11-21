import { Router } from 'express';
import {
  createTask,
  listTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from './task.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';

const router = Router();

router.post('/', authMiddleware, asyncHandler(createTask));
router.get(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(listTasks),
);
router.patch(
  '/:taskId/status',
  authMiddleware,
  validateUuidParam('taskId'),
  asyncHandler(updateTaskStatus),
);
router.patch('/:taskId', authMiddleware, validateUuidParam('taskId'), asyncHandler(updateTask));
router.delete('/:taskId', authMiddleware, validateUuidParam('taskId'), asyncHandler(deleteTask));

export default router;
