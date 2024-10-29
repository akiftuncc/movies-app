import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG_ENV } from '@/config/config';

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class CustomerModule {}
