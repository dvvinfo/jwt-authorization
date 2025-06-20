import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'JWT access token',
  })
  token: string;

  @ApiProperty({
    type: () => User,
    description: 'User object',
  })
  user: User;
}
