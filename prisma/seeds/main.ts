import { PrismaClient } from '@prisma/client';
import { createUsers } from './create-users';
import { createMovies } from './create-movies';
import { sleep } from 'src/utils/functions';
import { createSessions } from './add-sessions-to-movies';
const prisma = new PrismaClient();

async function main() {
  await createUsers();
  await createMovies();
  await createSessions();
}

main().finally(async () => {
  await prisma.$disconnect();
});
