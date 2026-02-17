import { prismaClient } from '../index';
import { Prisma } from '@prisma/client';

/**
 * Slip Number Generator Service
 * Generates unique slip numbers in format: NNNNNN-mk-2d-YYYY-MM-DD-HH:MM:SS
 * Example: 000001-mk-2d-2026-02-15-02:15:02
 */
export class SlipNumberGeneratorService {
  private readonly maxRetries = 20;
  private readonly customString = 'mk-2d';

  /**
   * Generate a unique slip number with atomic counter increment
   */
  async generateUniqueSlipNumber(): Promise<string> {
    let attempt = 0;

    do {
      attempt++;

      // Get the base slip number with atomic counter increment
      const slipNo = await this.generateBaseSlipNumberWithCounter();

      // Check if this slip number already exists
      const exists = await prismaClient.twoBetSlip.findUnique({
        where: { slip_no: slipNo },
      });

      if (!exists) {
        return slipNo; // Found a unique slip number
      }

      // If collision detected, wait briefly and retry
      if (attempt < this.maxRetries) {
        await this.sleep(Math.random() * 400 + 100); // 100-500 microseconds
      } else {
        throw new Error('Could not generate a unique slip number. Please try again.');
      }
    } while (attempt < this.maxRetries);

    throw new Error('Failed to generate unique slip number after maximum retries');
  }

  /**
   * Generate base slip number with atomic counter increment
   * Uses database transaction with lockForUpdate for atomicity
   */
  private async generateBaseSlipNumberWithCounter(): Promise<string> {
    const currentDate = this.getCurrentDate(); // YYYY-MM-DD
    const currentTime = this.getCurrentTime(); // HH:MM:SS

    // Use transaction to ensure atomic counter increment
    return await prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
      // Get or create counter record with lock
      // Note: Prisma doesn't have lockForUpdate, so we use a workaround
      const counter = await tx.slipNumberCounter.upsert({
        where: { id: 1 },
        update: {
          current_number: { increment: 1 },
        },
        create: {
          id: 1,
          current_number: 1,
        },
      });

      // Get the updated counter value
      const updatedCounter = await tx.slipNumberCounter.findUnique({
        where: { id: 1 },
      });

      const newNumber = updatedCounter?.current_number || counter.current_number;
      const paddedCounter = String(newNumber).padStart(6, '0');

      // Assemble slip number: NNNNNN-mk-2d-YYYY-MM-DD-HH:MM:SS
      return `${paddedCounter}-${this.customString}-${currentDate}-${currentTime}`;
    });
  }

  /**
   * Get current date in YYYY-MM-DD format (Asia/Yangon timezone)
   */
  private getCurrentDate(): string {
    const now = new Date();
    const yangonTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
    return yangonTime.toISOString().split('T')[0];
  }

  /**
   * Get current time in HH:MM:SS format (Asia/Yangon timezone)
   */
  private getCurrentTime(): string {
    const now = new Date();
    const yangonTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
    const hours = String(yangonTime.getHours()).padStart(2, '0');
    const minutes = String(yangonTime.getMinutes()).padStart(2, '0');
    const seconds = String(yangonTime.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

