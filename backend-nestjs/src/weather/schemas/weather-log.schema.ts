import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherLogDocument = HydratedDocument<WeatherLog>;

@Schema({ timestamps: true, collection: 'weather_logs' })
export class WeatherLog {
  @Prop({ required: true, index: true })
  timestamp!: Date; 

  @Prop()
  latitude!: number;

  @Prop()
  longitude!: number;

  @Prop()
  elevation!: number;

  @Prop()
  temperature_c!: number;
  
  @Prop()
  apparent_temperature_c!: number;
  
  @Prop()
  precipitation_mm!: number;
  
  @Prop()
  rain_mm!: number;
  
  @Prop()
  cloud_cover_percent!: number;
  
  @Prop()
  wind_speed_kph!: number;
  
  @Prop()
  source!: string;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);