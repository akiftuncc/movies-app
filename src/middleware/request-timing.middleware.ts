import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestTimingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestTimingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`,
      );
    });
    next();
  }
}
