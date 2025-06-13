import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    private filesService: FilesService,
  ) {}

  async create(createPostDto: CreatePostDto, image: any) {
    const fileName = this.filesService.createFile(image);
    const post = await this.postModel.create({
      ...createPostDto,
      image: fileName,
    });
    return post;
  }

  findAll() {
    return this.postModel.findAll();
  }

  findOne(id: number) {
    return this.postModel.findByPk(id);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postModel.update(updatePostDto, { where: { id } });
  }

  remove(id: number) {
    return this.postModel.destroy({ where: { id } });
  }
}
