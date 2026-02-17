import { Request, Response } from 'express';
import { BetPlacementService } from '../services/betPlacement.service';
import { SessionHelper } from '../utils/sessionHelper';
import { prismaClient } from '../index';
import { BadRequestsException, ErrorCode } from '../exceptions/root';

export class BetController {
  private betPlacementService: BetPlacementService;

  constructor() {
    this.betPlacementService = new BetPlacementService();
  }

  /**
   * Place a 2D bet
   * POST /api/bets
   */
  async placeBet(req: Request, res: Response) {
    try {
      // Check authentication
      if (!req.user) {
        throw new BadRequestsException('Authentication required', ErrorCode.INVALID_TOKEN);
      }

      const userId = req.user.id;
      const { totalAmount, amounts } = req.body;

      // Validate input
      if (!totalAmount || !amounts || !Array.isArray(amounts) || amounts.length === 0) {
        throw new BadRequestsException('Invalid request. totalAmount and amounts array are required.', ErrorCode.INVALID_INPUT);
      }

      // Validate amounts structure
      for (const amount of amounts) {
        if (!amount.num || typeof amount.amount !== 'number' || amount.amount <= 0) {
          throw new BadRequestsException('Invalid amounts format. Each amount must have num (string) and amount (number > 0).', ErrorCode.INVALID_INPUT);
        }
      }

      // Place bet
      const result = await this.betPlacementService.play(userId, totalAmount, amounts);

      if (!result.success) {
        if (result.overLimitDigits && result.overLimitDigits.length > 0) {
          const digitStrings = result.overLimitDigits.map(d => `'${d}'`).join(', ');
          const message = `သင့်ရွှေးချယ်ထားသော ${digitStrings} ဂဏန်းမှာ သတ်မှတ် အမောင့်ထက်ကျော်လွန်ပါသောကြောင့် ကံစမ်း၍မရနိုင်ပါ။`;
          
          return res.status(400).json({
            success: false,
            message,
            error: 'Over Limit',
            overLimitDigits: result.overLimitDigits,
          });
        }

        if (result.error === 'Insufficient funds in your main balance.') {
          return res.status(400).json({
            success: false,
            message: 'လက်ကျန်ငွေ မလုံလောက်ပါ။',
            error: 'Insufficient Funds',
          });
        }

        if (result.error?.includes('closed') || result.error?.includes('No active battle')) {
          return res.status(401).json({
            success: false,
            message: 'This 2D lottery Bettle is closed at this time. Welcome back next time!',
            error: 'Betting Closed',
          });
        }

        return res.status(400).json({
          success: false,
          message: result.error || 'Betting failed',
          error: result.error || 'Betting Failed',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'ထီအောင်မြင်စွာ ထိုးပြီးပါပြီ။',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'An unexpected error occurred. Please try again later.',
        error: 'Server Error',
      });
    }
  }

  /**
   * Get user's bet slips (history)
   * GET /api/bets/slips
   */
  async getBetSlips(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new BadRequestsException('Authentication required', ErrorCode.INVALID_TOKEN);
      }

      const userId = req.user.id;
      const { session, date } = req.query;

      // Determine session and date
      let sessionType: 'morning' | 'evening';
      let gameDate: string;

      if (session && (session === 'morning' || session === 'evening')) {
        sessionType = session;
      } else {
        // Auto-determine session based on current time
        const currentSession = SessionHelper.getCurrentSession();
        if (currentSession === 'closed') {
          sessionType = 'evening'; // Default to evening if closed
        } else {
          sessionType = currentSession;
        }
      }

      gameDate = date ? String(date) : SessionHelper.getCurrentGameDate();

      // Get bet slips
      const betSlips = await prismaClient.twoBetSlip.findMany({
        where: {
          user_id: userId,
          session: sessionType,
          game_date: new Date(gameDate),
          status: {
            in: ['pending', 'completed'],
          },
        },
        include: {
          twoBets: {
            select: {
              id: true,
              bet_number: true,
              bet_amount: true,
              session: true,
              win_lose: true,
              bet_status: true,
              game_date: true,
              game_time: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json({
        success: true,
        data: betSlips,
        message: `Your ${sessionType} session two-digit bet slips retrieved successfully.`,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'An error occurred while retrieving bet slips.',
        error: 'Server Error',
      });
    }
  }

  /**
   * Get evening session slips
   * GET /api/bets/slips/evening
   */
  async getEveningSessionSlips(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new BadRequestsException('Authentication required', ErrorCode.INVALID_TOKEN);
      }

      const userId = req.user.id;
      const { date } = req.query;

      const gameDate = date ? String(date) : SessionHelper.getCurrentGameDate();

      const betSlips = await prismaClient.twoBetSlip.findMany({
        where: {
          user_id: userId,
          session: 'evening',
          game_date: new Date(gameDate),
          status: {
            in: ['pending', 'completed'],
          },
        },
        include: {
          twoBets: {
            select: {
              id: true,
              bet_number: true,
              bet_amount: true,
              session: true,
              win_lose: true,
              bet_status: true,
              game_date: true,
              game_time: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json({
        success: true,
        data: betSlips,
        message: 'Your evening session two-digit bet slips retrieved successfully.',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'An error occurred while retrieving bet slips.',
        error: 'Server Error',
      });
    }
  }

  /**
   * Get daily winners
   * GET /api/bets/winners
   */
  async getDailyWinners(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new BadRequestsException('Authentication required', ErrorCode.INVALID_TOKEN);
      }

      const { date, session } = req.query;
      const resultDate = date ? String(date) : SessionHelper.getCurrentGameDate();

      // If session is provided, return single session result
      if (session && (session === 'morning' || session === 'evening')) {
        const result = await prismaClient.twoDResult.findFirst({
          where: {
            result_date: new Date(resultDate),
            session: session,
          },
        });

        if (!result || !result.win_number) {
          return res.status(404).json({
            success: false,
            message: 'No result found for given session and date.',
            error: 'Not Found',
          });
        }

        // Get winners
        const winners = await prismaClient.twoBet.findMany({
          where: {
            game_date: new Date(resultDate),
            session: session,
            bet_number: result.win_number,
            win_lose: true,
          },
          select: {
            member_name: true,
            bet_amount: true,
          },
        });

        const winnersWithAmounts = winners.map((winner: any) => ({
          member_name: winner.member_name,
          bet_amount: winner.bet_amount.toNumber(),
          win_amount: winner.bet_amount.toNumber() * 80, // 80x multiplier
        }));

        return res.status(200).json({
          success: true,
          data: {
            date: resultDate,
            session: session,
            win_digit: result.win_number,
            winners: winnersWithAmounts,
          },
          message: '2D winner list retrieved',
        });
      }

      // Default: return latest results
      const recentResults = await prismaClient.twoDResult.findMany({
        orderBy: [
          { result_date: 'desc' },
          { session: 'desc' },
        ],
        take: 10,
      });

      const data = [];

      for (const result of recentResults) {
        const winners = await prismaClient.twoBet.findMany({
          where: {
            game_date: result.result_date,
            session: result.session,
            bet_number: result.win_number,
            win_lose: true,
          },
          select: {
            member_name: true,
            bet_amount: true,
          },
        });

        const winnersWithAmounts = winners.map((winner: any) => ({
          member_name: winner.member_name,
          bet_amount: winner.bet_amount.toNumber(),
          win_amount: winner.bet_amount.toNumber() * 80,
        }));

        data.push({
          date: result.result_date.toISOString().split('T')[0],
          session: result.session,
          win_digit: result.win_number,
          winners: winnersWithAmounts,
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          latest_results: data,
        },
        message: 'Latest 2D winners (with winners list)',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'An error occurred while retrieving winners.',
        error: 'Server Error',
      });
    }
  }
}

