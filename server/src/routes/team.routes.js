import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getMyTeam } from '../controllers/team.controller.js';

const router = Router();

router.get('/team/me', authMiddleware, getMyTeam);

export default router;
