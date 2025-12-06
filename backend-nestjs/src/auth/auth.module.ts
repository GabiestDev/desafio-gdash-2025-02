import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: "SEGREDO_SUPER_SECRETO_GDASH", // Em prod, usar env
      signOptions: { expiresIn: "60m" },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}