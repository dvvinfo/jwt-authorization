import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ example: 'user@example.com', description: 'Почта' })
  readonly email: string;

  @ApiProperty({ example: '123456', description: 'Пароль' })
  readonly password: string;
}
