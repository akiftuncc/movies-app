// seed.ts
import { PrismaClient, UserType } from '@prisma/client';
import users from './data/users.json';
import { password, sleep } from 'src/utils/functions';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();
const logger = new Logger('Seeding');

export async function createUsers() {
  for (const user of users) {
    try {
      await prisma.user.create({
        data: {
          username: user.username,
          password: password(user.password),
          age: user.age,
          type: user.type as UserType,
        },
      });
      logger.log(`Created user ${user.username}`);
    } catch {
      logger.error(`User already exists ${user.username}`);
    }
  }
  await sleep(2000);
  console.log('Users have been seeded');
}
