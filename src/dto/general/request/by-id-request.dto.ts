import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { ByIdRequest } from 'proto-generated/general';

const byIdRequestDefinition: Record<keyof ByIdRequest, z.ZodTypeAny> = {
  id: z.string().cuid(),
};

const ByIdRequestSchema = interfaceToZod<ByIdRequest>(byIdRequestDefinition);

export class ByIdRequestDto extends createZodDto(ByIdRequestSchema) {
  @ApiProperty({ example: 'cuid' })
  id: string;
}
