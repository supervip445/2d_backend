import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
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
  console.log('Seeding completed!');

  // Create Owner
  const owner = await prisma.user.create({
    data: {
      name: 'System Owner',
      user_name: 'owner',
      email: 'owner@example.com',
      phone: '1234567890',
      password: await bcrypt.hash('owner123', 10),
      role: 'Owner',
      balance: 500000
    }
  });

  // Create Agent
  const agent = await prisma.user.create({
    data: {
      name: 'Main Agent',
      user_name: 'agent',
      email: 'agent@example.com',
      phone: '1234567891',
      password: await bcrypt.hash('agent123', 10),
      role: 'Agent',
      balance: 400000,
      agent_id: owner.id
    }
  });

  // Create Sub Agent
  const subAgent = await prisma.user.create({
    data: {
      name: 'Sub Agent',
      user_name: 'subagent',
      email: 'subagent@example.com',
      phone: '1234567892',
      password: await bcrypt.hash('subagent123', 10),
      role: 'Sub_Agent',
      balance: 300000,
      agent_id: agent.id
    }
  });

  // Create Player
  const player = await prisma.user.create({
    data: {
      name: 'Test Player',
      user_name: 'player',
      email: 'player@example.com',
      phone: '1234567893',
      password: await bcrypt.hash('player123', 10),
      role: 'Player',
      balance: 100000,
      agent_id: subAgent.id
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 