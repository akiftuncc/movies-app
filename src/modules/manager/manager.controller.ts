import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  UsePipes,
  Headers,
  Patch,
  Delete,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import {
  ApiBearerAuth,
  ApiBody,
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
import { findUserIdByAuthHeader } from '@/utils/user-functions';
import { ByIdRequestDto } from '@/dto/general/request/by-id-request.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { PaginateRequestDto } from '@/dto/general/request/paginate-request.dto';
import { BuyTicketResponseDto } from '@/dto/customer/response/buy-ticket-response.dto';
import { WatchMovieResponseDto } from '@/dto/customer/response/watch-movie-response';
import { ViewWatchHistoryResponseDto } from '@/dto/customer/response/view-watch-history-response.dto';
import { EmptyResponseDto } from '@/dto/general/response/empty-response.dto';
import { AddMovieRequestDto } from '@/dto/manager/request/create-movie-request.dto';
import {
  AddMovieRequest,
  UpdateMovieRequest,
} from 'proto-generated/manager_messages';
import { UpdateMovieRequestDto } from '@/dto/manager/request/update-movie-request.dto';

import { StatusCode } from '@/utils/constants';
import { AppRoleGuard } from '../../guards/role.guard';

@ApiTags('Manager')
@Controller('manager')
@ApiBearerAuth()
@UseGuards(AppRoleGuard('manager'))
export class ManagerController {
  private readonly logger = new Logger(ManagerController.name);
  constructor(private readonly managerService: ManagerService) {}

  @ApiOperation({ summary: 'Create Movie' })
  @ApiResponse({
    status: 200,
    description: 'Create Movie',
    type: EmptyResponseDto,
  })
  @ApiBody({
    type: AddMovieRequestDto,
    description: 'Create Movie',
  })
  @Post('create-movie')
  @UsePipes(new ZodValidationPipe(AddMovieRequestDto))
  async createMovie(@Body() body: AddMovieRequest): Promise<EmptyResponse> {
    return await this.managerService.createMovie(body);
  }

  @ApiOperation({ summary: 'Update Movie' })
  @ApiResponse({
    status: 200,
    description: 'Update Movie',
    type: EmptyResponseDto,
  })
  @ApiBody({
    type: UpdateMovieRequestDto,
    description: 'Update Movie',
  })
  @Patch('update-movie')
  @UsePipes(new ZodValidationPipe(UpdateMovieRequestDto))
  async updateMovie(@Body() body: UpdateMovieRequest): Promise<EmptyResponse> {
    return await this.managerService.updateMovie(body);
  }

  @ApiOperation({ summary: 'Delete Movie' })
  @ApiResponse({
    status: 200,
    description: 'Delete Movie',
    type: EmptyResponseDto,
  })
  @ApiBody({
    type: ByIdRequestDto,
    description: 'Movie ID to delete',
  })
  @Delete('delete-movie')
  @UsePipes(new ZodValidationPipe(ByIdRequestDto))
  async deleteMovie(@Body() body: ByIdRequest): Promise<EmptyResponse> {
    return await this.managerService.deleteMovie(body);
  }
}
