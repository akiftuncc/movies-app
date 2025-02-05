import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { PrismaClient } from '@prisma/client';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CONFIG_ENV } from '@/config/config';
import { PrismaHelperService } from '../prisma-helpers.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    PrismaService,
    ConfigService,
    PrismaHelperService,
    JwtService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class CustomerModule {}
