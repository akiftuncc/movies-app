import * as bcrypt from 'bcrypt';
import { StatusCode, userConstants } from '../config/constants';
import { TimeSlot } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { format } from 'date-fns';
import { EmptyResponse, ResponseStatus } from 'proto-generated/general';
const logger = new Logger('functions');

export const password = (pwd: string) => {
  return bcrypt.hashSync(pwd, userConstants.SALT_OR_ROUNDS);
};

export const sleep = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const idCreator = (name: string) => {
  return name
    .replace(/[.,:;!?'"`~@#$%^&*()_+=<>[\]{}|\\/]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
};

export const generateUniqueMovieName = (movieName: string, writer: string) => {
  return idCreator(`${movieName}-${writer}`);
};

export const findMovieWriterId = (
  movieName: string,
  movieUniqueName: string,
) => {
  return movieUniqueName.replace(idCreator(movieName) + '-', '').toLowerCase();
};

export const findMovieName = (movieUniqueName: string, writerName: string) => {
  return movieUniqueName.replace('-' + idCreator(writerName), '').toLowerCase();
};

export const updateMovieUniqueName = (
  movieUniqueName: string,
  movieNameDb: string,
  movieName?: string,
  writerName?: string,
) => {
  if (movieName && writerName) {
    return generateUniqueMovieName(movieName, writerName);
  }
  if (!movieName && !writerName) {
    return movieUniqueName;
  }
  if (movieName && !writerName) {
    const writerName = movieUniqueName
      .replace(idCreator(movieNameDb) + '-', '')
      .toLowerCase();
    return generateUniqueMovieName(movieName, writerName);
  }
  if (!movieName && writerName) {
    return generateUniqueMovieName(movieNameDb, writerName);
  }
};

export const timeSlotToTime = (timeSlot: TimeSlot): string => {
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

export function formatDateToReadableString(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
}

export const formatDate = (date: Date, timeSlot: TimeSlot) => {
  const time = timeSlotToTime(timeSlot);
  return `${format(date, 'yyyy-MM-dd')}T${time}.000Z`;
};

export function emptyResponseStatusCreator(
  value: boolean,
  error: string,
  code: StatusCode,
): EmptyResponse {
  const logger = new Logger('response status');
  if (value) {
    logger.error(error);
  }
  return value
    ? {
        status: {
          error: { errors: [error] },
          code: code,
        },
      }
    : { status: { code: StatusCode.SUCCESS } };
}

export function responseStatusCreator(
  value: boolean,
  error: string,
  code: StatusCode,
): ResponseStatus {
  const logger = new Logger('response status');
  if (value) {
    logger.error(error);
  }
  return value
    ? {
        error: { errors: [error] },
        code: code,
      }
    : { code: StatusCode.SUCCESS };
}

export function isRespnseFailed(response: EmptyResponse): boolean {
  return response.status.code !== StatusCode.SUCCESS;
}

export function checkConditions(
  conditions: { bool: boolean; err: string; status: StatusCode }[],
): ResponseStatus {
  for (const condition of conditions) {
    if (condition.bool) {
      return responseStatusCreator(true, condition.err, condition.status);
    }
  }
  return responseStatusCreator(
    false,
    'All conditions passed',
    StatusCode.SUCCESS,
  );
}
