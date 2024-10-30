import { z } from 'zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import {
  AddMovieRequest,
  UpdateMovieRequest,
  UpsertSessionDto,
} from 'proto-generated/manager_messages';
import { TimeSlot } from '@prisma/client';
import { ResponseStatus } from 'proto-generated/general';

const updateMovieRequestDefinition: Record<
  keyof UpdateMovieRequest,
  z.ZodTypeAny
> = {
  id: z.string().cuid(),
  name: z.string().optional(),
  ageRestriction: z.number().optional(),
  writer: z.string().optional(),
  sessions: z
    .array(
      z.object({
        roomNumber: z.string(),
        dates: z
          .array(
            z.object({
              date: z.string(),
              timeSlots: z.array(z.nativeEnum(TimeSlot)),
            }),
          )
          .min(1),
      }),
    )

    .optional(),
};

const UpdateMovieRequestSchema = interfaceToZod<UpdateMovieRequest>(
  updateMovieRequestDefinition,
);

export class UpdateMovieRequestDto extends createZodDto(
  UpdateMovieRequestSchema,
) {
  @ApiProperty({ example: 'movie id', description: 'Id of the movie' })
  id: string;

  @ApiProperty({ example: 'movie name', description: 'Name of the movie' })
  name: string;

  @ApiProperty({ example: 'writer', description: 'Writer of the movie' })
  writer: string;

  @ApiProperty({
    example: 18,
    description: 'Age restriction of the movie',
  })
  ageRestriction: number;

  @ApiProperty({
    example: [
      {
        roomNumber: '1',
        dates: [{ date: '2024-01-01', timeSlots: [TimeSlot.SLOT_10_12] }],
      },
    ],
    description: 'Sessions of the movie',
  })
  sessions: UpsertSessionDto[];
}
