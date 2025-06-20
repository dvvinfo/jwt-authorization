import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BanUserDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  @IsNumber({}, { message: 'Должно быть числом' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly userId: number;
  @ApiProperty({
    example: 'Некорректные действия',
    description: 'Причина бана',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly banReason: string;
}
