import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({ example: 'Имя файла', description: 'Имя файла' })
  readonly image: Express.Multer.File;
}
