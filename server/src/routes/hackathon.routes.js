import { Router } from 'express';
import { getAllHackathonsHandler } from '../controllers/hackathon.controller.js';

const router = Router();

// Public — the "Hackathons" browse page must be visible without signing in.
router.get('/hackathons', getAllHackathonsHandler);

export default router;
