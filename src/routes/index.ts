import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import twoDigitRoutes from './twoDigit.routes';
import betRoutes from './bet.routes';
import adminBetRoutes from './adminBet.routes';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

router.use('/user', userRoutes);
router.use('/two-digit', twoDigitRoutes);
router.use('/bets', betRoutes);
router.use('/admin', adminBetRoutes);
export default router;
