import {
  MovieWithSessionsAndTickets,
  TicketWithSessionAndMovie,
  UserWithTicketsAndSessions,
} from '@/types/prisma-included-types';
import { StatusCode } from '@/utils/constants';
import { formatDateToReadableString, timeSlotToTime } from '@/utils/functions';
import { ticketNormalizer } from '@/utils/normalizers/customer.normalizers';
import {
  prismaPaginateCreator,
  prismaWhereCreatorWithTable,
} from '@/utils/prisma-functions';
import { findUserIdByAuthHeader } from '@/utils/user-functions';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Movie, PrismaClient, Ticket, User } from '@prisma/client';
import {
  BuyTicketResponse,
  WatchMovieResponse,
  ViewWatchHistoryResponse,
} from 'proto-generated/customer_messages';
import {
  ByIdRequest,
  PaginateRequest,
  ResponseStatus,
} from 'proto-generated/general';
import { PCustomerService } from 'proto-generated/services';

@Injectable()
export class CustomerService implements OnModuleInit, PCustomerService {
  constructor(private readonly prisma: PrismaClient) {}
  onModuleInit() {
    this.logger.log('CustomerService initialized');
  }

  private ticketStatus(
    ticket: TicketWithSessionAndMovie,
    userAge: number,
  ): ResponseStatus {
    if (!ticket) {
      this.logger.error('Ticket Not Found');
      return {
        code: StatusCode.NOT_FOUND,
        error: { errors: ['Ticket Not Found.'] },
      };
    }
    if (ticket.userId) {
      this.logger.error('Ticket Already Sold');
      return {
        code: StatusCode.BAD_REQUEST,
        error: { errors: ['Ticket Already Sold.'] },
      };
    }
    if (ticket.session.movie.ageRestriction > userAge) {
      this.logger.error('User Age Not Allowed To This Movie');
      return {
        code: StatusCode.BAD_REQUEST,
        error: { errors: ['User Age Not Allowed To This Movie.'] },
      };
    }

    return { code: StatusCode.SUCCESS };
  }

  async buyTicket(
    request: ByIdRequest,
    userId?: string,
  ): Promise<BuyTicketResponse> {
    const where = {
      id: request.id,
      deletedAt: null,
      ...prismaWhereCreatorWithTable(
        'session',
        'date',
        'gte',
        new Date(),
        false,
      ).where,
    };
    const userAge = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { age: true },
    });
    const ticketDb = await this.prisma.ticket.findUnique({
      include: {
        session: {
          include: {
            movie: true,
          },
        },
      },
      where,
    });
    const status = this.ticketStatus(ticketDb, userAge.age);
    if (status.code !== StatusCode.SUCCESS) {
      return { status, data: null };
    }
    const ticket: TicketWithSessionAndMovie = await this.prisma.ticket.update({
      include: {
        session: {
          include: {
            movie: true,
          },
        },
      },
      where: { ...where, userId: null },
      data: {
        userId: userId,
      },
    });
    const ticketDto = ticketNormalizer(ticket);
    return { data: ticketDto, status };
  }

  private watchMovieStatus(
    movie: Movie,
    user: UserWithTicketsAndSessions,
  ): ResponseStatus {
    if (!movie) {
      this.logger.error('Movie Not Found');
      return {
        code: StatusCode.NOT_FOUND,
        error: { errors: ['Movie Not Found.'] },
      };
    }
    if (!user) {
      this.logger.error('User Not Found');
      return {
        code: StatusCode.NOT_FOUND,
        error: { errors: ['User Not Found.'] },
      };
    }
    if (movie.ageRestriction > user.age) {
      this.logger.error('User Age Not Allowed');
      return {
        code: StatusCode.BAD_REQUEST,
        error: { errors: ['User Age Not Allowed.'] },
      };
    }
    if (user.tickets.length == 0) {
      this.logger.error('User Don`t Have Any Valid Ticket');
      return {
        code: StatusCode.BAD_REQUEST,
        error: { errors: ['User Don`t Have Any Valid Ticket.'] },
      };
    }
    return { code: StatusCode.SUCCESS };
  }

  async watchMovie(
    request: ByIdRequest,
    userId?: string,
  ): Promise<WatchMovieResponse> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: request.id },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tickets: {
          where: {
            isUsed: false,
            session: {
              date: {
                gt: new Date(),
              },
              deletedAt: null,
              movieId: request.id,
            },
          },
          include: {
            session: {
              include: {
                movie: true,
              },
            },
          },
        },
      },
    });
    const status = this.watchMovieStatus(movie, user);
    if (status.code !== StatusCode.SUCCESS) {
      return { status, data: null };
    }
    const usedTicketId = user.tickets[0].id;
    const ticketDetails = await this.prisma.ticket.update({
      where: { id: usedTicketId },
      include: {
        session: true,
      },
      data: {
        isUsed: true,
      },
    });
    return {
      data: {
        movieName: movie.name,
        movieDate: formatDateToReadableString(ticketDetails.session.date),
        movieTime: timeSlotToTime(ticketDetails.session.timeSlot),
        roomNumber: ticketDetails.session.roomNumber,
      },
      status,
    };
  }

  async viewWatchHistory(
    request: PaginateRequest,
    userId?: string,
  ): Promise<ViewWatchHistoryResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tickets: {
          ...prismaPaginateCreator(request.page, request.perPage),
          include: {
            session: {
              include: {
                movie: true,
              },
            },
          },
        },
      },
    });
    const totalWatchedCount = await this.prisma.ticket.count({
      where: {
        userId: userId,
        isUsed: true,
      },
    });
    const usedTickets = user.tickets.filter((ticket) => ticket.isUsed);
    return {
      data: usedTickets.map((ticket) => {
        return {
          id: ticket.session.movie.id,
          name: ticket.session.movie.name,
          watchDate: formatDateToReadableString(ticket.session.date),
          watchTime: timeSlotToTime(ticket.session.timeSlot),
        };
      }),
      status: { code: StatusCode.SUCCESS },
      pagination: {
        recordsFiltered: usedTickets.length,
        recordsTotal: totalWatchedCount,
      },
    };
  }
  private readonly logger = new Logger(CustomerService.name);
}
