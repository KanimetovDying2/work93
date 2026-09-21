import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Userservice } from '../users.service.js';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private usersService: Userservice) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token not found');
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await this.usersService['userModel'].findOne({ token });

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    request.user = user;
    return true;
  }
}
