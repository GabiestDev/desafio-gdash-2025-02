import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class WeatherLogDto {
  @IsNotEmpty()
  @IsString()
  timestamp!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
  
  @IsNumber()
  elevation!: number;

  @IsNumber()
  temperature_c!: number;
  
  @IsNumber()
  apparent_temperature_c!: number;
  
  @IsNumber()
  precipitation_mm!: number;
  
  @IsNumber()
  rain_mm!: number;
  
  @IsNumber()
  cloud_cover_percent!: number;
  
  @IsNumber()
  wind_speed_kph!: number;

  @IsString()
  source!: string;
}