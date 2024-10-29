import { createZodDto } from 'nestjs-zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { LoginResponse, RegisterResponse } from 'proto-generated/user_messages';
import { EmptyResponse, ResponseStatus } from 'proto-generated/general';
import {
  BuyTicketResponse,
  TicketDto,
} from 'proto-generated/customer_messages';

const buyTicketResponseDefinition: Record<
  keyof BuyTicketResponse,
  z.ZodTypeAny
> = {
  status: z.object({
    code: z.number(),
    errors: z.array(z.string()).optional(),
  }),
  data: z.object({
    ticketDate: z.string(),
    movieName: z.string(),
    room: z.string(),
  }),
};

const BuyTicketResponseSchema = interfaceToZod<BuyTicketResponse>(
  buyTicketResponseDefinition,
);

export class BuyTicketResponseDto extends createZodDto(
  BuyTicketResponseSchema,
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
      ticketDate: '2024-05-01',
      movieName: 'Movie Name',
      room: '1',
    },
    description: 'Data of the response',
  })
  data: TicketDto;
}
