import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Роль' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly value: string;
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  @IsNumber({}, { message: 'Должно быть числом' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly userId: number;
}
