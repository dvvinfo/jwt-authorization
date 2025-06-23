import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsString()
  image?: string | null;

  @IsOptional()
  @IsBoolean()
  removeImage?: boolean;
}
