import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../../modules/customer/customer.controller';
import { CustomerService } from '../../modules/customer/customer.service';
import { PrismaClient } from '@prisma/client';
import { StatusCode } from '@/utils/constants';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomerService = {
    buyTicket: jest.fn(),
    watchMovie: jest.fn(),
    viewWatchHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
        {
          provide: PrismaClient,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('buyTicket', () => {
    const mockAuthHeader = 'Bearer test-token';
    const mockRequest = { id: 'test-id' };
    const mockResponse = {
      status: { code: StatusCode.SUCCESS },
      data: {
        ticketDate: '2024-05-01',
        movieName: 'Test Movie',
        room: '1',
      },
    };

    it('should buy a ticket successfully', async () => {
      mockCustomerService.buyTicket.mockResolvedValue(mockResponse);

      const result = await controller.buyTicket(mockAuthHeader, mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockCustomerService.buyTicket).toHaveBeenCalledWith(
        mockRequest,
        expect.any(String),
      );
    });

    it('should handle errors when buying ticket', async () => {
      const errorResponse = {
        status: {
          code: StatusCode.BAD_REQUEST,
          errors: ['Ticket Already Sold'],
        },
        data: null,
      };
      mockCustomerService.buyTicket.mockResolvedValue(errorResponse);

      const result = await controller.buyTicket(mockAuthHeader, mockRequest);

      expect(result).toEqual(errorResponse);
    });
  });

  describe('watchMovie', () => {
    const mockAuthHeader = 'Bearer test-token';
    const mockRequest = { id: 'test-id' };
    const mockResponse = {
      status: { code: StatusCode.SUCCESS },
      data: {
        movieName: 'Test Movie',
        movieDate: '2024-05-01',
        movieTime: '10:00',
        roomNumber: 1,
      },
    };

    it('should watch a movie successfully', async () => {
      mockCustomerService.watchMovie.mockResolvedValue(mockResponse);

      const result = await controller.watchMovie(mockAuthHeader, mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockCustomerService.watchMovie).toHaveBeenCalledWith(
        mockRequest,
        expect.any(String),
      );
    });

    it('should handle errors when watching movie', async () => {
      const errorResponse = {
        status: {
          code: StatusCode.BAD_REQUEST,
          errors: ['User Age Not Allowed'],
        },
        data: null,
      };
      mockCustomerService.watchMovie.mockResolvedValue(errorResponse);

      const result = await controller.watchMovie(mockAuthHeader, mockRequest);

      expect(result).toEqual(errorResponse);
    });
  });

  describe('viewWatchHistory', () => {
    const mockAuthHeader = 'Bearer test-token';
    const mockRequest = { page: 1, perPage: 10 };
    const mockResponse = {
      status: { code: StatusCode.SUCCESS },
      data: [
        {
          id: 'test-id',
          name: 'Test Movie',
          watchDate: '2024-05-01',
          watchTime: '10:00',
        },
      ],
      pagination: {
        recordsFiltered: 1,
        recordsTotal: 1,
      },
    };

    it('should view watch history successfully', async () => {
      mockCustomerService.viewWatchHistory.mockResolvedValue(mockResponse);

      const result = await controller.viewWatchHistory(
        mockAuthHeader,
        mockRequest,
      );

      expect(result).toEqual(mockResponse);
      expect(mockCustomerService.viewWatchHistory).toHaveBeenCalledWith(
        mockRequest,
        expect.any(String),
      );
    });
  });
});
