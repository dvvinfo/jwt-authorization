import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private readonly filesService: FilesService,
  ) {}

  private addBaseUrlToPostImage(post: Post): Post {
    if (post && post.image) {
      post.image = `${process.env.API_URL}/${post.image}`;
    }
    return post;
  }

  async create(
    createPostDto: CreatePostDto,
    image: Express.Multer.File,
  ): Promise<Post> {
    const fileName = this.filesService.createFile(image);
    const post = await this.postRepository.create({
      ...createPostDto,
      image: fileName,
    });
    return this.addBaseUrlToPostImage(post);
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postRepository.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });
    return posts.map((post) => this.addBaseUrlToPostImage(post));
  }

  async findOne(id: number): Promise<Post | null> {
    const post = await this.postRepository.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });
    if (post) {
      return this.addBaseUrlToPostImage(post);
    }
    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    image?: Express.Multer.File,
  ) {
    const post = await this.postRepository.findByPk(id);

    if (!post) {
      throw new HttpException('Пост не найден', HttpStatus.NOT_FOUND);
    }

    // Если есть новое изображение, обрабатываем его
    if (image) {
      // Удаляем старое изображение, если оно было
      if (post.image) {
        this.filesService.deleteFile(post.image);
      }
      // Сохраняем новое и обновляем DTO
      const fileName = this.filesService.createFile(image);
      updatePostDto.image = fileName;
    } else if (updatePostDto.removeImage) {
      // Если пришел флаг на удаление, но нового файла нет
      if (post.image) {
        this.filesService.deleteFile(post.image);
      }
      updatePostDto.image = null;
    }

    // Применяем изменения
    Object.assign(post, updatePostDto);

    await post.save();
    return this.addBaseUrlToPostImage(post);
  }

  remove(id: number) {
    return this.postRepository.destroy({ where: { id } });
  }
}
