import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { PaginateRequest } from 'proto-generated/general';

const paginateRequestDefinition: Record<keyof PaginateRequest, z.ZodTypeAny> = {
  page: z.number(),
  perPage: z.number(),
  fulltextSearch: z.string().optional(),
};

const PaginateRequestSchema = interfaceToZod<PaginateRequest>(
  paginateRequestDefinition,
);

export class PaginateRequestDto extends createZodDto(PaginateRequestSchema) {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 'My Portfolio' })
  fulltextSearch: string;
}
