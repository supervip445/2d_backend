import { Request, Response, NextFunction } from 'express';
import { TwoDigitService } from '../services/twoDigit.service';
import { TwoDigitFilters } from '../types/twoDigit.types';
import { AppError } from '../exceptions/AppError';
import { BadRequestException } from '../exceptions/BadRequestException';

const twoDigitService = new TwoDigitService();

export class TwoDigitController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: TwoDigitFilters = {
        status: req.query.status ? Number(req.query.status) : undefined,
        search: req.query.search as string,
      };
      const digits = await twoDigitService.getAll(filters);
      res.json(digits);
    } catch (error) {
      next(new AppError('Error fetching two-digit numbers', 500));
    }
  }

  async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const digits = await twoDigitService.getActive();
      res.json(digits);
    } catch (error) {
      next(new AppError('Error fetching active digits', 500));
    }
  }

  async getInactive(req: Request, res: Response, next: NextFunction) {
    try {
      const digits = await twoDigitService.getInactive();
      res.json(digits);
    } catch (error) {
      next(new AppError('Error fetching inactive digits', 500));
    }
  }

  async closeDigit(req: Request, res: Response, next: NextFunction) {
    try {
      const { two_digit } = req.params;
      
      if (!two_digit || !/^\d{2}$/.test(two_digit)) {
        throw new BadRequestException('Invalid two-digit number format');
      }

      const digit = await twoDigitService.closeDigit(two_digit);
      res.json(digit);
    } catch (error) {
      if (error instanceof BadRequestException) {
        next(error);
      } else {
        next(new AppError('Error closing digit', 500));
      }
    }
  }

  async openDigit(req: Request, res: Response, next: NextFunction) {
    try {
      const { two_digit } = req.params;
      
      if (!two_digit || !/^\d{2}$/.test(two_digit)) {
        throw new BadRequestException('Invalid two-digit number format');
      }

      const digit = await twoDigitService.openDigit(two_digit);
      res.json(digit);
    } catch (error) {
      if (error instanceof BadRequestException) {
        next(error);
      } else {
        next(new AppError('Error opening digit', 500));
      }
    }
  }

  async checkStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { two_digit } = req.params;
      
      if (!two_digit || !/^\d{2}$/.test(two_digit)) {
        throw new BadRequestException('Invalid two-digit number format');
      }

      const isActive = await twoDigitService.isActive(two_digit);
      res.json({ isActive });
    } catch (error) {
      if (error instanceof BadRequestException) {
        next(error);
      } else {
        next(new AppError('Error checking digit status', 500));
      }
    }
  }
} 