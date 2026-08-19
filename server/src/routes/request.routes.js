import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  sendRequest,
  respondToRequest,
  getSentRequests,
  getReceivedRequests
} from '../controllers/request.controller.js';

const router = Router();

router.post('/requests', authMiddleware, sendRequest);
router.patch('/requests/:id', authMiddleware, respondToRequest);
router.get('/requests/sent', authMiddleware, getSentRequests);
router.get('/requests/received', authMiddleware, getReceivedRequests);

export default router;
