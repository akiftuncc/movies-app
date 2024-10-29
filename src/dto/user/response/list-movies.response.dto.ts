import { createZodDto } from 'nestjs-zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { ListMoviesResponse, MovieDto } from 'proto-generated/user_messages';
import { PaginationMetaResult, ResponseStatus } from 'proto-generated/general';

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
    recordsTotal: z.number(),
    recordsFiltered: z.number(),
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

  @ApiProperty({
    example: [
      {
        id: '1',
        movieName: 'Movie 1',
        movieSessions: [],
      },
    ],
    description: 'List of movies',
  })
  movies: MovieDto[];

  @ApiProperty({
    example: {
      recordsTotal: 10,
      recordsFiltered: 10,
    },
    description: 'Pagination of the response',
  })
  pagination: PaginationMetaResult;
}
