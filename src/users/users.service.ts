import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }

  findAll() {
    const users = this.userRepository.findAll();
    return users;
  }

  findOne(id: number) {
    const user = this.userRepository.findByPk(id);
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
}
