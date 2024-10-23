// seed.ts
import { PrismaClient, TimeSlot } from '@prisma/client';
import sessions from './data/sessions.json'; // Import slots data
import { Logger } from '@nestjs/common';
import {
  formatDate,
  generateUniqueMovieName,
  isMovieExist,
  sleep,
} from 'src/utils/functions';

const prisma = new PrismaClient();
const logger = new Logger('Seeding - s');

export async function createSessions() {
  for (const session of sessions) {
    const uniqueMovieName = generateUniqueMovieName(
      session.name,
      session.writer,
    );
    try {
      const movie = await isMovieExist(uniqueMovieName);
      if (!movie) {
        logger.error(`Movie with uniqueName ${uniqueMovieName} not found`);
        continue;
      }
      await prisma.session.create({
        data: {
          date: formatDate(
            new Date(session.date),
            session.timeSlot as TimeSlot,
          ),
          timeSlot: session.timeSlot as TimeSlot,
          roomNumber: session.roomNumber,
          movie: {
            connect: { id: movie.id },
          },
        },
      });
      logger.log(`Created session for movie ${uniqueMovieName}`);
    } catch (error) {
      logger.error(
        `Failed to create session for ${uniqueMovieName}: ${error.message}`,
      );
    }
  }
  await sleep(2000);
  console.log('Sessions have been seeded');
}
