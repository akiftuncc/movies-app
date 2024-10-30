import { z } from 'zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import {
  AddMovieRequest,
  UpsertSessionDto,
} from 'proto-generated/manager_messages';
import { TimeSlot } from '@prisma/client';
import { ResponseStatus } from 'proto-generated/general';

const addMovieRequestDefinition: Record<keyof AddMovieRequest, z.ZodTypeAny> = {
  name: z.string(),
  ageRestriction: z.number(),
  writer: z.string(),
  sessions: z.array(
    z.object({
      roomNumber: z.string(),
      dates: z.array(
        z.object({
          date: z.string(),
          timeSlots: z.array(z.nativeEnum(TimeSlot)),
        }),
      ),
    }),
  ),
};

const AddMovieRequestSchema = interfaceToZod<AddMovieRequest>(
  addMovieRequestDefinition,
);

export class AddMovieRequestDto extends createZodDto(AddMovieRequestSchema) {
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
