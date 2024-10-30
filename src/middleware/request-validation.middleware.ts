import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestValidationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestValidationMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['content-type']?.includes('application/json')) {
      this.logger.warn(`Invalid content-type: ${req.headers['content-type']}`);
      throw new BadRequestException('Content-Type must be application/json');
    }

    if (
      req.headers.authorization &&
      !req.headers.authorization.startsWith('Bearer ')
    ) {
      this.logger.warn('Invalid authorization header format');
      throw new BadRequestException('Invalid authorization header format');
    }

    next();
  }
}
