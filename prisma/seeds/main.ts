import { PrismaClient } from '@prisma/client';
import { createUsers } from './create-users';
import { createMovies } from './create-movies';
import { sleep } from 'src/utils/functions';
const prisma = new PrismaClient();

async function main() {
  await createUsers();
  await createMovies();
}

main().finally(async () => {
  await prisma.$disconnect();
});
