import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ROLES_KEY } from '../roles-auth.decorator';
import { Reflector } from '@nestjs/core';

interface JwtPayload {
  sub: string;
  email: string;
  roles: Array<{ value: string }>;
  [key: string]: unknown;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }
      const user = this.jwtService.verify<JwtPayload>(token);
      req.user = user;
      return user.roles.some((role) => requiredRoles.includes(role.value));
    } catch {
      throw new HttpException({ message: 'Нет доступа' }, HttpStatus.FORBIDDEN);
    }
  }
}
