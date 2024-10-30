import { MovieWithSessionsAndTickets } from '@/types/prisma-included-types';
import {
  SessionBulkData,
  sessionBulkDataCreator,
} from '@/utils/bulk-data-creators';
import { StatusCode, TICKET_NUMBERS } from '@/utils/constants';
import {
  generateTickets,
  generateUniqueMovieName,
  isRespnseFailed,
  emptyResponseStatusCreator,
  updateMovieUniqueName,
} from '@/utils/functions';
import { prismaDeletedAt } from '@/utils/prisma-functions';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Movie, PrismaClient, TimeSlot } from '@prisma/client';
import {
  EmptyResponse,
  ByIdRequest,
  ResponseStatus,
} from 'proto-generated/general';
import {
  AddMovieRequest,
  UpdateMovieRequest,
} from 'proto-generated/manager_messages';

import { PManagerService } from 'proto-generated/services';

@Injectable()
export class ManagerService implements OnModuleInit, PManagerService {
  private readonly logger = new Logger(ManagerService.name);
  constructor(private readonly prisma: PrismaClient) {}

  private async isMovieExists(request: AddMovieRequest) {
    const movieExists = await this.prisma.movie.findFirst({
      where: {
        uniqueName: generateUniqueMovieName(request.name, request.writer),
      },
    });
    const responseMovieExists = emptyResponseStatusCreator(
      !!movieExists,
      `Movie already exists with same writer`,
      StatusCode.BAD_REQUEST,
    );
    return responseMovieExists;
  }

  private async createMoviePrisma(
    request: AddMovieRequest,
    sessions: SessionBulkData[],
  ) {
    return await this.prisma.movie.create({
      data: {
        name: request.name,
        ageRestriction: request.ageRestriction,
        uniqueName: generateUniqueMovieName(request.name, request.writer),
        sessions: {
          createMany: {
            data: sessions.map((session) => ({
              ...session,
              timeSlot: session.timeSlot as unknown as TimeSlot,
            })),
          },
        },
      },
      include: {
        sessions: true,
      },
    });
  }

  async createMovie(request: AddMovieRequest): Promise<EmptyResponse> {
    const movieExists = await this.isMovieExists(request);
    if (isRespnseFailed(movieExists)) {
      return movieExists;
    }
    const sessions = sessionBulkDataCreator(request.sessions);
    try {
      const movieDb = await this.createMoviePrisma(request, sessions);
      movieDb.sessions.forEach(async (session) => {
        await generateTickets(session.id);
      });
      return emptyResponseStatusCreator(
        false,
        'Movie created successfully',
        StatusCode.SUCCESS,
      );
    } catch (error) {
      return emptyResponseStatusCreator(
        true,
        'Sessions inputs are not vaild',
        StatusCode.BAD_REQUEST,
      );
    }
  }

  //7

  private updateDataGenerator(request: UpdateMovieRequest, uniqueName: string) {
    const updateData = {
      name: request.name,
      ageRestriction: request.ageRestriction,
      uniqueName,
    };
    if (request.sessions) {
      const sessionsData = sessionBulkDataCreator(request.sessions);
      updateData['sessions'] = {
        deleteMany: {},
        createMany: {
          data: sessionsData,
        },
      };
    }
    return updateData;
  }

  private createUpdateData(
    request: UpdateMovieRequest,
    movieUniqueName: string,
    movieName: string,
  ) {
    const uniqueName = updateMovieUniqueName(
      movieUniqueName,
      movieName,
      request.name,
      request.writer,
    );
    return this.updateDataGenerator(request, uniqueName);
  }

  private async updateMoviePrisma(
    request: UpdateMovieRequest,
    movieDb: MovieWithSessionsAndTickets,
    movieSessionTicketsId: string[],
  ) {
    await this.prisma.$transaction(async (tx) => {
      await tx.ticket.deleteMany({
        where: {
          id: { in: movieSessionTicketsId },
        },
      });
      const movie = await tx.movie.update({
        where: {
          id: request.id,
        },
        data: this.createUpdateData(request, movieDb.uniqueName, movieDb.name),
        include: {
          sessions: true,
        },
      });
      movie.sessions.forEach(async (session) => {
        await generateTickets(session.id);
      });
    });
  }

  async updateMovie(request: UpdateMovieRequest): Promise<EmptyResponse> {
    const movieDb = await this.prisma.movie.findUnique({
      where: {
        id: request.id,
      },
      include: {
        sessions: { include: { tickets: true } },
      },
    });
    if (!movieDb) {
      return emptyResponseStatusCreator(
        true,
        'Movie not found',
        StatusCode.NOT_FOUND,
      );
    }
    const movieSessionTicketsId = movieDb.sessions.flatMap((session) =>
      session.tickets.map((ticket) => ticket.id),
    );
    try {
      await this.updateMoviePrisma(request, movieDb, movieSessionTicketsId);

      return emptyResponseStatusCreator(
        false,
        'Movie updated successfully',
        StatusCode.SUCCESS,
      );
    } catch {
      return emptyResponseStatusCreator(
        true,
        'An Error Occured While Updating Movie',
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private async deleteMoviePrisma(
    request: ByIdRequest,
    movieDb: MovieWithSessionsAndTickets,
  ) {
    await this.prisma.$transaction(async (tx) => {
      await tx.ticket.deleteMany({
        where: {
          id: {
            in: movieDb.sessions.flatMap((session) =>
              session.tickets.map((ticket) => ticket.id),
            ),
          },
        },
      });
      await tx.session.deleteMany({
        where: {
          id: {
            in: movieDb.sessions.map((session) => session.id),
          },
        },
      });
      await tx.movie.update({
        where: {
          id: request.id,
        },
        data: prismaDeletedAt('uniqueName', movieDb.uniqueName),
      });
    });
  }

  async deleteMovie(request: ByIdRequest): Promise<EmptyResponse> {
    const movieDb = await this.prisma.movie.findUnique({
      where: {
        id: request.id,
      },
      include: {
        sessions: { include: { tickets: true } },
      },
    });
    if (!movieDb) {
      return emptyResponseStatusCreator(
        true,
        'Movie not found',
        StatusCode.NOT_FOUND,
      );
    }
    try {
      await this.deleteMoviePrisma(request, movieDb);
      return emptyResponseStatusCreator(
        false,
        'Movie deleted successfully',
        StatusCode.SUCCESS,
      );
    } catch {
      return emptyResponseStatusCreator(
        true,
        'An Error Occured While Deleting Movie',
        StatusCode.BAD_REQUEST,
      );
    }
  }

  onModuleInit() {
    this.logger.log('ManagerService initialized');
  }
}
