import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WeatherModule } from "./weather/weather.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { InsightsModule } from "./insights/insights.module";
import { PokemonModule } from "./pokemon/pokemon.module";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || "mongodb://mongodb:27017/gdash_db"),
    WeatherModule,
    UsersModule,
    AuthModule,
    InsightsModule,
    PokemonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}