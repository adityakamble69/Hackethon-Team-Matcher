import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getMyTeam, getAllTeamsHandler } from '../controllers/team.controller.js';

const router = Router();

router.get('/team/me', authMiddleware, getMyTeam);

// Public — the "Teams" browse page must be visible without signing in.
router.get('/teams', getAllTeamsHandler);

export default router;
