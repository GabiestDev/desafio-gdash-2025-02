import { Injectable, Logger } from "@nestjs/common";
import { WeatherService } from "../weather/weather.service";

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(private weatherService: WeatherService) {}

  async getPokemonByWeather() {
    const logs = await this.weatherService.findAll();
    const current = logs[0]; 

    if (!current) {
      return this.fetchRandomPokemonByType("normal", "Dados insuficientes.");
    }

    let type = "normal";
    let reason = "O clima está neutro.";
    
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6;

    // CORREÇÃO: Adicionado .toFixed(1) em todas as variáveis
    if (current.precipitation_mm > 0 || current.rain_mm > 0) {
      type = "water"; 
      reason = `Está chovendo (${current.precipitation_mm.toFixed(1)}mm). Pokémons de Água adoram umidade!`;
    } else if (current.temperature_c > 28) {
      type = "fire"; 
      reason = `A temperatura está alta (${current.temperature_c.toFixed(1)}°C). O calor atrai tipos de Fogo.`;
    } else if (current.temperature_c < 10) {
      type = "ice"; 
      reason = `Está muito frio (${current.temperature_c.toFixed(1)}°C). Cuidado com os Pokémons de Gelo!`;
    } else if (current.wind_speed_kph > 20) {
      type = "flying"; 
      reason = `Ventos fortes (${current.wind_speed_kph.toFixed(1)}km/h) detectados. Ótimo para voar!`;
    } else if (isNight) {
      type = "ghost"; 
      reason = "Já anoiteceu. Os tipos Fantasma saem para brincar...";
    } else if (current.cloud_cover_percent < 20) {
      type = "grass"; 
      reason = "Céu limpo e ensolarado. Perfeito para fotossíntese dos tipos Planta.";
    }

    this.logger.log(`Clima atual: ${current.temperature_c.toFixed(1)}C. Tipo: ${type}`);

    return this.fetchRandomPokemonByType(type, reason);
  }

  private async fetchRandomPokemonByType(type: string, reason: string) {
    try {
      const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const typeData = await typeResponse.json() as any;
      
      const pokemons = typeData.pokemon;
      const randomIndex = Math.floor(Math.random() * pokemons.length);
      const pokemonUrl = pokemons[randomIndex].pokemon.url;

      const pokemonResponse = await fetch(pokemonUrl);
      const pokemonData = await pokemonResponse.json() as any;

      return {
        name: pokemonData.name,
        id: pokemonData.id,
        type: type,
        reason: reason,
        image: pokemonData.sprites?.other?.["official-artwork"]?.front_default || pokemonData.sprites?.front_default,
        weather_context: {
            temp: 0,
            condition_match: type
        }
      };
    } catch (error) {
      this.logger.error("Erro ao buscar Pokémon", error);
      throw error;
    }
  }
}