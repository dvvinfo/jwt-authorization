import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!metadata.metatype || !this.isConstructor(metadata.metatype)) {
      return value;
    }
    const obj = plainToClass(metadata.metatype, value) as Record<
      string,
      unknown
    >;
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map((err) => {
        return `${err.property} - ${Object.values(err.constraints || {}).join(', ')}`;
      });
      throw new ValidationException(messages);
    }
    return value;
  }

  private isConstructor(value: unknown): boolean {
    if (typeof value !== 'function') return false;
    const prototype = Object.getPrototypeOf(value) as { constructor?: unknown };
    return prototype?.constructor === value;
  }
}
