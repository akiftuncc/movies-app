import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../../modules/customer/customer.service';
import { PrismaClient } from '@prisma/client';
import { StatusCode } from '@/utils/constants';

describe('CustomerService', () => {
  let service: CustomerService;
  let prisma: PrismaClient;

  const mockPrisma = {
    ticket: {
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    movie: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: PrismaClient,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buyTicket', () => {
    const mockUserId = 'test-user-id';
    const mockRequest = { id: 'test-ticket-id' };

    const mockTicket = {
      id: 'test-ticket-id',
      userId: null,
      session: {
        movie: {
          ageRestriction: 13,
        },
      },
    };

    const mockUser = {
      age: 18,
    };

    it('should buy ticket successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.ticket.findUnique.mockResolvedValue(mockTicket);
      mockPrisma.ticket.update.mockResolvedValue({
        ...mockTicket,
        userId: mockUserId,
      });

      const result = await service.buyTicket(mockRequest, mockUserId);

      expect(result.status.code).toBe(StatusCode.SUCCESS);
      expect(result.data).toBeDefined();
    });

    it('should fail when ticket not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.ticket.findUnique.mockResolvedValue(null);

      const result = await service.buyTicket(mockRequest, mockUserId);

      expect(result.status.code).toBe(StatusCode.NOT_FOUND);
      expect(result.data).toBeNull();
    });

    it('should fail when user age is not allowed', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ age: 12 });
      mockPrisma.ticket.findUnique.mockResolvedValue(mockTicket);

      const result = await service.buyTicket(mockRequest, mockUserId);

      expect(result.status.code).toBe(StatusCode.BAD_REQUEST);
      expect(result.data).toBeNull();
    });
  });

  describe('watchMovie', () => {
    const mockUserId = 'test-user-id';
    const mockRequest = { id: 'test-movie-id' };

    const mockMovie = {
      id: 'test-movie-id',
      name: 'Test Movie',
      ageRestriction: 13,
    };

    const mockUser = {
      id: mockUserId,
      age: 18,
      tickets: [
        {
          id: 'test-ticket-id',
          isUsed: false,
          session: {
            date: new Date('2024-12-31'),
            timeSlot: 1,
            roomNumber: 1,
            movie: mockMovie,
          },
        },
      ],
    };

    it('should watch movie successfully', async () => {
      mockPrisma.movie.findUnique.mockResolvedValue(mockMovie);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.ticket.update.mockResolvedValue(mockUser.tickets[0]);

      const result = await service.watchMovie(mockRequest, mockUserId);

      expect(result.status.code).toBe(StatusCode.SUCCESS);
      expect(result.data).toBeDefined();
    });

    it('should fail when movie not found', async () => {
      mockPrisma.movie.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.watchMovie(mockRequest, mockUserId);

      expect(result.status.code).toBe(StatusCode.NOT_FOUND);
      expect(result.data).toBeNull();
    });

    it('should fail when user has no valid tickets', async () => {
      mockPrisma.movie.findUnique.mockResolvedValue(mockMovie);
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        tickets: [],
      });

      const result = await service.watchMovie(mockRequest, mockUserId);

      expect(result.status.code).toBe(StatusCode.BAD_REQUEST);
      expect(result.data).toBeNull();
    });
  });

  describe('viewWatchHistory', () => {
    const mockUserId = 'test-user-id';
    const mockRequest = { page: 1, perPage: 10 };

    const mockUser = {
      tickets: [
        {
          isUsed: true,
          session: {
            movie: {
              id: 'test-movie-id',
              name: 'Test Movie',
            },
            date: new Date('2024-05-01'),
            timeSlot: 1,
          },
        },
      ],
    };

    it('should view watch history successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.ticket.count.mockResolvedValue(1);

      const result = await service.viewWatchHistory(mockRequest, mockUserId);

      expect(result.status.code).toBe(StatusCode.SUCCESS);
      expect(result.data).toHaveLength(1);
      expect(result.pagination).toBeDefined();
    });
  });
});
