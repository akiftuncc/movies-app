import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG_ENV } from '@/config/config';
import { PrismaHelperService } from '../prisma-helpers.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({
      secret: CONFIG_ENV.jwtSecret,
      privateKey: CONFIG_ENV.jwtSecret,
      secretOrPrivateKey: CONFIG_ENV.jwtSecret,
      signOptions: { expiresIn: 60 * 60 * CONFIG_ENV.jwtExpiration },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ConfigService,
    PrismaService,
    PrismaHelperService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class UserModule {}
