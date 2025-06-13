import { IsNumber, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly title: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly content: string;

  @IsNumber({}, { message: 'Должно быть числом' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly userId: number;
}
