// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   Logger,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable()
// export class PerformanceInterceptor implements NestInterceptor {
//   private readonly logger = new Logger(PerformanceInterceptor.name);
//   private readonly SLOW_API_THRESHOLD = 1000;

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const start = Date.now();
//     const { method, url } = context.switchToHttp().getRequest();

//     return next.handle().pipe(
//       tap(() => {
//         const duration = Date.now() - start;
//         if (duration > this.SLOW_API_THRESHOLD) {
//           this.logger.warn(
//             `Slow API Performance: ${method} ${url} - ${duration}ms`,
//           );
//         }
//       }),
//     );
//   }
// }
