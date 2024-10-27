import { z } from 'zod';
import { interfaceToZod } from '@/utils/zod-functions';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { LoginRequest } from 'proto-generated/user_messages';

const loginRequestDefinition: Record<keyof LoginRequest, z.ZodTypeAny> = {
  username: z.string().min(3),
  password: z.string().min(3),
};

const LoginRequestSchema = interfaceToZod<LoginRequest>(loginRequestDefinition);

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {
  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: 'password' })
  password: string;
}
