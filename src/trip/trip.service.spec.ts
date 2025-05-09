import { Test, TestingModule } from '@nestjs/testing';
import { TripService } from './trip.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { InvoiceService } from '../invoice/invoice.service';
import { Invoice } from '../invoice/entities/invoice.entity';
import { TripStatus } from './entities/trip.entity';
import { DriverService } from '../driver/driver.service';

describe('TripService', () => {
  let service: TripService;
  let invoiceService: InvoiceService;
  let moduleRef: TestingModule;

  const mockTrip: Trip = {
    id: 1,
    passengerId: 1,
    driverId: 1,
    startingPoint: { type: 'Point', coordinates: [-74.006, 40.7128] },
    endPoint: { type: 'Point', coordinates: [-73.935242, 40.73061] },
    tripStatus: TripStatus.ACTIVE,
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

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockTrip),
    save: jest.fn().mockResolvedValue(mockTrip),
    findOne: jest.fn().mockResolvedValue(mockTrip),
    find: jest.fn().mockResolvedValue([mockTrip]),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue({ distance: 5.2 }),
  };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        TripService,
        {
          provide: getRepositoryToken(Trip),
          useValue: mockRepository,
        },
        {
          provide: InvoiceService,
          useValue: {
            createFromTrip: jest.fn().mockResolvedValue(mockInvoice),
          },
        },
        {
          provide: DriverService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Test Driver',
              telephone: '1234567890',
              dni: 'DNI123',
              isAvailable: false,
              location: { type: 'Point', coordinates: [-74.006, 40.7128] },
              trips: [],
            }),
            updateAvailability: jest.fn(),
            updateLocationAndAvailability: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<TripService>(TripService);
    invoiceService = moduleRef.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new trip', async () => {
      const driverServiceMock = moduleRef.get<DriverService>(DriverService);
      jest.spyOn(driverServiceMock, 'findOne').mockResolvedValueOnce({
        id: 1,
        name: 'Test Driver',
        telephone: '1234567890',
        dni: 'DNI123',
        isAvailable: true,
        location: { type: 'Point', coordinates: [-74.006, 40.7128] },
        trips: [],
      });
      const updateAvailabilitySpy = jest.spyOn(
        driverServiceMock,
        'updateAvailability',
      );
      const result = await service.create(
        1,
        1,
        { lat: 40.7128, lng: -74.006 },
        { lat: 40.73061, lng: -73.935242 },
      );
      expect(result).toBeDefined();
      expect(result.passengerId).toBe(1);
      expect(result.driverId).toBe(1);
      expect(result.tripStatus).toBe(TripStatus.ACTIVE);
      expect(updateAvailabilitySpy).toHaveBeenCalledWith(1, false);
    });

    it('should throw error if driver is not available', async () => {
      const driverServiceMock = moduleRef.get<DriverService>(DriverService);
      jest.spyOn(driverServiceMock, 'findOne').mockResolvedValueOnce({
        id: 1,
        name: 'Test Driver',
        telephone: '1234567890',
        dni: 'DNI123',
        isAvailable: false,
        location: { type: 'Point', coordinates: [-74.006, 40.7128] },
        trips: [],
      });
      await expect(
        service.create(
          1,
          1,
          { lat: 40.7128, lng: -74.006 },
          { lat: 40.73061, lng: -73.935242 },
        ),
      ).rejects.toThrow('Driver is not available');
    });
  });

  describe('findAllActive', () => {
    it('should return all active trips', async () => {
      const result = await service.findAllActive();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].tripStatus).toBe(TripStatus.ACTIVE);
    });
  });

  describe('complete', () => {
    it('should complete a trip and return an invoice', async () => {
      const driverServiceMock = moduleRef.get<DriverService>(DriverService);
      const updateLocationAndAvailabilitySpy = jest.spyOn(
        driverServiceMock,
        'updateLocationAndAvailability',
      );
      const result = await service.complete(1);
      expect(result).toBeDefined();
      expect(result).toBe(mockInvoice);
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        tripStatus: TripStatus.COMPLETE,
      });
      expect(invoiceService.createFromTrip).toHaveBeenCalledWith(mockTrip, 5.2);
      expect(updateLocationAndAvailabilitySpy).toHaveBeenCalledWith(
        mockTrip.driverId,
        mockTrip.endPoint,
        true,
      );
    });

    it('should throw error if trip not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.complete(999)).rejects.toThrow('Trip not found');
    });
  });

  describe('calculateDistance', () => {
    it('should calculate trip distance', async () => {
      const result = await service.calculateDistance(1);
      expect(result).toBe(5.2);
    });

    it('should throw error if trip not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.calculateDistance(999)).rejects.toThrow(
        'Trip not found',
      );
    });
  });
});
