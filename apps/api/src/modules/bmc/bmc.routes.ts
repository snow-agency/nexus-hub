import { Router } from 'express';
import { getBmc, putBmcBlock } from './bmc.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';

const router = Router();

router.get(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(getBmc),
);
router.put(
  '/project/:projectId/:block',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(putBmcBlock),
);

export default router;
