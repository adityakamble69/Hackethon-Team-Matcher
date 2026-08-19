import { Router } from 'express';
import { getPublicStatsHandler } from '../controllers/stats.controller.js';

const router = Router();

// Intentionally no authMiddleware — the landing page stat counters need to
// work for signed-out visitors.
router.get('/stats/public', getPublicStatsHandler);

export default router;
