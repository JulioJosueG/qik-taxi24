import { Test, TestingModule } from '@nestjs/testing';
import { DriverService } from './driver.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';

describe('DriverService', () => {
  let service: DriverService;

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
    find: jest.fn().mockResolvedValue([mockDriver]),
    findOne: jest.fn().mockResolvedValue(mockDriver),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockDriver]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: getRepositoryToken(Driver),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of drivers', async () => {
      const result = await service.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockDriver);
    });
  });

  describe('findAvailable', () => {
    it('should return only available drivers', async () => {
      const result = await service.findAvailable();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].isAvailable).toBe(true);
    });
  });

  describe('findAvailableInRadius', () => {
    it('should return available drivers within radius', async () => {
      const location = { lat: 40.7128, lng: -74.006 };
      const result = await service.findAvailableInRadius(location);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].isAvailable).toBe(true);
      expect(mockRepository.andWhere).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single driver', async () => {
      const result = await service.findOne(1);
      expect(result).toBeDefined();
      expect(result).toEqual(mockDriver);
    });
  });

  describe('updateLocation', () => {
    it('should update driver location', async () => {
      const location = { lat: 40.7128, lng: -74.006 };
      const result = await service.updateLocation(1, location);
      expect(result).toBeDefined();
      expect(result).toEqual(mockDriver);
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        location: { type: 'Point', coordinates: [location.lng, location.lat] },
      });
    });
  });
});
