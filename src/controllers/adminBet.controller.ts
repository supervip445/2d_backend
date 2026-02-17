import { Request, Response } from 'express';
import { prismaClient } from '../index';
import { BadRequestsException, ErrorCode } from '../exceptions/root';

export class AdminBetController {
  // ==================== TwoBetSlip CRUD ====================
  
  async getBetSlips(req: Request, res: Response) {
    try {
      const { session, status, date, userId } = req.query;
      
      const where: any = {};
      if (session) where.session = session;
      if (status) where.status = status;
      if (date) where.game_date = new Date(date as string);
      if (userId) where.user_id = parseInt(userId as string);

      const betSlips = await prismaClient.twoBetSlip.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, user_name: true, role: true },
          },
          agent: {
            select: { id: true, name: true, user_name: true },
          },
          twoBets: {
            select: {
              id: true,
              bet_number: true,
              bet_amount: true,
              win_lose: true,
              bet_status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({
        success: true,
        data: betSlips,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch bet slips',
      });
    }
  }

  async getBetSlipById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const betSlip = await prismaClient.twoBetSlip.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: true,
          agent: true,
          twoBets: true,
        },
      });

      if (!betSlip) {
        return res.status(404).json({
          success: false,
          message: 'Bet slip not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: betSlip,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch bet slip',
      });
    }
  }

  async updateBetSlipStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'completed', 'cancelled'].includes(status)) {
        throw new BadRequestsException('Invalid status', ErrorCode.INVALID_INPUT);
      }

      const betSlip = await prismaClient.twoBetSlip.update({
        where: { id: parseInt(id) },
        data: { status },
      });

      return res.status(200).json({
        success: true,
        data: betSlip,
        message: 'Bet slip status updated successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update bet slip',
      });
    }
  }

  async deleteBetSlip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prismaClient.twoBetSlip.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        success: true,
        message: 'Bet slip deleted successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete bet slip',
      });
    }
  }

  // ==================== TwoBet (Bet Detail) CRUD ====================

  async getBetDetails(req: Request, res: Response) {
    try {
      const { slipId, userId, betNumber, session, date } = req.query;
      
      const where: any = {};
      if (slipId) where.slip_id = parseInt(slipId as string);
      if (userId) where.user_id = parseInt(userId as string);
      if (betNumber) where.bet_number = betNumber;
      if (session) where.session = session;
      if (date) where.game_date = new Date(date as string);

      const bets = await prismaClient.twoBet.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, user_name: true },
          },
          betSlip: {
            select: { id: true, slip_no: true, total_bet_amount: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({
        success: true,
        data: bets,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch bet details',
      });
    }
  }

  async getBetDetailById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bet = await prismaClient.twoBet.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: true,
          betSlip: true,
          battle: true,
        },
      });

      if (!bet) {
        return res.status(404).json({
          success: false,
          message: 'Bet detail not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: bet,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch bet detail',
      });
    }
  }

  async updateBetDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { bet_amount, win_lose, bet_status, bet_result, potential_payout } = req.body;

      const updateData: any = {};
      if (bet_amount !== undefined) updateData.bet_amount = bet_amount;
      if (win_lose !== undefined) updateData.win_lose = win_lose;
      if (bet_status !== undefined) updateData.bet_status = bet_status;
      if (bet_result !== undefined) updateData.bet_result = bet_result;
      if (potential_payout !== undefined) updateData.potential_payout = potential_payout;

      const bet = await prismaClient.twoBet.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        data: bet,
        message: 'Bet detail updated successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update bet detail',
      });
    }
  }

  async deleteBetDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prismaClient.twoBet.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        success: true,
        message: 'Bet detail deleted successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete bet detail',
      });
    }
  }

  // ==================== HeadClose CRUD ====================

  async getHeadCloses(req: Request, res: Response) {
    try {
      const { status } = req.query;
      
      const where: any = {};
      if (status !== undefined) where.status = status === 'true' || status === '1';

      const headCloses = await prismaClient.headClose.findMany({
        where,
        orderBy: { head_close_digit: 'asc' },
      });

      return res.status(200).json({
        success: true,
        data: headCloses,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch head closes',
      });
    }
  }

  async getHeadCloseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const headClose = await prismaClient.headClose.findUnique({
        where: { id: parseInt(id) },
      });

      if (!headClose) {
        return res.status(404).json({
          success: false,
          message: 'Head close not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: headClose,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch head close',
      });
    }
  }

  async createHeadClose(req: Request, res: Response) {
    try {
      const { head_close_digit, status } = req.body;

      if (!head_close_digit || !/^[0-9]$/.test(head_close_digit)) {
        throw new BadRequestsException('Invalid head_close_digit (must be 0-9)', ErrorCode.INVALID_INPUT);
      }

      const headClose = await prismaClient.headClose.create({
        data: {
          head_close_digit,
          status: status !== undefined ? status : true,
        },
      });

      return res.status(201).json({
        success: true,
        data: headClose,
        message: 'Head close created successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create head close',
      });
    }
  }

  async updateHeadClose(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { head_close_digit, status } = req.body;

      const updateData: any = {};
      if (head_close_digit !== undefined) {
        if (!/^[0-9]$/.test(head_close_digit)) {
          throw new BadRequestsException('Invalid head_close_digit (must be 0-9)', ErrorCode.INVALID_INPUT);
        }
        updateData.head_close_digit = head_close_digit;
      }
      if (status !== undefined) updateData.status = status;

      const headClose = await prismaClient.headClose.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        data: headClose,
        message: 'Head close updated successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update head close',
      });
    }
  }

  async deleteHeadClose(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prismaClient.headClose.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        success: true,
        message: 'Head close deleted successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete head close',
      });
    }
  }

  // ==================== TwoDResult CRUD ====================

  async getResults(req: Request, res: Response) {
    try {
      const { date, session } = req.query;
      
      const where: any = {};
      if (date) where.result_date = new Date(date as string);
      if (session) where.session = session;

      const results = await prismaClient.twoDResult.findMany({
        where,
        orderBy: [
          { result_date: 'desc' },
          { session: 'desc' },
        ],
      });

      return res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch results',
      });
    }
  }

  async getResultById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await prismaClient.twoDResult.findUnique({
        where: { id: parseInt(id) },
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Result not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch result',
      });
    }
  }

  async createResult(req: Request, res: Response) {
    try {
      const { result_date, session, win_number } = req.body;

      if (!result_date || !session || !win_number) {
        throw new BadRequestsException('result_date, session, and win_number are required', ErrorCode.INVALID_INPUT);
      }

      if (!['morning', 'evening'].includes(session)) {
        throw new BadRequestsException('Invalid session (must be morning or evening)', ErrorCode.INVALID_INPUT);
      }

      if (!/^[0-9]{2}$/.test(win_number)) {
        throw new BadRequestsException('Invalid win_number (must be 2 digits)', ErrorCode.INVALID_INPUT);
      }

      const result = await prismaClient.twoDResult.create({
        data: {
          result_date: new Date(result_date),
          session,
          win_number,
        },
      });

      // Update related bets to mark winners
      // First, get all winning bets
      const winningBets = await prismaClient.twoBet.findMany({
        where: {
          game_date: new Date(result_date),
          session,
          bet_number: win_number,
        },
      });

      // Update each winning bet with payout calculation
      for (const bet of winningBets) {
        await prismaClient.twoBet.update({
          where: { id: bet.id },
          data: {
            win_lose: true,
            bet_status: true,
            bet_result: win_number,
            potential_payout: bet.bet_amount.toNumber() * 80,
          },
        });
      }

      // Update bet slip status to completed
      await prismaClient.twoBetSlip.updateMany({
        where: {
          game_date: new Date(result_date),
          session,
          status: 'pending',
        },
        data: {
          status: 'completed',
        },
      });

      return res.status(201).json({
        success: true,
        data: result,
        message: 'Result created and bets updated successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create result',
      });
    }
  }

  async updateResult(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { result_date, session, win_number } = req.body;

      const updateData: any = {};
      if (result_date) updateData.result_date = new Date(result_date);
      if (session) {
        if (!['morning', 'evening'].includes(session)) {
          throw new BadRequestsException('Invalid session', ErrorCode.INVALID_INPUT);
        }
        updateData.session = session;
      }
      if (win_number) {
        if (!/^[0-9]{2}$/.test(win_number)) {
          throw new BadRequestsException('Invalid win_number', ErrorCode.INVALID_INPUT);
        }
        updateData.win_number = win_number;
      }

      const result = await prismaClient.twoDResult.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Result updated successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update result',
      });
    }
  }

  async deleteResult(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prismaClient.twoDResult.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        success: true,
        message: 'Result deleted successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete result',
      });
    }
  }
}

