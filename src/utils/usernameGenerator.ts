import { prismaClient } from '../index';
import { Role } from '@prisma/client';

type UsernameGeneratableRole = 'Agent' | 'Sub_Agent' | 'Player';

/**
 * Generate auto-incrementing username based on role
 * Agent: AG000001, AG000002, etc.
 * Sub_Agent: SA0000001, SA0000002, etc.
 * Player: P00000001, P00000002, etc.
 */
export async function generateUsername(role: Role): Promise<string> {
  const roleConfig: Record<UsernameGeneratableRole, { prefix: string; digits: number; padding: number }> = {
    Agent: {
      prefix: 'AG',
      digits: 6,
      padding: 4,
    },
    Sub_Agent: {
      prefix: 'SA',
      digits: 9,
      padding: 7,
    },
    Player: {
      prefix: 'P',
      digits: 9,
      padding: 8,
    },
  };

  // Validate role is one that can generate usernames
  if (role === 'Owner' || !['Agent', 'Sub_Agent', 'Player'].includes(role)) {
    throw new Error(`Invalid role for username generation: ${role}. Only Agent, Sub_Agent, and Player can have auto-generated usernames.`);
  }

  const config = roleConfig[role as UsernameGeneratableRole];

  // Find the highest existing username for this role
  const users = await prismaClient.user.findMany({
    where: {
      role,
      user_name: {
        startsWith: config.prefix,
      },
    },
    select: {
      user_name: true,
    },
    orderBy: {
      user_name: 'desc',
    },
    take: 1,
  });

  let nextNumber = 1;

  if (users.length > 0 && users[0].user_name) {
    // Extract the number part from the username
    const lastUsername = users[0].user_name;
    const numberPart = lastUsername.replace(config.prefix, '');
    const lastNumber = parseInt(numberPart, 10);
    
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  // Format with leading zeros
  const numberString = nextNumber.toString().padStart(config.padding, '0');
  return `${config.prefix}${numberString}`;
}

