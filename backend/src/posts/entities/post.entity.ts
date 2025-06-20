import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

interface PostCreationAttrs {
  title: string;
  content: string;
  image: string;
  userId: number;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 'Title', description: 'Заголовок' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare title: string;

  @ApiProperty({ example: 'Content', description: 'Содержимое' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare content: string;

  @ApiProperty({ example: 'Image', description: 'Изображение' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare image: string;

  @ApiProperty({ example: 1, description: 'ID автора' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare userId: number;

  @ApiProperty({ type: () => User, description: 'Автор поста' })
  @BelongsTo(() => User)
  declare author: User;
}
