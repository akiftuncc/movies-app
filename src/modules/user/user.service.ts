import { MovieWithSessionsAndTickets } from '@/types/prisma-included-types';
import { listMoviesNormalizer } from '@/utils/normalizers/user.normalizers';

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Movie, PrismaClient, User } from '@prisma/client';
import {
  prismaWhereCreatorWithTable,
  prismaPaginateCreator,
  prismaDeletedAt,
} from '@/utils/prisma-functions';
import * as jwt from 'jsonwebtoken';
import {
  ByIdRequest,
  EmptyRequest,
  EmptyResponse,
  PaginateRequest,
  ResponseStatus,
} from 'proto-generated/general';
import { PUserService } from 'proto-generated/services';
import {
  ListMoviesResponse,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  JwtUser,
} from 'proto-generated/user_messages';
import { password } from '@/utils/functions';
import {
  isPasswordEqual,
  jwtCreator,
  metadataCreator,
  payloadCreator,
  userTypeToReadableString,
} from '@/utils/user-functions';
import { CONFIG_ENV } from '@/config/config';
import { StatusCode } from '@/utils/constants';

@Injectable()
export class UserService implements OnModuleInit, PUserService {
  constructor(private readonly prisma: PrismaClient) {}
  async listMovies(request: PaginateRequest): Promise<ListMoviesResponse> {
    const movies: MovieWithSessionsAndTickets[] =
      await this.prisma.movie.findMany({
        ...prismaPaginateCreator(request.page, request.perPage),
        ...prismaWhereCreatorWithTable('sessions', 'date', 'gte', new Date()),
        include: {
          sessions: {
            include: {
              tickets: true,
            },
          },
        },
      });
    const totalMovies = await this.prisma.movie.count();

    return {
      movies: listMoviesNormalizer(movies),
      status: { code: 200 },
      pagination: {
        recordsFiltered: movies.length,
        recordsTotal: totalMovies,
      },
    };
  }

  private async registerStatus(
    request: RegisterRequest,
  ): Promise<ResponseStatus> {
    const existUser = await this.prisma.user.findFirst({
      where: { username: request.username, deletedAt: null },
    });
    if (existUser) {
      this.logger.error('User already exists');
      return {
        code: StatusCode.BAD_REQUEST,
        error: { errors: ['User already exists.'] },
      };
    }
    if (request.password !== request.passwordConfirmation) {
      this.logger.error('Passwords are not matching.');
      return {
        code: StatusCode.BAD_REQUEST,
        error: { errors: ['Passwords are not matching.'] },
      };
    }
    return { code: StatusCode.SUCCESS };
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const status = await this.registerStatus(request);
    if (status.code !== StatusCode.SUCCESS) {
      return { status, accessToken: '' };
    }
    const user = await this.prisma.user.create({
      data: {
        username: request.username,
        password: password(request.password),
        age: request.age,
      },
    });
    const payload = payloadCreator(user);
    const token = jwtCreator(payload);

    return { accessToken: token, status };
  }

  private async loginStatus(
    request: LoginRequest,
    user: User,
  ): Promise<ResponseStatus> {
    if (!user) {
      this.logger.error('User not found.');
      return {
        code: StatusCode.NOT_FOUND,
        error: { errors: ['User not found.'] },
      };
    }
    if (!isPasswordEqual(request.password, user.password)) {
      this.logger.error('Wrong password.');
      return {
        code: StatusCode.BAD_REQUEST,
        error: { errors: ['Wrong password.'] },
      };
    }
    return { code: StatusCode.SUCCESS };
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { username: request.username, deletedAt: null },
    });
    const status = await this.loginStatus(request, user);
    if (status.code !== StatusCode.SUCCESS) {
      return { status: status, accessToken: '' };
    }

    const payload = payloadCreator(user);
    const token = jwtCreator(payload);

    return { accessToken: token, status };
  }

  private async deleteStatus(username: string): Promise<ResponseStatus> {
    if (!username) {
      this.logger.error('User not found.');
      return {
        code: StatusCode.NOT_FOUND,
        error: { errors: ['User not found.'] },
      };
    }
    return { code: StatusCode.SUCCESS };
  }
  async delete(request: ByIdRequest): Promise<EmptyResponse> {
    const username = await this.prisma.user.findUnique({
      where: { id: request.id, deletedAt: null },
      select: { username: true },
    });

    const status = await this.deleteStatus(username.username);
    if (status.code !== StatusCode.SUCCESS) {
      return { status };
    }
    await this.prisma.user.update({
      where: { id: request.id, deletedAt: null },
      data: prismaDeletedAt('username', username.username),
    });
    return { status };
  }

  onModuleInit() {
    this.logger.log('UserService initialized');
  }
  private readonly logger = new Logger(UserService.name);
}
