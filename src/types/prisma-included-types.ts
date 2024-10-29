import { Movie, Session, Ticket, User } from '@prisma/client';

export type MovieWithSessionsAndTickets = Movie & {
  sessions: (Session & {
    tickets: Ticket[];
  })[];
};
export type TicketWithSessionAndMovie = Ticket & {
  session: Session & {
    movie: Movie;
  };
};

export type UserWithTicketsAndSessions = User & {
  tickets: TicketWithSessionAndMovie[];
};
