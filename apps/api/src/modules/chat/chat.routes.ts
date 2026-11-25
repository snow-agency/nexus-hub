import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';
import { aiLimiter } from '../../middlewares/rate-limit.js';
import { clearChat, getChat, sendMessage } from './chat.controller.js';

const router = Router();

router.get(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(getChat),
);
router.post(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  aiLimiter,
  asyncHandler(sendMessage),
);
router.delete(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(clearChat),
);

export default router;
