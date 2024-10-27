import { Movie, Session, Ticket } from '@prisma/client';

export type MovieWithSessionsAndTickets = Movie & {
  sessions: (Session & {
    tickets: Ticket[];
  })[];
};
