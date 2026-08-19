import { Router } from 'express';
import { getLatestRankingsHandler } from '../controllers/ranking.controller.js';

const router = Router();

// Public — the "Rankers" leaderboard must be visible without signing in.
router.get('/rankings/latest', getLatestRankingsHandler);

export default router;
