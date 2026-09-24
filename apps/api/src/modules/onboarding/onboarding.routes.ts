import { Router } from 'express';
import { completeOnboarding } from './onboarding.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';

const router = Router();

router.post('/', authMiddleware, asyncHandler(completeOnboarding));

export default router;
