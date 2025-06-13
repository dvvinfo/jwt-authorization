import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Роль' })
  readonly value: string;
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  readonly userId: number;
}
