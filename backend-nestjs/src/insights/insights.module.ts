import { Module } from "@nestjs/common";
import { InsightsService } from "./insights.service";
import { InsightsController } from "./insights.controller";
import { WeatherModule } from "../weather/weather.module";

@Module({
  imports: [WeatherModule], // Importa WeatherModule para acessar os logs
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}