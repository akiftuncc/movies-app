import { TICKET_NUMBERS } from '@/config/constants';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Movie } from '@prisma/client';
@Injectable()
export class PrismaHelperService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.logger.log('PrismaHelperService initialized');
  }

  private readonly logger = new Logger(PrismaHelperService.name);

  async isMovieExist(uniqueName: string): Promise<Movie> {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: { uniqueName },
      });
      if (!movie) {
        this.logger.error(`Movie with uniqueName ${uniqueName} not found`);
        return null;
      }
      return movie;
    } catch {
      this.logger.error(`Error checking movie existence: ${uniqueName}`);
      return null;
    }
  }

  async generateTickets(sessionId: string) {
    TICKET_NUMBERS.forEach(async (ticketNumber) => {
      try {
        const ticket = await this.prisma.ticket.create({
          data: {
            session: {
              connect: { id: sessionId },
            },
            ticketNumber,
          },
        });

        this.logger.log(
          `Ticket ${ticketNumber} created for session ${sessionId}`,
        );
      } catch (error) {
        this.logger.error(
          `Ticket Already Exists: ${ticketNumber} for session ${sessionId}`,
        );
      }
    });
  }
}
