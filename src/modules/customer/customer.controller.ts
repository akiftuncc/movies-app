// import { Body, Controller, Logger, Post } from '@nestjs/common';
// import { CustomerService } from './customer.service';
// import { ApiTags } from '@nestjs/swagger';

// import {
//   BuyTicketResponse,
//   ViewWatchHistoryResponse,
//   WatchMovieResponse,
// } from 'proto-generated/customer_messages';
// import { ByIdRequest, PaginateRequest } from 'proto-generated/general';

// @ApiTags('Customer')
// @Controller('customer')
// export class CustomerController {
//   private readonly logger = new Logger(CustomerController.name);
//   constructor(private readonly customerService: CustomerService) {}

//   @Post('buy-tickets')
//   async buyTicket(@Body() body: ByIdRequest): Promise<BuyTicketResponse> {
//     const response = await this.customerService.buyTicket(body);
//     return { data: response, status: { code: 200 } };
//   }

//   @Post('watch-movies')
//   async watchMovie(@Body() body: ByIdRequest): Promise<WatchMovieResponse> {
//     const response = await this.customerService.watchMovie(body);
//     return { data: response, status: { code: 200 } };
//   }

//   @Post('view-watch-history')
//   async viewWatchHistory(
//     @Body() body: PaginateRequest,
//   ): Promise<ViewWatchHistoryResponse> {
//     const response = await this.customerService.viewWatchHistory(body);
//     return { data: response, status: { code: 200 } };
//   }
// }
