import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    super({
      datasourceUrl: configService.get('database_url'),
    });

    this.logger.debug(
      'Prisma service instance created, env: ' +
        this.configService.get('environment'),
    );
  }

  async onModuleInit() {
    await this.$connect();
  }
}
