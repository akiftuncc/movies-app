import { PrismaClient } from '@prisma/client';
import { createUsers } from './create-users';
import { createMovies } from './create-movies';
import { generateTickets, sleep } from 'src/utils/functions';
import { createSessions } from './add-sessions-to-movies';
import { addTicketsToSessions } from './add-tickets-to-sessions';
const prisma = new PrismaClient();

async function main() {
  await createUsers();
  await createMovies();
  await createSessions();
  await addTicketsToSessions();
}

main().finally(async () => {
  await prisma.$disconnect();
});
