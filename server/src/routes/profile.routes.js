import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getMyProfile, updateMyProfile, discoverProfiles } from '../controllers/profile.controller.js';

const router = Router();

router.get('/profile/me', authMiddleware, getMyProfile);
router.put('/profile/me', authMiddleware, updateMyProfile);
router.get('/discover', authMiddleware, discoverProfiles);

export default router;
