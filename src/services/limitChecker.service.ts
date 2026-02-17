import { prismaClient } from '../index';
import { BetSession } from '../utils/sessionHelper';

interface BetAmount {
  num: string;  // 2-digit number (e.g., "01", "23")
  amount: number;
}

/**
 * Limit Checker Service
 * Checks all betting limits before placing bets
 */
export class LimitCheckerService {
  /**
   * Check all limits and return array of over-limit digits
   * Returns empty array if all bets are within limits
   */
  async checkAllLimits(
    amounts: BetAmount[],
    session: BetSession,
    gameDate: string,
    overallBreakAmount: number,
    userPersonalLimit?: number | null
  ): Promise<string[]> {
    const overLimitDigits: string[] = [];

    // When session is closed, treat all digits as over limit
    if (session === 'closed') {
      return amounts.map(a => String(a.num).padStart(2, '0'));
    }

    // Get closed digits from choose_digits table (status = false)
    const closedTwoDigits = await prismaClient.chooseDigit.findMany({
      where: { status: false },
      select: { choose_close_digit: true },
    });
    const closedDigitSet = new Set(
      closedTwoDigits.map(d => String(d.choose_close_digit).padStart(2, '0'))
    );

    // Get closed head digits from head_closes table (status = false)
    const closedHeadDigits = await prismaClient.headClose.findMany({
      where: { status: false },
      select: { head_close_digit: true },
    });
    const closedHeadSet = new Set(
      closedHeadDigits.map(d => String(d.head_close_digit))
    );

    // Check each bet amount
    for (const betAmount of amounts) {
      const twoDigit = String(betAmount.num).padStart(2, '0');
      const subAmount = betAmount.amount;
      const headDigit = twoDigit.substring(0, 1);

      // Check if head digit is closed
      if (closedHeadSet.has(headDigit)) {
        overLimitDigits.push(twoDigit);
        continue;
      }

      // Check if digit is closed
      if (closedDigitSet.has(twoDigit)) {
        overLimitDigits.push(twoDigit);
        continue;
      }

      // Check projected total bet amount for this digit (all users)
      const totalBetAmountForDigit = await prismaClient.twoBet.aggregate({
        where: {
          game_date: new Date(gameDate),
          session: session,
          bet_number: twoDigit,
        },
        _sum: {
          bet_amount: true,
        },
      });

      const currentTotal = totalBetAmountForDigit._sum?.bet_amount?.toNumber() || 0;
      const projectedTotal = currentTotal + subAmount;

      if (projectedTotal > overallBreakAmount) {
        overLimitDigits.push(twoDigit);
        continue;
      }

      // Check projected user bet amount for this digit (if user has personal limit)
      if (userPersonalLimit !== null && userPersonalLimit !== undefined) {
        // Note: We'll need userId from context, but for now we'll skip this check
        // This should be checked in the bet placement service where we have userId
      }
    }

    return overLimitDigits;
  }

  /**
   * Check user's personal limit for a specific digit
   */
  async checkUserPersonalLimit(
    userId: number,
    twoDigit: string,
    subAmount: number,
    session: BetSession,
    gameDate: string,
    userPersonalLimit: number
  ): Promise<boolean> {
    if (session === 'closed') {
      return false;
    }

    const userBetAmountOnDigit = await prismaClient.twoBet.aggregate({
      where: {
        user_id: userId,
        game_date: new Date(gameDate),
        session: session,
        bet_number: twoDigit,
      },
      _sum: {
        bet_amount: true,
      },
    });

    const currentUserBet = userBetAmountOnDigit._sum?.bet_amount?.toNumber() || 0;
    const projectedUserBet = currentUserBet + subAmount;

    return projectedUserBet <= userPersonalLimit;
  }
}

