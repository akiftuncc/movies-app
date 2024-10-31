import { MovieWithSessionsAndTickets } from '@/types/prisma-included-types';
import { listMoviesNormalizer } from '@/utils/normalizers/user.normalizers';

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Movie, PrismaClient, User, UserType } from '@prisma/client';
import {
  prismaWhereCreatorWithTable,
  prismaPaginateCreator,
  prismaDeletedAt,
  prismaWhereCreatorWithTableDeletedAt,
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
import { checkConditions, password } from '@/utils/functions';
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

  private async listMoviesDb(request: PaginateRequest) {
    return await this.prisma.movie.findMany({
      ...prismaPaginateCreator(request.page, request.perPage),
      ...prismaWhereCreatorWithTableDeletedAt(
        'sessions',
        'date',
        'gte',
        new Date(),
      ),
      include: {
        sessions: {
          include: {
            tickets: true,
          },
        },
      },
    });
  }

  async listMovies(request: PaginateRequest): Promise<ListMoviesResponse> {
    const movies: MovieWithSessionsAndTickets[] =
      await this.listMoviesDb(request);
    const totalMovies = await this.prisma.movie.count();

    return {
      movies: listMoviesNormalizer(movies),
      status: { code: StatusCode.SUCCESS },
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
    const conditions = [
      {
        bool: !!existUser,
        err: 'User already exists',
        status: StatusCode.BAD_REQUEST,
      },
      {
        bool: request.password !== request.passwordConfirmation,
        err: 'Passwords are not matching',
        status: StatusCode.BAD_REQUEST,
      },
    ];
    return checkConditions(conditions);
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
        type: request.type as unknown as UserType,
      },
    });
    const payload = payloadCreator(user);
    const token = jwtCreator(payload);

    return { accessToken: token, status };
  }

  private async loginStatus(
    request: LoginRequest,
    user: User | null,
  ): Promise<ResponseStatus> {
    const conditions = [
      { bool: !user, err: 'User not found.', status: StatusCode.NOT_FOUND },
      {
        bool: user && !isPasswordEqual(request?.password, user?.password),
        err: 'Wrong password.',
        status: StatusCode.BAD_REQUEST,
      },
    ];
    return checkConditions(conditions);
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
    const conditions = [
      { bool: !username, err: 'User not found.', status: StatusCode.NOT_FOUND },
    ];
    return checkConditions(conditions);
  }

  async delete(request: ByIdRequest): Promise<EmptyResponse> {
    const username = await this.prisma.user.findUnique({
      where: { id: request.id, deletedAt: null },
      select: { username: true },
    });

    const status = await this.deleteStatus(username?.username);
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
