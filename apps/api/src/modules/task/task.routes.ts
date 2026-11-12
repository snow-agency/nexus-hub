import { Router } from 'express';
import { createTask, listTasks, updateTaskStatus, updateTaskAssignee } from './task.controller.js';
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
router.patch('/:taskId/status', authMiddleware, asyncHandler(updateTaskStatus));

router.patch(
  '/:taskId/assignee',
  authMiddleware,
  validateUuidParam('taskId'),
  asyncHandler(updateTaskAssignee),
);

export default router;
