import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Trip, TripStatus } from '../trip/entities/trip.entity';
import { COST_PER_KILOMETER, TAX_RATE } from '../common/constants/rates';

describe('InvoiceService', () => {
  let service: InvoiceService;

  const mockTrip: Trip = {
    id: 1,
    passengerId: 1,
    driverId: 1,
    startingPoint: { type: 'Point', coordinates: [-74.006, 40.7128] },
    endPoint: { type: 'Point', coordinates: [-73.935242, 40.73061] },
    tripStatus: TripStatus.COMPLETE,
  };

  const mockInvoice: Invoice = {
    id: 1,
    tripId: 1,
    distance: 5.2,
    baseCost: 10.4,
    tax: 1.04,
    subtotal: 10.4,
    total: 11.44,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: {
            create: jest.fn().mockReturnValue(mockInvoice),
            save: jest.fn().mockResolvedValue(mockInvoice),
            findOne: jest.fn().mockResolvedValue(mockInvoice),
            find: jest.fn().mockResolvedValue([mockInvoice]),
            createQueryBuilder: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([mockInvoice]),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFromTrip', () => {
    it('should create an invoice from a trip', async () => {
      const distance = 5.2;
      const result = await service.createFromTrip(mockTrip, distance);

      expect(result).toBeDefined();
      expect(result.tripId).toBe(mockTrip.id);
      expect(result.distance).toBe(distance);
      expect(result.baseCost).toBe(distance * COST_PER_KILOMETER); // COST_PER_KILOMETER = 2
      expect(result.tax).toBe(result.baseCost * TAX_RATE); // TAX_RATE = 0.1
      expect(result.subtotal).toBe(result.baseCost);
      expect(+result.total.toFixed(2)).toBe(
        +(result.subtotal + result.tax).toFixed(2),
      );
    });
  });

  describe('findByTripId', () => {
    it('should return an invoice for a given trip ID', async () => {
      const result = await service.findByTripId(1);
      expect(result).toBeDefined();
      expect(result.tripId).toBe(1);
    });
  });

  describe('findByPassengerId', () => {
    it('should return invoices for a given passenger ID', async () => {
      const result = await service.findByPassengerId(1);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].tripId).toBe(1);
    });
  });

  describe('findByDriverId', () => {
    it('should return invoices for a given driver ID', async () => {
      const result = await service.findByDriverId(1);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].tripId).toBe(1);
    });
  });
});
