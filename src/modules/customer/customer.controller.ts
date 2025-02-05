import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  UsePipes,
  Headers,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  BuyTicketResponse,
  ViewWatchHistoryResponse,
  WatchMovieResponse,
} from 'proto-generated/customer_messages';
import { ByIdRequest, PaginateRequest } from 'proto-generated/general';
import { findUserIdByAuthHeader } from '@/utils/user-functions';
import { ByIdRequestDto } from '@/dto/general/request/by-id-request.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { PaginateRequestDto } from '@/dto/general/request/paginate-request.dto';
import { BuyTicketResponseDto } from '@/dto/customer/response/buy-ticket-response.dto';
import { WatchMovieResponseDto } from '@/dto/customer/response/watch-movie-response';
import { ViewWatchHistoryResponseDto } from '@/dto/customer/response/view-watch-history-response.dto';
import { AppRoleGuard } from '../../guards/role.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Customer')
@Controller('customer')
@ApiBearerAuth()
@UseGuards(AppRoleGuard('customer'))
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Buy Ticket' })
  @ApiResponse({
    status: 200,
    description: 'Buy Ticket',
    type: BuyTicketResponseDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: false,
  })
  @Post('buy-ticket')
  @UsePipes(new ZodValidationPipe(ByIdRequestDto))
  async buyTicket(
    @Headers('Authorization') headers: string,
    @Body() body: ByIdRequestDto,
  ): Promise<BuyTicketResponse> {
    const userId = findUserIdByAuthHeader(headers, this.jwtService);
    return await this.customerService.buyTicket(body, userId);
  }

  @ApiOperation({ summary: 'Watch Movie' })
  @ApiResponse({
    status: 200,
    description: 'Watch Movie',
    type: WatchMovieResponseDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: false,
  })
  @Post('watch-movie')
  @UsePipes(new ZodValidationPipe(ByIdRequestDto))
  async watchMovie(
    @Headers('Authorization') headers: string,
    @Body() body: ByIdRequestDto,
  ): Promise<WatchMovieResponse> {
    const userId = findUserIdByAuthHeader(headers, this.jwtService);
    return await this.customerService.watchMovie(body, userId);
  }

  @ApiOperation({ summary: 'View Watch History' })
  @ApiResponse({
    status: 200,
    description: 'View Watch History',
    type: ViewWatchHistoryResponseDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: false,
  })
  @Post('view-watch-history')
  @UsePipes(new ZodValidationPipe(PaginateRequestDto))
  async viewWatchHistory(
    @Body() body: PaginateRequestDto,
    @Headers('Authorization') headers: string,
  ): Promise<ViewWatchHistoryResponse> {
    const userId = findUserIdByAuthHeader(headers, this.jwtService);
    return await this.customerService.viewWatchHistory(body, userId);
  }
}
