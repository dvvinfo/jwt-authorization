import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UserRoles } from './entities/user-roles.entity';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.create(createRoleDto);
    return role;
  }

  async findAll() {
    const roles = await this.roleRepository.findAll();
    return roles;
  }

  async findOne(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }

  async findOneOrFail(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  // async update(id: number, updateRoleDto: UpdateRoleDto) {
  //   const role = await this.roleRepository.findByPk(id);
  //   if (!role) {
  //     throw new NotFoundException('Role not found');
  //   }
  //   return role.update(updateRoleDto);
  // }

  // async remove(id: number) {
  //   const role = await this.roleRepository.findByPk(id);
  //   if (!role) {
  //     throw new NotFoundException('Role not found');
  //   }
  //   return role.destroy();
  // }
}
