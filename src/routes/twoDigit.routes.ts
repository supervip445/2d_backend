import { Router } from 'express';
import { TwoDigitController } from '../controllers/twoDigit.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();
const twoDigitController = new TwoDigitController();

// Public routes
router.get('/getall', twoDigitController.getAll);
router.get('/active', twoDigitController.getActive);
router.get('/inactive', twoDigitController.getInactive);
router.get('/status/:two_digit', twoDigitController.checkStatus);

// Protected routes (only for Owner, Agent, Sub_Agent)
router.post('/close/:two_digit', authMiddleware, roleMiddleware(['Owner', 'Agent', 'Sub_Agent']), twoDigitController.closeDigit);
router.post('/open/:two_digit', authMiddleware, roleMiddleware(['Owner', 'Agent', 'Sub_Agent']), twoDigitController.openDigit);

export default router; 