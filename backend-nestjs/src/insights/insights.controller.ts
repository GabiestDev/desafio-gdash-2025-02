import { Controller, Get, UseGuards } from "@nestjs/common";
import { InsightsService } from "./insights.service";
// import { AuthGuard } from "../auth/auth.guard"; // Pode ser adicionado depois para proteger

@Controller("weather/insights")
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  async getInsights() {
    return this.insightsService.generateInsights();
  }
}