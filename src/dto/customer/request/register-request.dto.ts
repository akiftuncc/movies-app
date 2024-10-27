import { z } from 'zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterRequest } from 'proto-generated/user_messages';
import { UserType } from 'proto-generated/general';

const registerRequestDefinition: Record<keyof RegisterRequest, z.ZodTypeAny> = {
  username: z.string().min(3),
  password: z.string().min(3),
  passwordConfirmation: z.string().min(3),
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
  password: string;

  @ApiProperty({ example: 'password' })
  passwordConfirmation: string;

  @ApiProperty({ example: 18 })
  age: number;

  @ApiProperty({ example: 'CUSTOMER' })
  type: UserType;
}
