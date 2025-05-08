import { LocationDto } from 'src/common/dto/location.dto';

export class CreateTripDto {
  driverId: number;
  passengerId: number;
  startingPoint: LocationDto;
  endPoint: LocationDto;
}
