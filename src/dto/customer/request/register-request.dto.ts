import { z } from 'zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterRequest } from 'proto-generated/user_messages';

const registerRequestDefinition: Record<keyof RegisterRequest, z.ZodTypeAny> = {
  username: z.string(),
  password: z.string(),
  passwordConfirmation: z.string(),
  age: z.number(),
  type: z.string(),
};

const RegisterRequestSchema = interfaceToZod<RegisterRequest>(
  registerRequestDefinition,
);

export class RegisterRequestDto extends createZodDto(RegisterRequestSchema) {
  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: 'password' })
  passowrd: string;

  @ApiProperty({ example: 'password' })
  passwordConfirmation: string;

  @ApiProperty({ example: 18 })
  age: number;

  @ApiProperty({ example: 'customer' })
  type: string;
}
