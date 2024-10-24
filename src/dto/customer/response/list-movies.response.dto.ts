import { createZodDto } from 'nestjs-zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { ListMoviesResponse } from 'proto-generated/user_messages';
import { ResponseStatus } from 'proto-generated/general';

const listMoviesResponseDefinition: Record<
  keyof ListMoviesResponse,
  z.ZodTypeAny
> = {
  status: z.object({
    code: z.number(),
    errors: z.array(z.string()).optional(),
  }),
  movies: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      ageRestriction: z.string(),
      genre: z.string(),
    }),
  ),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  }),
};

const ListMoviesResponseSchema = interfaceToZod<ListMoviesResponse>(
  listMoviesResponseDefinition,
);

export class ListMoviesResponseDto extends createZodDto(
  ListMoviesResponseSchema,
) {
  @ApiProperty({
    example: {
      code: 200,
      error: [],
    },
    description: 'Status code of the response',
  })
  status: ResponseStatus;
}
