import { Router } from 'express';
import { register, login, getMe } from './auth.controller.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', authMiddleware, getMe);

export default router;
