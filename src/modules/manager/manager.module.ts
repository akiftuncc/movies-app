import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG_ENV } from '@/config/config';
import { PrismaHelperService } from '../prisma-helpers.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ManagerController],
  providers: [
    ManagerService,
    PrismaService,
    PrismaHelperService,
    ConfigService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class ManagerModule {}
