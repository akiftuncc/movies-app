// seed.ts
import { PrismaClient } from '@prisma/client';
import movies from './data/movies.json'; // Ensure you have a movies.json file with movie data
import { Logger } from '@nestjs/common';
import {
  generateTickets,
  generateUniqueMovieName,
  sleep,
} from 'src/utils/functions';
import { TICKET_NUMBERS } from 'src/utils/constants';

const prisma = new PrismaClient();
const logger = new Logger('Seeding - tickets');

export async function addTicketsToSessions() {
  const sessions = await prisma.session.findMany();
  for (const session of sessions) {
    await generateTickets(session.id);
  }
}
