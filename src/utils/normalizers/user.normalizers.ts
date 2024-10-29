import { MovieWithSessionsAndTickets } from '@/types/prisma-included-types';
import { Movie } from '@prisma/client';
import { MovieDto } from 'proto-generated/user_messages';
import { formatDateToReadableString, timeSlotToTime } from '../functions';

export function listMoviesNormalizer(
  data: MovieWithSessionsAndTickets[],
): MovieDto[] {
  const movieDto: MovieDto[] = [];
  data.forEach((movie) => {
    movieDto.push({
      id: movie.id,
      movieName: movie.name,
      movieSessions: movie.sessions.map((session) => {
        return {
          date: formatDateToReadableString(session.date),
          hour: timeSlotToTime(session.timeSlot),
          room: session.roomNumber,
          availableTickets: session.tickets.map((ticket) => ticket.id),
        };
      }),
    });
  });
  return movieDto;
}
