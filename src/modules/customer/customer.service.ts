// import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import {
//   BuyTicketResponse,
//   WatchMovieResponse,
//   ViewWatchHistoryResponse,
// } from 'proto-generated/customer_messages';
// import { ByIdRequest, PaginateRequest } from 'proto-generated/general';
// import { PCustomerService } from 'proto-generated/services';

// @Injectable()
// export class CustomerService implements OnModuleInit, PCustomerService {
//   BuyTicket(request: ByIdRequest): Promise<BuyTicketResponse> {
//     throw new Error('Method not implemented.');
//   }
//   WatchMovie(request: ByIdRequest): Promise<WatchMovieResponse> {
//     throw new Error('Method not implemented.');
//   }
//   ViewWatchHistory(
//     request: PaginateRequest,
//   ): Promise<ViewWatchHistoryResponse> {
//     throw new Error('Method not implemented.');
//   }
//   onModuleInit() {
//     throw new Error('Method not implemented.');
//   }
//   private readonly logger = new Logger(CustomerService.name);
// }
