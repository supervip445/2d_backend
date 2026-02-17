import { Router } from 'express';
import { AdminBetController } from '../controllers/adminBet.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/auth.middleware';

const router = Router();
const adminBetController = new AdminBetController();

// All routes require authentication and admin access
router.use(authenticateToken);
router.use(isAdmin);

// TwoBetSlip routes
router.get('/bet-slips', (req, res) => adminBetController.getBetSlips(req, res));
router.get('/bet-slips/:id', (req, res) => adminBetController.getBetSlipById(req, res));
router.put('/bet-slips/:id/status', (req, res) => adminBetController.updateBetSlipStatus(req, res));
router.delete('/bet-slips/:id', (req, res) => adminBetController.deleteBetSlip(req, res));

// TwoBet (Bet Detail) routes
router.get('/bet-details', (req, res) => adminBetController.getBetDetails(req, res));
router.get('/bet-details/:id', (req, res) => adminBetController.getBetDetailById(req, res));
router.put('/bet-details/:id', (req, res) => adminBetController.updateBetDetail(req, res));
router.delete('/bet-details/:id', (req, res) => adminBetController.deleteBetDetail(req, res));

// HeadClose routes
router.get('/head-closes', (req, res) => adminBetController.getHeadCloses(req, res));
router.get('/head-closes/:id', (req, res) => adminBetController.getHeadCloseById(req, res));
router.post('/head-closes', (req, res) => adminBetController.createHeadClose(req, res));
router.put('/head-closes/:id', (req, res) => adminBetController.updateHeadClose(req, res));
router.delete('/head-closes/:id', (req, res) => adminBetController.deleteHeadClose(req, res));

// TwoDResult routes
router.get('/results', (req, res) => adminBetController.getResults(req, res));
router.get('/results/:id', (req, res) => adminBetController.getResultById(req, res));
router.post('/results', (req, res) => adminBetController.createResult(req, res));
router.put('/results/:id', (req, res) => adminBetController.updateResult(req, res));
router.delete('/results/:id', (req, res) => adminBetController.deleteResult(req, res));

export default router;

