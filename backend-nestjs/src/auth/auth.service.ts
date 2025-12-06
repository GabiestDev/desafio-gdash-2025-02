import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findOne(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const payload = { sub: user._id, email: user.email, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { email: user.email, name: user.name }
    };
  }
}