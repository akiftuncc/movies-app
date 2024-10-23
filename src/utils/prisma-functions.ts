import { PrismaClient } from '@prisma/client';
import { generateUniqueMovieName, isMovieExist } from './functions';

const prisma = new PrismaClient();
export async function createSessionDb(session: Session) {
  const uniqueMovieName = generateUniqueMovieName(session.name, session.writer);
  const movie = await isMovieExist(uniqueMovieName);
  if (!movie) {
    logger.error(`Movie with uniqueName ${uniqueMovieName} not found`);
    continue;
  }
  await prisma.session.create({
    data: {
      date: formatDate(new Date(session.date), session.timeSlot as TimeSlot),
      timeSlot: session.timeSlot as TimeSlot,
      roomNumber: session.roomNumber,
      movie: {
        connect: { id: movie.id },
      },
    },
  });
}
