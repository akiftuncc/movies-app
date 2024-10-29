import { createZodDto } from 'nestjs-zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { LoginResponse, RegisterResponse } from 'proto-generated/user_messages';
import { ResponseStatus } from 'proto-generated/general';

const registerResponseDefinition: Record<keyof RegisterResponse, z.ZodTypeAny> =
  {
    status: z.object({
      code: z.number(),
      errors: z.array(z.string()).optional(),
    }),
    accessToken: z.string(),
  };

const RegisterResponseSchema = interfaceToZod<RegisterResponse>(
  registerResponseDefinition,
);

export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) {
  @ApiProperty({
    example: {
      code: 200,
      error: [],
    },
    description: 'Status code of the response',
  })
  status: ResponseStatus;

  @ApiProperty({
    example: 'accessToken',
    description: 'Access token',
  })
  accessToken: string;
}
