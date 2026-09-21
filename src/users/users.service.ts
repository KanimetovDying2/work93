import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create.user.dto.js';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class Userservice {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(createUserDto: CreateUserDto) {
    const existing = await this.userModel.findOne({
      username: createUserDto.username,
    });

    if (existing) {
      throw new BadRequestException(`Username already exist`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = new this.userModel({
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role || 'user',
      token: randomUUID(),
    });

    return user.save();
  }

  async login(username: string, pass: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.token = randomUUID();
    await user.save();
    return { token: user.token, role: user.role };
  }

  async logout(token: string) {
    const user = await this.userModel.findOne({ token });
    if (user) {
      user.token = '';
      await user.save();
    }
    return { message: 'Logged out successfully' };
  }
}
