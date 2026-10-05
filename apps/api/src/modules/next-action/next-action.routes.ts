import { Router } from 'express';
import { generateNextAction } from './next-action.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';

const router = Router();

router.post('/:projectId/generate', authMiddleware, asyncHandler(generateNextAction));

export default router;
