import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    minimum: -90,
    maximum: 90,
    example: 40.7128,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    minimum: -180,
    maximum: 180,
    example: -74.006,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}
