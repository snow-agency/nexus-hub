import { Router } from 'express';
import { getDashboard } from './dashboard.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';

const router = Router();

router.get('/:projectId', authMiddleware, asyncHandler(getDashboard));

export default router;
