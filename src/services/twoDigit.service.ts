import { PrismaClient } from '@prisma/client';
import { TwoDigit, CreateTwoDigitDto, UpdateTwoDigitDto, TwoDigitFilters } from '../types/twoDigit.types';

const prisma = new PrismaClient();

export class TwoDigitService {
  /**
   * Get all two-digit numbers with optional filters
   */
  async getAll(filters?: TwoDigitFilters): Promise<TwoDigit[]> {
    const where: any = {};
    
    if (filters?.status !== undefined) {
      where.status = filters.status;
    }
    
    if (filters?.search) {
      where.two_digit = {
        contains: filters.search,
      };
    }

    return prisma.twoDigit.findMany({
      where,
      orderBy: {
        two_digit: 'asc',
      },
    });
  }

  /**
   * Get a specific two-digit number by its value
   */
  async getByDigit(two_digit: string): Promise<TwoDigit | null> {
    return prisma.twoDigit.findUnique({
      where: { two_digit },
    });
  }

  /**
   * Get all active two-digit numbers
   */
  async getActive(): Promise<TwoDigit[]> {
    return prisma.twoDigit.findMany({
      where: { status: 1 },
      orderBy: {
        two_digit: 'asc',
      },
    });
  }

  /**
   * Get all inactive two-digit numbers
   */
  async getInactive(): Promise<TwoDigit[]> {
    return prisma.twoDigit.findMany({
      where: { status: 0 },
      orderBy: {
        two_digit: 'asc',
      },
    });
  }

  /**
   * Update the status of a two-digit number
   */
  async updateStatus(two_digit: string, status: number): Promise<TwoDigit> {
    return prisma.twoDigit.update({
      where: { two_digit },
      data: { status },
    });
  }

  /**
   * Close a two-digit number (set status to 0)
   */
  async closeDigit(two_digit: string): Promise<TwoDigit> {
    return this.updateStatus(two_digit, 0);
  }

  /**
   * Open a two-digit number (set status to 1)
   */
  async openDigit(two_digit: string): Promise<TwoDigit> {
    return this.updateStatus(two_digit, 1);
  }

  /**
   * Check if a two-digit number is active
   */
  async isActive(two_digit: string): Promise<boolean> {
    const digit = await this.getByDigit(two_digit);
    return digit?.status === 1;
  }
} 