import { prismaClient } from '../index';
import { Prisma } from '@prisma/client';
import { SessionHelper, BetSession } from '../utils/sessionHelper';
import { SlipNumberGeneratorService } from './slipNumberGenerator.service';
import { LimitCheckerService } from './limitChecker.service';
import { WalletService } from './wallet.service';
import { BadRequestsException, ErrorCode } from '../exceptions/root';

interface BetAmount {
  num: string;  // 2-digit number
  amount: number;
}

interface BetPlacementResult {
  success: boolean;
  message?: string;
  overLimitDigits?: string[];
  error?: string;
}

/**
 * Bet Placement Service
 * Handles the core logic for placing 2D bets
 */
export class BetPlacementService {
  private slipNumberGenerator: SlipNumberGeneratorService;
  private limitChecker: LimitCheckerService;
  private walletService: WalletService;

  constructor() {
    this.slipNumberGenerator = new SlipNumberGeneratorService();
    this.limitChecker = new LimitCheckerService();
    this.walletService = new WalletService();
  }

  /**
   * Place a 2D bet
   */
  async play(
    userId: number,
    totalBetAmount: number,
    amounts: BetAmount[]
  ): Promise<BetPlacementResult> {
    // 1. Check if betting is open (active battle session)
    const currentBattle = await prismaClient.battle.findFirst({
      where: { status: true },
    });

    if (!currentBattle) {
      return {
        success: false,
        error: 'Betting is currently closed. No active battle session found.',
      };
    }

    // 2. Determine current session
    const sessionType = SessionHelper.getCurrentSession();
    if (sessionType === 'closed') {
      return {
        success: false,
        error: 'Betting is currently closed. No active battle session found.',
      };
    }

    const gameDate = SessionHelper.getCurrentGameDate();
    const gameTime = currentBattle.end_time || new Date();

    // 3. Validate total amount matches sum of individual amounts
    const calculatedTotal = amounts.reduce((sum, bet) => sum + bet.amount, 0);
    if (Math.abs(calculatedTotal - totalBetAmount) > 0.01) {
      return {
        success: false,
        error: `Total bet amount mismatch! You sent totalAmount: ${totalBetAmount}, but the sum of individual amounts is: ${calculatedTotal}`,
      };
    }

    // 4. Get user and check balance
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    if (user.balance.toNumber() < totalBetAmount) {
      return {
        success: false,
        error: 'Insufficient funds in your main balance.',
      };
    }

    // 5. Get overall 2D limit
    const overallTwoDLimit = await prismaClient.twoDLimit.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!overallTwoDLimit) {
      return {
        success: false,
        error: 'Overall 2D limit (break) not set.',
      };
    }

    const overallBreakAmount = overallTwoDLimit.two_d_limit.toNumber();
    const userPersonalLimit = user.two_d_limit?.toNumber() || null;

    // 6. Check all limits
    let overLimitDigits = await this.limitChecker.checkAllLimits(
      amounts,
      sessionType,
      gameDate,
      overallBreakAmount,
      userPersonalLimit
    );

    // 7. Check user personal limits for each digit
    if (userPersonalLimit !== null && overLimitDigits.length === 0) {
      for (const betAmount of amounts) {
        const twoDigit = String(betAmount.num).padStart(2, '0');
        const isWithinLimit = await this.limitChecker.checkUserPersonalLimit(
          userId,
          twoDigit,
          betAmount.amount,
          sessionType,
          gameDate,
          userPersonalLimit
        );

        if (!isWithinLimit) {
          overLimitDigits.push(twoDigit);
        }
      }
    }

    if (overLimitDigits.length > 0) {
      return {
        success: false,
        overLimitDigits,
        error: 'Over limit digits',
      };
    }

    // 8. Generate unique slip number
    const slipNo = await this.slipNumberGenerator.generateUniqueSlipNumber();

    // 9. Get before balance
    const beforeBalance = user.balance.toNumber();

    // 10. Perform transaction: deduct balance and create bet records
    try {
      await prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
        // Deduct balance from user
        await tx.user.update({
          where: { id: userId },
          data: { balance: { decrement: totalBetAmount } },
        });

        // Get updated balance
        const updatedUser = await tx.user.findUnique({
          where: { id: userId },
        });
        const afterBalance = updatedUser?.balance.toNumber() || beforeBalance - totalBetAmount;

        // Create TwoBetSlip record
        const twoBetSlip = await tx.twoBetSlip.create({
          data: {
            slip_no: slipNo,
            user_id: userId,
            player_name: user.user_name || user.name || `User${userId}`,
            agent_id: user.agent_id,
            total_bet_amount: totalBetAmount,
            session: sessionType,
            status: 'pending',
            game_date: new Date(gameDate),
            game_time: gameTime,
            before_balance: beforeBalance,
            after_balance: afterBalance,
          },
        });

        // Create individual TwoBet records
        for (const betDetail of amounts) {
          const twoDigit = String(betDetail.num).padStart(2, '0');
          const subAmount = betDetail.amount;

          // Get choose_digit and head_close records if they exist
          const chooseDigit = await tx.chooseDigit.findFirst({
            where: { choose_close_digit: twoDigit },
          });

          const headDigit = twoDigit.substring(0, 1);
          const headClose = await tx.headClose.findFirst({
            where: { head_close_digit: headDigit },
          });

          await tx.twoBet.create({
            data: {
              user_id: userId,
              member_name: user.user_name || user.name || `User${userId}`,
              bettle_id: currentBattle.id,
              choose_digit_id: chooseDigit?.id || null,
              head_close_id: headClose?.id || null,
              agent_id: user.agent_id,
              bet_number: twoDigit,
              bet_amount: subAmount,
              session: sessionType,
              win_lose: false,
              potential_payout: 0,
              bet_status: false,
              game_date: new Date(gameDate),
              game_time: gameTime,
              slip_id: twoBetSlip.id,
            },
          });
        }
      });

      return {
        success: true,
        message: 'Bet placed successfully.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred while placing the bet.',
      };
    }
  }
}

