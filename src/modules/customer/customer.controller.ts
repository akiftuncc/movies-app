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

@ApiTags('Customer')
@Controller('customer')
@ApiBearerAuth()
@UseGuards(AppRoleGuard('customer'))
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: 'Buy Ticket' })
  @ApiResponse({
    status: 200,
    description: 'Buy Ticket',
    type: BuyTicketResponseDto,
  })
  @Post('buy-ticket')
  @UsePipes(new ZodValidationPipe(ByIdRequestDto))
  async buyTicket(
    @Headers('Authorization') authHeader: string,
    @Body() body: ByIdRequestDto,
  ): Promise<BuyTicketResponse> {
    const userId = findUserIdByAuthHeader(authHeader);
    return await this.customerService.buyTicket(body, userId);
  }

  @ApiOperation({ summary: 'Watch Movie' })
  @ApiResponse({
    status: 200,
    description: 'Watch Movie',
    type: WatchMovieResponseDto,
  })
  @Post('watch-movie')
  @UsePipes(new ZodValidationPipe(ByIdRequestDto))
  async watchMovie(
    @Headers('Authorization') authHeader: string,
    @Body() body: ByIdRequestDto,
  ): Promise<WatchMovieResponse> {
    const userId = findUserIdByAuthHeader(authHeader);
    return await this.customerService.watchMovie(body, userId);
  }

  @ApiOperation({ summary: 'View Watch History' })
  @ApiResponse({
    status: 200,
    description: 'View Watch History',
    type: ViewWatchHistoryResponseDto,
  })
  @Post('view-watch-history')
  @UsePipes(new ZodValidationPipe(PaginateRequestDto))
  async viewWatchHistory(
    @Headers('Authorization') authHeader: string,
    @Body() body: PaginateRequestDto,
  ): Promise<ViewWatchHistoryResponse> {
    const userId = findUserIdByAuthHeader(authHeader);
    return await this.customerService.viewWatchHistory(body, userId);
  }
}
