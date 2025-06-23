import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  createFile(file: Express.Multer.File): string {
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      const fileBuffer = (file as { buffer: Buffer }).buffer;
      fs.writeFileSync(path.join(filePath, fileName), fileBuffer);
      return fileName;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  deleteFile(fileName: string): void {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e: any) {
      console.log(e);
      // Не выбрасываем ошибку, чтобы не прерывать основной процесс (например, обновление поста)
      // Можно добавить более сложную логику логирования
      console.error(`Ошибка при удалении файла ${fileName}`);
    }
  }
}
