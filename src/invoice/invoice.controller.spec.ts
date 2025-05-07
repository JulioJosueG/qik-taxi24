import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Invoice } from './entities/invoice.entity';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

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
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            findByTripId: jest.fn().mockResolvedValue(mockInvoice),
            findByPassengerId: jest.fn().mockResolvedValue([mockInvoice]),
            findByDriverId: jest.fn().mockResolvedValue([mockInvoice]),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByTripId', () => {
    it('should return an invoice for a given trip ID', async () => {
      const result = await controller.findByTripId('1');
      expect(result).toBeDefined();
      expect(result.tripId).toBe(1);
      expect(service.findByTripId).toHaveBeenCalledWith(1);
    });
  });

  describe('findByPassengerId', () => {
    it('should return invoices for a given passenger ID', async () => {
      const result = await controller.findByPassengerId('1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].tripId).toBe(1);
      expect(service.findByPassengerId).toHaveBeenCalledWith(1);
    });
  });

  describe('findByDriverId', () => {
    it('should return invoices for a given driver ID', async () => {
      const result = await controller.findByDriverId('1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].tripId).toBe(1);
      expect(service.findByDriverId).toHaveBeenCalledWith(1);
    });
  });
});
