import { TicketWithSessionAndMovie } from '@/types/prisma-included-types';

import { formatDateToReadableString } from '../functions';
import { TicketDto } from 'proto-generated/customer_messages';

export function ticketNormalizer(data: TicketWithSessionAndMovie): TicketDto {
  const ticketDto: TicketDto = {
    ticketDate: formatDateToReadableString(data.session.date),
    movieName: data.session.movie.name,
    room: data.session.roomNumber.toString(),
  };

  return ticketDto;
}
