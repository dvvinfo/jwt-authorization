import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Role } from '../../roles/entities/role.entity';
import { UserRoles } from '../../roles/entities/user-roles.entity';
import { Post } from '../../posts/entities/post.entity';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({
  tableName: 'users',
})
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Почта' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @ApiProperty({ example: '123456', description: 'Пароль' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @ApiProperty({ example: false, description: 'Заблокирован' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare banned: boolean;

  @ApiProperty({
    example: 'Пользователь не соблюдает правила',
    description: 'Причина блокировки',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare banReason: string;

  @ApiProperty({ type: () => [Role], description: 'Роли пользователя' })
  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @ApiProperty({ type: () => [Post], description: 'Посты пользователя' })
  @HasMany(() => Post)
  posts: Post[];
}
