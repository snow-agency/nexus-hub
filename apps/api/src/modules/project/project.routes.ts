import { Router } from 'express';
import { createProject } from './project.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';

const router = Router();

router.post('/', authMiddleware, asyncHandler(createProject));

export default router;
