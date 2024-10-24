import { createZodDto } from 'nestjs-zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { LoginResponse } from 'proto-generated/user_messages';
import { ResponseStatus } from 'proto-generated/general';

const loginResponseDefinition: Record<keyof LoginResponse, z.ZodTypeAny> = {
  status: z.object({
    code: z.number(),
    errors: z.array(z.string()).optional(),
  }),
  accessToken: z.string(),
};

const LoginResponseSchema = interfaceToZod<LoginResponse>(
  loginResponseDefinition,
);

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {
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
