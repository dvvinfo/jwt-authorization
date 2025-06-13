import { HttpException, HttpStatus } from '@nestjs/common';
export class ValidationException extends HttpException {
  messages: string[];
  constructor(response: string | string[] | Record<string, any>) {
    super(response, HttpStatus.BAD_REQUEST);
    this.messages = Array.isArray(response)
      ? response.map(String)
      : [
          typeof response === 'object'
            ? JSON.stringify(response)
            : String(response),
        ];
  }
}
