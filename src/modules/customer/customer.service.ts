import {
  MovieWithSessionsAndTickets,
  TicketWithSessionAndMovie,
  UserWithTicketsAndSessions,
} from '@/types/prisma-included-types';
import { StatusCode } from '@/config/constants';
import {
  checkConditions,
  formatDateToReadableString,
  responseStatusCreator,
  timeSlotToTime,
} from '@/utils/functions';
import { ticketNormalizer } from '@/utils/normalizers/customer.normalizers';
import {
  prismaPaginateCreator,
  prismaWhereCreatorWithTable,
} from '@/utils/prisma-functions';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Movie, Prisma, PrismaClient, Ticket, User } from '@prisma/client';
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
    const conditions = [
      { bool: !ticket, err: 'Ticket Not Found', status: StatusCode.NOT_FOUND },
      {
        bool: !!ticket?.userId,
        err: 'Ticket Already Sold',
        status: StatusCode.BAD_REQUEST,
      },
      {
        bool: ticket?.session?.movie?.ageRestriction > userAge,
        err: 'User Age Not Allowed To This Movie',
        status: StatusCode.BAD_REQUEST,
      },
    ];
    return checkConditions(conditions);
  }

  private buyTicketWhereCreator(request: ByIdRequest) {
    return {
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
  }

  private async buyTicketUserAge(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: { age: true },
    });
  }

  private async buyTicketValidTicket(where: Prisma.TicketWhereUniqueInput) {
    return await this.prisma.ticket.findUnique({
      include: {
        session: {
          include: {
            movie: true,
          },
        },
      },
      where,
    });
  }

  private async buyTicketPrisma(
    where: Prisma.TicketWhereUniqueInput,
    userId: string,
  ): Promise<TicketWithSessionAndMovie> {
    return await this.prisma.ticket.update({
      include: {
        session: {
          include: {
            movie: true,
          },
        },
      },
      where: { ...where, userId: null, deletedAt: null },
      data: {
        userId: userId,
      },
    });
  }

  async buyTicket(
    request: ByIdRequest,
    userId?: string,
  ): Promise<BuyTicketResponse> {
    const where = this.buyTicketWhereCreator(request);
    const userAge = await this.buyTicketUserAge(userId);
    const ticketDb = await this.buyTicketValidTicket(where);

    const status = this.ticketStatus(ticketDb, userAge.age);
    if (status.code !== StatusCode.SUCCESS) {
      return { status, data: null };
    }

    const ticket = await this.buyTicketPrisma(where, userId);
    const ticketDto = ticketNormalizer(ticket);
    return { data: ticketDto, status };
  }

  private watchMovieStatus(
    movie: Movie | null,
    user: UserWithTicketsAndSessions | null,
  ): ResponseStatus {
    const conditions = [
      { bool: !movie, err: 'Movie Not Found', status: StatusCode.NOT_FOUND },
      { bool: !user, err: 'User Not Found', status: StatusCode.NOT_FOUND },
      {
        bool: movie?.ageRestriction > (user?.age || 0),
        err: 'User Age Not Allowed',
        status: StatusCode.BAD_REQUEST,
      },
      {
        bool: user && user?.tickets && user?.tickets.length === 0,
        err: 'User Don`t Have Any Valid Ticket',
        status: StatusCode.BAD_REQUEST,
      },
    ];
    return checkConditions(conditions);
  }

  private async watchMovieUserDb(request: ByIdRequest, userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
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
  }

  private async watchMoviePrisma(usedTicketId: string) {
    return await this.prisma.ticket.update({
      where: { id: usedTicketId, deletedAt: null },
      include: {
        session: true,
      },
      data: {
        isUsed: true,
      },
    });
  }

  async watchMovie(
    request: ByIdRequest,
    userId?: string,
  ): Promise<WatchMovieResponse> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: request.id, deletedAt: null },
    });
    const user = await this.watchMovieUserDb(request, userId);

    const status = this.watchMovieStatus(movie, user);
    if (status.code !== StatusCode.SUCCESS) {
      return { status, data: null };
    }
    const usedTicketId = user.tickets[0].id;
    const ticketDetails = await this.watchMoviePrisma(usedTicketId);
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

  private async viewWatchHistoryUserDb(
    userId: string,
    request: PaginateRequest,
  ) {
    return await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        tickets: {
          ...prismaPaginateCreator(request.page, request.perPage),
          where: { deletedAt: null },
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
  }

  private async viewWatchHistoryTotalCount(userId: string) {
    return await this.prisma.ticket.count({
      where: {
        userId: userId,
        isUsed: true,
      },
    });
  }

  async viewWatchHistory(
    request: PaginateRequest,
    userId?: string,
  ): Promise<ViewWatchHistoryResponse> {
    const user = await this.viewWatchHistoryUserDb(userId, request);
    const totalWatchedCount = await this.viewWatchHistoryTotalCount(userId);

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
