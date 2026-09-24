import { Router } from 'express';
import { register, login } from './auth.controller.js';
import { asyncHandler } from '../../middlewares/async-handler.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

export default router;
