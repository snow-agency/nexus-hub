import { Router } from 'express';
import { listTeam, createMember, updateMember, deleteMember } from './team.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../middlewares/async-handler.js';
import { validateUuidParam } from '../../middlewares/validate-uuid.js';

const router = Router();

router.get(
  '/project/:projectId',
  authMiddleware,
  validateUuidParam('projectId'),
  asyncHandler(listTeam),
);
router.post('/', authMiddleware, asyncHandler(createMember));
router.patch('/:id', authMiddleware, validateUuidParam('id'), asyncHandler(updateMember));
router.delete('/:id', authMiddleware, validateUuidParam('id'), asyncHandler(deleteMember));

export default router;
