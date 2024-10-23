import * as bcrypt from 'bcrypt';
import { TICKET_NUMBERS, userConstants } from './constants';
import { Movie, PrismaClient, TimeSlot } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { format } from 'date-fns';

const prisma = new PrismaClient();
const logger = new Logger('Seeding');

export const password = (pwd: string) => {
  return bcrypt.hashSync(pwd, userConstants.SALT_OR_ROUNDS);
};

export const sleep = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const generateUniqueMovieName = (movieName: string, writer: string) => {
  return `${movieName}-${writer}`
    .replace(/[.,:;!?'"`~@#$%^&*()_+=<>[\]{}|\\/]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
};

export const isMovieExist = async (uniqueName: string): Promise<Movie> => {
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

const timeSlotToTime = (timeSlot: string): string => {
  switch (timeSlot) {
    case TimeSlot.SLOT_10_12:
      return '10:00:00';
    case TimeSlot.SLOT_12_14:
      return '12:00:00';
    case TimeSlot.SLOT_14_16:
      return '14:00:00';
    case TimeSlot.SLOT_16_18:
      return '16:00:00';
    case TimeSlot.SLOT_18_20:
      return '18:00:00';
    case TimeSlot.SLOT_20_22:
      return '20:00:00';
    case TimeSlot.SLOT_22_00:
      return '22:00:00';
    default:
      throw new Error(`Unknown time slot: ${timeSlot}`);
  }
};

export const formatDate = (date: Date, timeSlot: TimeSlot) => {
  const time = timeSlotToTime(timeSlot);
  return `${format(date, 'yyyy-MM-dd')}T${time}.000Z`;
};

export const generateTickets = async (sessionId: string) => {
  TICKET_NUMBERS.forEach(async (ticketNumber) => {
    await prisma.ticket.create({
      data: {
        session: {
          connect: { id: sessionId },
        },
        ticketNumber,
      },
    });
  });
};
