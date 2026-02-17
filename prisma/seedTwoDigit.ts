import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTwoDigits() {
  try {
    // Create two-digit numbers (00-99)
    const twoDigits = Array.from({ length: 100 }, (_, i) => ({
      two_digit: i.toString().padStart(2, '0'),
      status: 1, // All digits are active by default
    }));

    console.log('Seeding two-digit numbers...');
    await prisma.twoDigit.createMany({
      data: twoDigits,
      skipDuplicates: true,
    });
    console.log('Two-digit seeding completed!');
  } catch (error) {
    console.error('Error seeding two-digit numbers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedTwoDigits(); 