import { createZodDto } from 'nestjs-zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { LoginResponse, RegisterResponse } from 'proto-generated/user_messages';
import { EmptyResponse, ResponseStatus } from 'proto-generated/general';
import {
  BuyTicketResponse,
  TicketDto,
  WatchMovieDto,
  WatchMovieResponse,
} from 'proto-generated/customer_messages';

const watchMovieResponseDefinition: Record<
  keyof WatchMovieResponse,
  z.ZodTypeAny
> = {
  status: z.object({
    code: z.number(),
    errors: z.array(z.string()).optional(),
  }),
  data: z.object({
    movieName: z.string(),
    movieDate: z.string(),
    movieTime: z.string(),
    roomNumber: z.number(),
  }),
};

const WatchMovieResponseSchema = interfaceToZod<WatchMovieResponse>(
  watchMovieResponseDefinition,
);

export class WatchMovieResponseDto extends createZodDto(
  WatchMovieResponseSchema,
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
    example: {
      movieName: 'Movie Name',
    },
    description: 'Data of the response',
  })
  data: WatchMovieDto;
}
