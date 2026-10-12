import { Router } from 'express';
import { createTransaction, listTransactions, listCategories } from './finance.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';

const router = Router();

router.post('/', authMiddleware, asyncHandler(createTransaction));
router.get('/categories', authMiddleware, asyncHandler(listCategories));
router.get(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(listTransactions),
);

export default router;
