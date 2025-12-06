import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Executa quando o módulo inicia (Cria o Admin se não existir)
  async onModuleInit() {
    const adminEmail = "admin@example.com";
    const adminExists = await this.findOne(adminEmail);
    
    if (!adminExists) {
      this.logger.log("Criando usuário admin padrão...");
      await this.create({
        name: "Admin GDASH",
        email: adminEmail,
        password: "123456" // Em produção, usar variavel de ambiente
      });
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}