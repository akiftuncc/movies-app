import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG_ENV } from '@/config/config';

@Module({
  controllers: [ManagerController],
  providers: [
    ManagerService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class ManagerModule {}
