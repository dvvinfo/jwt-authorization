import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(userDto);
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto): Promise<AuthResponseDto> {
    const candidate = await this.userService.findByEmail(userDto.email);
    if (candidate) {
      throw new UnauthorizedException(
        'Пользователь с таким email уже существует',
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.create({
      ...userDto,
      password: hashPassword,
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь не создан');
    }
    return this.generateToken(user);
  }

  private generateToken(user: User): AuthResponseDto {
    const payload = {
      email: user.email,
      id: user.id,
      roles: user.roles ? user.roles.map((role) => role.value) : [],
    };
    const token = this.jwtService.sign(payload);

    // Исключаем пароль из возвращаемого объекта пользователя
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResult } = user.get({ plain: true });

    return {
      token,
      user: userResult as User,
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.findByEmail(userDto.email);
    if (!user) {
      return null;
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException('Неверный email или пароль');
  }
}
