import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WeatherLog, WeatherLogDocument } from "./schemas/weather-log.schema";
import { WeatherLogDto } from "./dto/weather-log.dto";

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectModel(WeatherLog.name) private weatherLogModel: Model<WeatherLogDocument>,
  ) {}

  async createLog(logData: WeatherLogDto): Promise<WeatherLogDocument> {
    try {
        const logToSave = {
          ...logData,
          timestamp: new Date(logData.timestamp),
        };
        const createdLog = new this.weatherLogModel(logToSave);
        const result = await createdLog.save();
        this.logger.log(`Novo log salvo: ${result.timestamp}`);
        return result;
    } catch (error) {
        const err = error as Error;
        this.logger.error("Erro ao salvar log", err?.stack);
        throw new InternalServerErrorException("Falha na persistência");
    }
  }

  async findAll(): Promise<WeatherLogDocument[]> {
    return this.weatherLogModel.find().sort({ timestamp: -1 }).limit(50).exec();
  }

  // --- NOVO: GERADOR DE CSV ---
  async getCsvData(): Promise<string> {
    const logs = await this.weatherLogModel.find().sort({ timestamp: -1 }).limit(100).exec();
    
    if (!logs.length) return "Data,Temperatura,Vento,Chuva\n";

    const header = "DataISO,Temperatura(C),Sensacao(C),Vento(km/h),Chuva(mm),Fonte\n";
    const rows = logs.map(log => 
      `${log.timestamp.toISOString()},${log.temperature_c},${log.apparent_temperature_c},${log.wind_speed_kph},${log.precipitation_mm},${log.source}`
    ).join("\n");

    return header + rows;
  }
}