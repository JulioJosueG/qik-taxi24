import { Test, TestingModule } from '@nestjs/testing';
import { PassengerService } from './passenger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity';
import { Driver } from '../driver/entities/driver.entity';

describe('PassengerService', () => {
  let service: PassengerService;

  const mockPassenger: Passenger = {
    id: 1,
    name: 'John Doe',
    email: '',
    phone: '',
    trips: [],
  };

  const mockDriver: Driver = {
    id: 1,
    name: 'Mike Johnson',
    telephone: '1234567890',
    dni: 'DNI123',
    isAvailable: true,
    location: { type: 'Point', coordinates: [-74.006, 40.7128] },
    trips: [],
  };

  const mockPassengerRepository = {
    find: jest.fn().mockResolvedValue([mockPassenger]),
    findOne: jest.fn().mockResolvedValue(mockPassenger),
  };

  const mockDriverRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockDriver]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengerService,
        {
          provide: getRepositoryToken(Passenger),
          useValue: mockPassengerRepository,
        },
        {
          provide: getRepositoryToken(Driver),
          useValue: mockDriverRepository,
        },
      ],
    }).compile();

    service = module.get<PassengerService>(PassengerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of passengers', async () => {
      const result = await service.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockPassenger);
    });
  });

  describe('findOne', () => {
    it('should return a single passenger', async () => {
      const result = await service.findOne(1);
      expect(result).toBeDefined();
      expect(result).toEqual(mockPassenger);
    });
  });

  describe('findCloseDrivers', () => {
    it('should return the 3 closest available drivers', async () => {
      const result = await service.findCloseDrivers(40.7128, -74.006);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockDriver);
      expect(mockDriverRepository.limit).toHaveBeenCalledWith(3);
    });

    it('should order drivers by distance', async () => {
      await service.findCloseDrivers(40.7128, -74.006);
      expect(mockDriverRepository.orderBy).toHaveBeenCalled();
    });
  });
});
