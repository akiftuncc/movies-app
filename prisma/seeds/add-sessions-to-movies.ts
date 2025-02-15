// seed.ts
import { Movie, PrismaClient, TimeSlot } from '@prisma/client';
import sessions from './data/sessions.json'; // Import slots data
import { Logger } from '@nestjs/common';
import {
  formatDate,
  generateUniqueMovieName,
  sleep,
} from 'src/utils/functions';

const prisma = new PrismaClient();
const logger = new Logger('Seeding - sessions');

const isMovieExist = async (uniqueName: string): Promise<Movie> => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { uniqueName },
    });
    if (!movie) {
      logger.error(`Movie with uniqueName ${uniqueName} not found`);
      return null;
    }
    return movie;
  } catch {
    logger.error(`Error checking movie existence: ${uniqueName}`);
    return null;
  }
};

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
    } catch {
      logger.error(`Session already exists for ${uniqueMovieName}`);
    }
  }
  await sleep(2000);
  console.log('Sessions have been seeded');
}
