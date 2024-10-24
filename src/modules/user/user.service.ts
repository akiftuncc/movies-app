import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
} from 'proto-generated/user_messages';

@Injectable()
export class UserService implements OnModuleInit, PUserService {
  constructor(private readonly prisma: PrismaClient) {}
  async listMovies(request: PaginateRequest): Promise<ListMoviesResponse> {
    const movies = await this.prisma.movie.findMany({
      skip: request.page * request.perPage,
      take: request.perPage,
    });
    return {
      movies: movies,
      status: { code: 200 },
      pagination: {
        recordsFiltered: movies.length,
        recordsTotal: movies.length,
      },
    };
  }
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const user = await this.prisma.user.create({
      data: {
        username: request.username,
        password: request.password,
        age: request.age,
      },
    });
  }
  login(request: LoginRequest): Promise<LoginResponse> {
    throw new Error('Method not implemented.');
  }
  delete(request: ByIdRequest): Promise<EmptyResponse> {
    throw new Error('Method not implemented.');
  }

  onModuleInit() {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(UserService.name);
}
