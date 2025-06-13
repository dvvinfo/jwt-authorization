import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserRoles } from 'src/roles/entities/user-roles.entity';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-use.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
    private roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    const role = await this.roleService.findOne('user');
    if (role) {
      await user.$set('roles', [role.id]);
      user.roles = [role];
    }
    // Перезагружаем пользователя с ролями
    // return await this.userRepository.findByPk(user.id, {
    //   include: { all: true },
    // });
    return user;
  }

  async findAll() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findByPk(id, {
      include: { all: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.update(updateUserDto);
    return user;
  }

  async remove(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.destroy();
    return user;
  }
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }
  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.findOne(dto.value);
    if (role && user) {
      await user.$add('roles', role.id);
      return dto;
    }
    throw new HttpException(
      'Пользователь или роль не найдены',
      HttpStatus.NOT_FOUND,
    );
  }
  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }
}
