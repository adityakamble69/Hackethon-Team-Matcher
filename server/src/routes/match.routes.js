import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getMatchScore } from '../controllers/match.controller.js';

const router = Router();

router.get('/match/score/:otherUserId', authMiddleware, getMatchScore);

export default router;
