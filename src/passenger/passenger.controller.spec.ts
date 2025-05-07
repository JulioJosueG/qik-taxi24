import { Test, TestingModule } from '@nestjs/testing';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity';
import { Driver } from '../driver/entities/driver.entity';

describe('PassengerController', () => {
  let controller: PassengerController;
  let passengerService: PassengerService;

  const mockPassenger: Passenger = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
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
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockDriverRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengerController],
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

    controller = module.get<PassengerController>(PassengerController);
    passengerService = module.get<PassengerService>(PassengerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of passengers', async () => {
      jest
        .spyOn(passengerService, 'findAll')
        .mockResolvedValue([mockPassenger]);

      const result = await controller.findAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockPassenger);
      expect(passengerService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single passenger', async () => {
      jest.spyOn(passengerService, 'findOne').mockResolvedValue(mockPassenger);

      const result = await controller.findOne('1');

      expect(result).toBeDefined();
      expect(result).toEqual(mockPassenger);
      expect(passengerService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findCloseDrivers', () => {
    it('should return the 3 closest available drivers', async () => {
      jest
        .spyOn(passengerService, 'findCloseDrivers')
        .mockResolvedValue([mockDriver]);

      const result = await controller.findCloseDrivers(40.7128, -74.006);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockDriver);
      expect(passengerService.findCloseDrivers).toHaveBeenCalledWith(
        40.7128,
        -74.006,
      );
    });
  });
});
