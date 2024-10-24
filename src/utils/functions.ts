import * as bcrypt from 'bcrypt';
import { TICKET_NUMBERS, userConstants, X_INTERNAL_HASH } from './constants';
import { Movie, PrismaClient, TimeSlot } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { format } from 'date-fns';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const logger = new Logger('Seeding - Tickets');

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
  await sleep(500);
  TICKET_NUMBERS.forEach(async (ticketNumber) => {
    try {
      await prisma.ticket.create({
        data: {
          session: {
            connect: { id: sessionId },
          },
          ticketNumber,
        },
      });
      logger.log(`Ticket ${ticketNumber} created for session ${sessionId}`);
    } catch (error) {
      logger.error(
        `Ticket Already Exists: ${ticketNumber} for session ${sessionId}`,
      );
    }
  });
};

export const getMetadata = (clientJwt: string, jwtSecret: string) => {
  const token = clientJwt.startsWith('Bearer ')
    ? clientJwt.substring(7).trim()
    : clientJwt;
  const headers = {
    authorization: `Bearer ${token}`,
    [X_INTERNAL_HASH]: crypto
      .createHash('md5')
      .update(jwtSecret)
      .digest('hex')
      .toLowerCase(),
  };
  return headers;
};

export const getEnv = (key: string, defaultVal?: any): string => {
  const result = process.env[key];

  if (typeof result === 'undefined') {
    if (defaultVal) {
      return defaultVal;
    } else {
      throw new Error(key + ' not defined in env.');
    }
  }

  return result;
};
