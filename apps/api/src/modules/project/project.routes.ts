import { Router } from 'express';
import { createProject, listProjects, getProject } from './project.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';

const router = Router();

router.get('/', authMiddleware, asyncHandler(listProjects));
router.get('/:id', authMiddleware, asyncHandler(getProject));
router.post('/', authMiddleware, asyncHandler(createProject));

export default router;
