// seed.ts
import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { TICKET_NUMBERS } from '@/config/constants';

const generateTickets = async (sessionId: string) => {
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

const prisma = new PrismaClient();
const logger = new Logger('Seeding - tickets');

export async function addTicketsToSessions() {
  const sessions = await prisma.session.findMany();
  for (const session of sessions) {
    await generateTickets(session.id);
  }
}
