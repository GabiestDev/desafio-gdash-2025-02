import { Module } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { PokemonController } from "./pokemon.controller";
import { WeatherModule } from "../weather/weather.module";

@Module({
  imports: [WeatherModule], // Importa Weather para acessar os dados
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}