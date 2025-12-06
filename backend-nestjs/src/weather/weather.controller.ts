import { Controller, Post, Get, Body, Res, HttpCode, HttpStatus, UsePipes, ValidationPipe, Header } from "@nestjs/common";
import { Response } from "express";
import { WeatherService } from "./weather.service";
import { WeatherLogDto } from "./dto/weather-log.dto";

@Controller("weather")
@UsePipes(new ValidationPipe({ transform: true })) 
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post("logs")
  @HttpCode(HttpStatus.CREATED) 
  async receiveWeatherLog(@Body() logData: WeatherLogDto) {
    return this.weatherService.createLog(logData);
  }

  @Get("logs")
  async getAllLogs() {
    return this.weatherService.findAll();
  }

  // --- NOVO: ENDPOINT DE EXPORTAÇÃO ---
  @Get("export")
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", "attachment; filename=gdash_clima.csv")
  async exportCsv(@Res() res: Response) {
    const csv = await this.weatherService.getCsvData();
    res.send(csv);
  }
}