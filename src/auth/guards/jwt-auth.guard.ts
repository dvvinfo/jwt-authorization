import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  [key: string]: unknown;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    try {
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
      return true;
    } catch {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }
}
