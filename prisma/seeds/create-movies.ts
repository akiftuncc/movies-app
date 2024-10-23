// seed.ts
import { PrismaClient } from '@prisma/client';
import movies from './data/movies.json'; // Ensure you have a movies.json file with movie data
import { Logger } from '@nestjs/common';
import { generateUniqueMovieName, sleep } from 'src/utils/functions';

const prisma = new PrismaClient();
const logger = new Logger('Seeding');

export async function createMovies() {
  for (const movie of movies) {
    try {
      await prisma.movie.create({
        data: {
          name: movie.name,
          ageRestriction: movie.ageRestriction,
          uniqueName: generateUniqueMovieName(movie.name, movie.writer),
        },
      });
      logger.log(`Created movie ${movie.name}`);
    } catch {
      logger.error(`Movie already exists ${movie.name}`);
    }
  }
  await sleep(2000);
  console.log('Movies have been seeded');
}
