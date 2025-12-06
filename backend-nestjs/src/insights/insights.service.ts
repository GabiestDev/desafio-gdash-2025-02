import { Injectable } from "@nestjs/common";
import { WeatherService } from "../weather/weather.service";

export interface WeatherInsight {
  type: "alert" | "info" | "trend";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

@Injectable()
export class InsightsService {
  constructor(private weatherService: WeatherService) {}

  async generateInsights(): Promise<WeatherInsight[]> {
    const logs = await this.weatherService.findAll();
    const insights: WeatherInsight[] = [];

    if (logs.length < 2) {
      return [{ type: "info", title: "Dados Insuficientes", description: "Aguardando mais coletas para gerar análise.", severity: "low" }];
    }

    const current = logs[0];
    const previous = logs[1];

    // 1. Análise de Tendência de Temperatura
    const tempDiff = current.temperature_c - previous.temperature_c;
    if (Math.abs(tempDiff) > 2) {
      insights.push({
        type: "trend",
        title: tempDiff > 0 ? "Aquecimento Rápido" : "Resfriamento Rápido",
        description: `A temperatura variou ${tempDiff.toFixed(1)}°C na última hora.`,
        severity: "medium"
      });
    }

    // 2. Análise de Conforto Térmico (Índice Simples)
    if (current.apparent_temperature_c > 30) {
      insights.push({
        type: "alert",
        title: "Calor Intenso",
        description: "Sensação térmica elevada. Hidrate-se bem.",
        severity: "high"
      });
    } else if (current.apparent_temperature_c < 10) {
      insights.push({
        type: "alert",
        title: "Frio Intenso",
        description: "Temperaturas baixas detectadas. Agasalhe-se.",
        severity: "medium"
      });
    } else {
      insights.push({
        type: "info",
        title: "Clima Agradável",
        description: "Condições ideais de temperatura e vento.",
        severity: "low"
      });
    }

    // 3. Alerta de Vento
    if (current.wind_speed_kph > 20) {
      insights.push({
        type: "alert",
        title: "Ventos Fortes",
        description: `Rajadas de ${current.wind_speed_kph} km/h detectadas.`,
        severity: "high"
      });
    }

    // 4. Chuva (Se houver precipitação)
    if (current.precipitation_mm > 0 || current.rain_mm > 0) {
       insights.push({
        type: "alert",
        title: "Chuva Detectada",
        description: "Precipitação registrada no momento.",
        severity: "medium"
      });
    }

    return insights;
  }
}