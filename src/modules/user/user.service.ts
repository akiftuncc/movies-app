import { MovieWithSessionsAndTickets } from '@/types/user-types';
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

  private async isValidUserRegister(request: RegisterRequest) {
    const existUser = await this.prisma.user.findFirst({
      where: { username: request.username, deletedAt: null },
    });
    if (existUser) {
      this.logger.error('User already exists');
      return { status: { code: 400, message: 'User already exists' } };
    }
    if (request.password !== request.passwordConfirmation) {
      this.logger.error('Passwords are not matching.');
      return { status: { code: 400, message: 'Passwords are not matching.' } };
    }
    return { status: { code: 200 } };
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const status = await this.isValidUserRegister(request);
    if (status.status.code !== 200) {
      return { ...status, accessToken: '' };
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

    return { accessToken: token, ...status };
  }

  private async isValidUserLogin(request: LoginRequest, user: User) {
    if (!user) {
      this.logger.error('User not found.');
      return { status: { code: 400, message: 'User not found.' } };
    }
    if (!isPasswordEqual(request.password, user.password)) {
      this.logger.error('Wrong password.');
      return { status: { code: 400, message: 'Wrong password.' } };
    }
    return { status: { code: 200 } };
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { username: request.username, deletedAt: null },
    });
    const status = await this.isValidUserLogin(request, user);
    if (status.status.code !== 200) {
      return { ...status, accessToken: '' };
    }

    const payload = payloadCreator(user);
    const token = jwtCreator(payload);

    return { accessToken: token, ...status };
  }
  async delete(request: ByIdRequest): Promise<EmptyResponse> {
    const username = await this.prisma.user.findUnique({
      where: { id: request.id, deletedAt: null },
      select: { username: true },
    });
    if (!username) {
      this.logger.error('User not found.');
      return {
        status: { code: 400, error: { errors: ['User not found.'] } },
      };
    }
    await this.prisma.user.update({
      where: { id: request.id, deletedAt: null },
      data: prismaDeletedAt(username.username),
    });
    return { status: { code: 200 } };
  }

  onModuleInit() {
    this.logger.log('UserService initialized');
  }
  private readonly logger = new Logger(UserService.name);
}
