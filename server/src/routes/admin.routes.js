import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { registerAdmin, getAdminOverview } from '../controllers/admin.controller.js';

const router = Router();

// Only needs auth (not adminMiddleware) — this IS the promotion step.
router.post('/admin/register', authMiddleware, registerAdmin);

// Everything else needs an existing admin.
router.get('/admin/overview', authMiddleware, adminMiddleware, getAdminOverview);

export default router;
