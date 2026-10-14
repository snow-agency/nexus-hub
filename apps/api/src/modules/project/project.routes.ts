import { Router } from 'express';
import { createProject, listProjects, getProject, updateProject } from './project.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';

const router = Router();

router.get('/', authMiddleware, asyncHandler(listProjects));
router.get('/:id', authMiddleware, asyncHandler(getProject));
router.post('/', authMiddleware, asyncHandler(createProject));
router.patch('/:id', authMiddleware, validateUuidParam('id'), asyncHandler(updateProject));

export default router;
