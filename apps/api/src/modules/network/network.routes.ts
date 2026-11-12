import { Router } from 'express';
import {
  getNetwork,
  createContact,
  updateContact,
  deleteContact,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from './network.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';

const router = Router();

router.get(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(getNetwork),
);

router.post('/contacts', authMiddleware, asyncHandler(createContact));
router.patch('/contacts/:id', authMiddleware, validateUuidParam('id'), asyncHandler(updateContact));
router.delete(
  '/contacts/:id',
  authMiddleware,
  validateUuidParam('id'),
  asyncHandler(deleteContact),
);

router.post('/opportunities', authMiddleware, asyncHandler(createOpportunity));
router.patch(
  '/opportunities/:id',
  authMiddleware,
  validateUuidParam('id'),
  asyncHandler(updateOpportunity),
);
router.delete(
  '/opportunities/:id',
  authMiddleware,
  validateUuidParam('id'),
  asyncHandler(deleteOpportunity),
);

export default router;
