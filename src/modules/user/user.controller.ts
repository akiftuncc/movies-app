import {
  Headers,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BuyTicketResponse,
  ViewWatchHistoryResponse,
  WatchMovieResponse,
} from 'proto-generated/customer_messages';
import {
  ByIdRequest,
  EmptyResponse,
  PaginateRequest,
} from 'proto-generated/general';
import {
  ListMoviesResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'proto-generated/user_messages';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { ListMoviesResponseDto } from '@/dto/customer/response/list-movies.response.dto';
import { PaginateRequestDto } from '@/dto/general/request/paginate-request.dto';
import { LoginResponseDto } from '@/dto/customer/response/login-response.dto';
import { LoginRequestDto } from '@/dto/customer/request/login-request.dto';
import { RegisterRequestDto } from '@/dto/customer/request/register-request.dto';
import { RegisterResponseDto } from '@/dto/customer/response/register-response.dto';
import { EmptyResponseDto } from '@/dto/general/response/empty-response.dto';
import { JwtService } from '@nestjs/jwt';
import {
  AppAuthGuard,
  AppRoleGuard,
  findUserIdByAuthHeader,
} from '@/utils/user-functions';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'List movies' })
  @Post('list-movies')
  @ApiResponse({
    status: 200,
    description: 'List movies',
    type: ListMoviesResponseDto,
  })
  @UseGuards(AppAuthGuard)
  @UsePipes(new ZodValidationPipe(PaginateRequestDto))
  async listMovies(
    @Body() body: PaginateRequestDto,
    @Headers('Authorization') headers,
  ): Promise<ListMoviesResponse> {
    const response = await this.userService.listMovies(body);
    return response;
  }

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login',
    type: LoginResponseDto,
  })
  @UsePipes(new ZodValidationPipe(LoginRequestDto))
  async login(@Body() body: LoginRequestDto): Promise<LoginResponse> {
    const response = await this.userService.login(body);
    return response;
  }

  @ApiOperation({ summary: 'Register' })
  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Register',
    type: RegisterResponseDto,
  })
  @UsePipes(new ZodValidationPipe(RegisterRequestDto))
  async register(@Body() body: RegisterRequestDto): Promise<RegisterResponse> {
    const response = await this.userService.register(body);
    return response;
  }

  @ApiOperation({ summary: 'Delete User' })
  @ApiResponse({
    status: 200,
    description: 'Delete User',
    type: EmptyResponseDto,
  })
  @Get('delete')
  async delete(
    @Headers('Authorization') authHeader: string,
  ): Promise<EmptyResponse> {
    const userId = findUserIdByAuthHeader(authHeader);

    return this.userService.delete({ id: userId });
  }
}
