import { Router, RequestHandler } from 'express';
import { BetController } from '../controllers/bet.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();
const betController = new BetController();

// All bet routes require authentication
router.use(authenticateToken as RequestHandler);

// Place a bet
router.post('/', asyncHandler(betController.placeBet.bind(betController)));

// Get bet slips (history)
router.get('/slips', asyncHandler(betController.getBetSlips.bind(betController)));

// Get evening session slips
router.get('/slips/evening', asyncHandler(betController.getEveningSessionSlips.bind(betController)));

// Get daily winners
router.get('/winners', asyncHandler(betController.getDailyWinners.bind(betController)));

export default router;

