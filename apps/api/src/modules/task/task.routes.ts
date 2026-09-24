import { Router } from 'express';
import { createTask, listTasks, updateTaskStatus } from './task.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';

const router = Router();

router.post('/', authMiddleware, asyncHandler(createTask));
router.get('/project/:projectId', authMiddleware, asyncHandler(listTasks));
router.patch('/:taskId/status', authMiddleware, asyncHandler(updateTaskStatus));

export default router;
