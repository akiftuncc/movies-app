import { createZodDto } from 'nestjs-zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { LoginResponse, RegisterResponse } from 'proto-generated/user_messages';
import {
  EmptyResponse,
  PaginationMetaResult,
  ResponseStatus,
} from 'proto-generated/general';
import {
  BuyTicketResponse,
  TicketDto,
  ViewWatchHistoryResponse,
  WatchedMovieDto,
} from 'proto-generated/customer_messages';

const viewWatchHistoryResponseDefinition: Record<
  keyof ViewWatchHistoryResponse,
  z.ZodTypeAny
> = {
  status: z.object({
    code: z.number(),
    errors: z.array(z.string()).optional(),
  }),
  pagination: z.object({
    recordsTotal: z.number(),
    recordsFiltered: z.number(),
  }),
  data: z.array(
    z.object({
      id: z.string().cuid(),
      name: z.string(),
      watchDate: z.string(),
      watchTime: z.string(),
    }),
  ),
};

const ViewWatchHistoryResponseSchema = interfaceToZod<ViewWatchHistoryResponse>(
  viewWatchHistoryResponseDefinition,
);

export class ViewWatchHistoryResponseDto extends createZodDto(
  ViewWatchHistoryResponseSchema,
) {
  @ApiProperty({
    example: {
      code: 200,
      error: [],
    },
    description: 'Status code of the response',
  })
  status: ResponseStatus;

  @ApiProperty({
    example: [
      {
        ticketDate: '2024-05-01',
        ticketTime: '10:00',
        movieName: 'Movie Name',
        room: '1',
      },
    ],
    description: 'Data of the response',
  })
  data: WatchedMovieDto[];

  @ApiProperty({
    example: {
      recordsTotal: 10,
      recordsFiltered: 10,
    },
    description: 'Pagination of the response',
  })
  pagination: PaginationMetaResult;
}
