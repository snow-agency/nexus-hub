import { Router } from 'express';
import { createTransaction, listTransactions } from './finance.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';

const router = Router();

router.post('/', authMiddleware, asyncHandler(createTransaction));
router.get('/project/:projectId', authMiddleware, asyncHandler(listTransactions));

export default router;
