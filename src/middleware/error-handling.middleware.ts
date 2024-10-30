// import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class ErrorHandlingMiddleware implements NestMiddleware {
//   private readonly logger = new Logger(ErrorHandlingMiddleware.name);

//   use(req: Request, res: Response, next: NextFunction) {
//     next((err?: Error) => {
//       if (err) {
//         this.logger.error(
//           `Error processing request: ${err.message}`,
//           err.stack,
//         );
//         res.status(500).json({
//           status: {
//             code: 500,
//             err: 'Internal Server Error',
//           },
//           data: null,
//         });
//       }
//     });
//   }
// }
// //
