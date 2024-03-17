import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { FindAllDto } from 'src/common/dto/findAll.dto';
import { Pagination } from 'src/common/utils/pagination';
import { ApiResponse } from 'src/common/http/api.response';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) { }
  async create(createPostDto: CreatePostDto) {
    try {
      const { title, description, author } = createPostDto
      const createPost = this.postRepo.create({ title, description, author })
      await this.postRepo.save(createPost)
      return "success"
    } catch (error) {
      console.error
      throw error
    }
  }
  async findAll(findAllDto: FindAllDto) {
    try {
      const { page, limit, search } = findAllDto;
      const totalPostCount = await this.postRepo.count();
      const pagination = new Pagination(limit, page, totalPostCount);
      const posts = await this.postRepo
        .createQueryBuilder('post')
        .where('post.title LIKE :search', { search: `%${search}%` })
        .orWhere('post.author LIKE :search', { search: `%${search}%` })
        .skip(pagination.offset)
        .take(limit)
        .getMany();
      return new ApiResponse(posts, pagination);
    } catch (error) {
      throw error;
    }
  }
  async findOne(id: number) {
    try {
      const post = await this.postRepo.findOne({ where: { id }, relations: ['media']});
      if (!post) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
      post.views += 1;
      await this.postRepo.save(post);
      return post;
    } catch (error) {
      throw error;
    }
  }
  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const { title, description, author } = updatePostDto;
      const post = await this.postRepo.findOne({ where: { id } });
      if (!post) {
        throw new BadRequestException(`Post with id ${id} not found`);
      }
      post.title = title ?? post.title;
      post.description = description ?? post.description;
      post.author = author ?? post.author;
      await this.postRepo.save(post);
      return "success"
    } catch (error) {
      throw error;
    }
  }
  async remove(id: number) {
    try {
      const post = await this.postRepo.findOneBy({ id })
      if (!post) {
        throw new NotFoundException(`Post wwith id: ${id} not found`)
      }
      this.postRepo.delete({ id })
      return "success"
    } catch (error) {
      throw error
    }
  }
}
