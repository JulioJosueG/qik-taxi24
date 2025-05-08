import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { InvoiceService } from '../invoice/invoice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { TripStatus } from './entities/trip.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Response } from 'express';
import { CreateTripDto } from './dto/create-trip.dto';
import { DriverService } from '../driver/driver.service';

describe('TripController', () => {
  let controller: TripController;
  let tripService: TripService;

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
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };

  const mockResponse = {
    set: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
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
            findOne: jest.fn().mockResolvedValue({ isAvailable: true }),
            updateAvailability: jest.fn(),
            updateLocationAndAvailability: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TripController>(TripController);
    tripService = module.get<TripService>(TripService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new trip', async () => {
      jest.spyOn(tripService, 'create').mockResolvedValue(mockTrip);

      const createTripDto: CreateTripDto = {
        passengerId: 1,
        driverId: 1,
        startingPoint: { lat: 40.7128, lng: -74.006 },
        endPoint: { lat: 40.73061, lng: -73.935242 },
      };

      const result = await controller.create(createTripDto);

      expect(result).toBeDefined();
      expect(result).toEqual(mockTrip);
      expect(tripService.create).toHaveBeenCalledWith(
        createTripDto.passengerId,
        createTripDto.driverId,
        createTripDto.startingPoint,
        createTripDto.endPoint,
      );
    });
  });

  describe('findAllActive', () => {
    it('should return all active trips', async () => {
      jest.spyOn(tripService, 'findAllActive').mockResolvedValue([mockTrip]);

      const result = await controller.findAllActive();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockTrip);
      expect(tripService.findAllActive).toHaveBeenCalled();
    });
  });

  describe('complete', () => {
    it('should complete a trip and return a PDF invoice', async () => {
      const pdfBuffer = Buffer.from('mock pdf content');
      jest.spyOn(tripService, 'complete').mockResolvedValue(mockInvoice);
      jest
        .spyOn(tripService, 'generateInvoicePDF')
        .mockResolvedValue(pdfBuffer);

      await controller.complete('1', mockResponse);

      expect(tripService.complete).toHaveBeenCalledWith(1);
      expect(tripService.generateInvoicePDF).toHaveBeenCalledWith(mockInvoice);
      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=invoice-${mockInvoice.id}.pdf`,
        'Content-Length': pdfBuffer.length,
      });
      expect(mockResponse.send).toHaveBeenCalledWith(pdfBuffer);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate trip distance', async () => {
      jest.spyOn(tripService, 'calculateDistance').mockResolvedValue(5.2);

      const result = await controller.calculateDistance('1');

      expect(result).toBeDefined();
      expect(result).toBe(5.2);
      expect(tripService.calculateDistance).toHaveBeenCalledWith(1);
    });
  });
});
