import { Router, RequestHandler } from 'express';
import { AdminBetController } from '../controllers/adminBet.controller';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();
const adminBetController = new AdminBetController();

// All routes require authentication and admin access
router.use(authenticateToken as RequestHandler);
router.use(isAdmin as RequestHandler);

// TwoBetSlip routes
router.get('/bet-slips', asyncHandler(adminBetController.getBetSlips.bind(adminBetController)));
router.get('/bet-slips/:id', asyncHandler(adminBetController.getBetSlipById.bind(adminBetController)));
router.put('/bet-slips/:id/status', asyncHandler(adminBetController.updateBetSlipStatus.bind(adminBetController)));
router.delete('/bet-slips/:id', asyncHandler(adminBetController.deleteBetSlip.bind(adminBetController)));

// TwoBet (Bet Detail) routes
router.get('/bet-details', asyncHandler(adminBetController.getBetDetails.bind(adminBetController)));
router.get('/bet-details/:id', asyncHandler(adminBetController.getBetDetailById.bind(adminBetController)));
router.put('/bet-details/:id', asyncHandler(adminBetController.updateBetDetail.bind(adminBetController)));
router.delete('/bet-details/:id', asyncHandler(adminBetController.deleteBetDetail.bind(adminBetController)));

// HeadClose routes
router.get('/head-closes', asyncHandler(adminBetController.getHeadCloses.bind(adminBetController)));
router.get('/head-closes/:id', asyncHandler(adminBetController.getHeadCloseById.bind(adminBetController)));
router.post('/head-closes', asyncHandler(adminBetController.createHeadClose.bind(adminBetController)));
router.put('/head-closes/:id', asyncHandler(adminBetController.updateHeadClose.bind(adminBetController)));
router.delete('/head-closes/:id', asyncHandler(adminBetController.deleteHeadClose.bind(adminBetController)));

// TwoDResult routes
router.get('/results', asyncHandler(adminBetController.getResults.bind(adminBetController)));
router.get('/results/:id', asyncHandler(adminBetController.getResultById.bind(adminBetController)));
router.post('/results', asyncHandler(adminBetController.createResult.bind(adminBetController)));
router.put('/results/:id', asyncHandler(adminBetController.updateResult.bind(adminBetController)));
router.delete('/results/:id', asyncHandler(adminBetController.deleteResult.bind(adminBetController)));

export default router;

