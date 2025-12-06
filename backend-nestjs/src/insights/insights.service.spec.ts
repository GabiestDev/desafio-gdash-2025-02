import { Test, TestingModule } from "@nestjs/testing";
import { InsightsService } from "./insights.service";
import { WeatherService } from "../weather/weather.service";

describe("InsightsService", () => {
  let service: InsightsService;
  let weatherService: WeatherService;

  // Mock dos dados do WeatherService
  const mockWeatherLogs = [
    {
      temperature_c: 35, // Calor extremo
      apparent_temperature_c: 38,
      wind_speed_kph: 10,
      precipitation_mm: 0,
      rain_mm: 0,
      cloud_cover_percent: 10,
    },
    {
      temperature_c: 34,
      apparent_temperature_c: 37,
    }
  ];

  const mockWeatherService = {
    findAll: jest.fn().mockResolvedValue(mockWeatherLogs),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsightsService,
        { provide: WeatherService, useValue: mockWeatherService },
      ],
    }).compile();

    service = module.get<InsightsService>(InsightsService);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  it("deve estar definido", () => {
    expect(service).toBeDefined();
  });

  it("deve gerar um alerta de Calor Intenso quando a temperatura for alta", async () => {
    const insights = await service.generateInsights();
    
    // Verifica se gerou insights
    expect(insights.length).toBeGreaterThan(0);
    
    // Verifica se um dos insights é sobre calor
    const heatAlert = insights.find(i => i.title === "Calor Intenso");
    expect(heatAlert).toBeDefined();
    expect(heatAlert?.severity).toBe("high");
  });
});