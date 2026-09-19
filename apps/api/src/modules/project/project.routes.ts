import { Router } from 'express';
import { createProject } from './project.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, createProject);

export default router;
