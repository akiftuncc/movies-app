import { createZodDto } from 'nestjs-zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { LoginResponse, RegisterResponse } from 'proto-generated/user_messages';
import { EmptyResponse, ResponseStatus } from 'proto-generated/general';

const emptyResponseDefinition: Record<keyof EmptyResponse, z.ZodTypeAny> = {
  status: z.object({
    code: z.number(),
    errors: z.array(z.string()).optional(),
  }),
};

const EmptyResponseSchema = interfaceToZod<EmptyResponse>(
  emptyResponseDefinition,
);

export class EmptyResponseDto extends createZodDto(EmptyResponseSchema) {
  @ApiProperty({
    example: {
      code: 200,
      error: [],
    },
    description: 'Status code of the response',
  })
  status: ResponseStatus;
}
