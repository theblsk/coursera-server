import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from './auth.guard';
import { Request } from 'express';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userPayload = request.user as JwtPayload;

    if (!userPayload || !userPayload.sub) {
      throw new ForbiddenException('Authentication required');
    }

    const user = await this.usersService.findOneById(userPayload.sub);

    if (!user || !user.subscribed) {
      throw new ForbiddenException(
        'Access denied. User subscription required.',
      );
    }

    return true;
  }
}
