import { Test, TestingModule } from '@nestjs/test';
import { PassengerService } from './passenger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Repository } from 'typeorm';

describe('PassengerService', () => {
  let service: PassengerService;
  let passengerRepository: Repository<Passenger>;
  let driverRepository: Repository<Driver>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengerService,
        {
          provide: getRepositoryToken(Passenger),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Driver),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            setParameter: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            getMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PassengerService>(PassengerService);
    passengerRepository = module.get<Repository<Passenger>>(getRepositoryToken(Passenger));
    driverRepository = module.get<Repository<Driver>>(getRepositoryToken(Driver));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of passengers', async () => {
      const result = [{ id: 1, name: 'Test Passenger' }];
      jest.spyOn(passengerRepository, 'find').mockResolvedValue(result as Passenger[]);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single passenger', async () => {
      const result = { id: 1, name: 'Test Passenger' };
      jest.spyOn(passengerRepository, 'findOne').mockResolvedValue(result as Passenger);

      expect(await service.findOne(1)).toBe(result);
    });
  });

  describe('findCloseDrivers', () => {
    it('should return the 3 closest available drivers', async () => {
      const mockDrivers = [
        { id: 1, name: 'Driver 1', isAvailable: true },
        { id: 2, name: 'Driver 2', isAvailable: true },
        { id: 3, name: 'Driver 3', isAvailable: true },
      ];
      jest.spyOn(driverRepository, 'getMany').mockResolvedValue(mockDrivers as Driver[]);

      const result = await service.findCloseDrivers(40.7128, -74.0060);
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockDrivers);
    });
  });
});
