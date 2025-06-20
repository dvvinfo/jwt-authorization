import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';

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
    const posts = await this.postRepository.findAll({ include: { all: true } });
    return posts.map((post) => this.addBaseUrlToPostImage(post));
  }

  async findOne(id: number): Promise<Post | null> {
    const post = await this.postRepository.findByPk(id, {
      include: { all: true },
    });
    if (post) {
      return this.addBaseUrlToPostImage(post);
    }
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(updatePostDto, { where: { id } });
  }

  remove(id: number) {
    return this.postRepository.destroy({ where: { id } });
  }
}
