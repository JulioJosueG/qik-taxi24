import { Test, TestingModule } from '@nestjs/testing';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';

describe('DriverController', () => {
  let controller: DriverController;
  let driverService: DriverService;

  const mockDriver: Driver = {
    id: 1,
    name: 'John Doe',
    telephone: '1234567890',
    dni: 'DNI123',
    isAvailable: true,
    location: { type: 'Point', coordinates: [-74.006, 40.7128] },
    trips: [],
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        DriverService,
        {
          provide: getRepositoryToken(Driver),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<DriverController>(DriverController);
    driverService = module.get<DriverService>(DriverService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of drivers', async () => {
      jest.spyOn(driverService, 'findAll').mockResolvedValue([mockDriver]);

      const result = await controller.findAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockDriver);
      expect(driverService.findAll).toHaveBeenCalled();
    });
  });

  describe('findAvailableInRadius', () => {
    it('should return available drivers within radius', async () => {
      jest
        .spyOn(driverService, 'findAvailableInRadius')
        .mockResolvedValue([mockDriver]);

      const location = { lat: 40.7128, lng: -74.006 };
      const result = await controller.findAvailableInRadius(location);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].isAvailable).toBe(true);
      expect(driverService.findAvailableInRadius).toHaveBeenCalledWith(
        location,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single driver', async () => {
      jest.spyOn(driverService, 'findOne').mockResolvedValue(mockDriver);

      const result = await controller.findOne('1');

      expect(result).toBeDefined();
      expect(result).toEqual(mockDriver);
      expect(driverService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('updateLocation', () => {
    it('should update driver location', async () => {
      jest.spyOn(driverService, 'updateLocation').mockResolvedValue(mockDriver);

      const location = { lat: 40.7128, lng: -74.006 };
      const result = await controller.updateLocation('1', location);

      expect(result).toBeDefined();
      expect(result).toEqual(mockDriver);
      expect(driverService.updateLocation).toHaveBeenCalledWith(1, location);
    });
  });
});
