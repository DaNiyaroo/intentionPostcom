import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { Post } from '../post/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllDto } from 'src/common/dto/findAll.dto';
import { Pagination } from 'src/common/utils/pagination';
import { ApiResponse } from 'src/common/http/api.response';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) { }
  async create(createMediaDto: CreateMediaDto) {
    try {
      const { media, postId } = createMediaDto;
      const post = await this.postRepo.findOne({where: {id: postId}});
      if(!post) {
        throw new BadRequestException(`Post with id ${postId} not found`);
      }
      for (const mediaItem of media) {
        const { url, type } = mediaItem;
        const createMedia = this.mediaRepo.create({ url, type, post });
        await this.mediaRepo.save(createMedia);
      }
      return "success";
    } catch (error) {
      throw error;
    }
}

  async findAll(findAllDto: FindAllDto) {
    try {
      const { page, limit, search } = findAllDto;
      const totalPostCount = await this.mediaRepo.count();
      const pagination = new Pagination(limit, page, totalPostCount);
      const media = await this.mediaRepo
        .createQueryBuilder('media')
        .where('media.url LIKE :search', { search: `%${search}%` })
        .orWhere('media.type LIKE :search', { search: `%${search}%` })
        .skip(pagination.offset)
        .take(limit)
        .getMany();
      return new ApiResponse(media, pagination);
    } catch (error) {
      throw error;
    }
  }
  
  async findOne(id: number) {
    try {
      const media = await this.postRepo.findOne({ where: { id }, relations: ['post']});
      if (!media) {
        throw new NotFoundException(`Media with id ${id} not found`);
      }
      return media
    } catch (error) {
      throw error;
    }
  }

  async update(updateMediaDto: UpdateMediaDto) {
    try {
      const { media, postId } = updateMediaDto;
      const post = await this.postRepo.findOne({where: {id: postId}});
      if(!post) {
        throw new BadRequestException(`Post with id ${postId} not found`);
      }
      for (const mediaItem of media) {
        const { id, url, type } = mediaItem;
        const mediaToUpdate = await this.mediaRepo.findOne({ where: { id } });
        if (!mediaToUpdate) {
          throw new BadRequestException(`Media with id ${id} not found`);
        }
        mediaToUpdate.url = url ?? mediaToUpdate.url;
        mediaToUpdate.type = type ?? mediaToUpdate.type;
        mediaToUpdate.post = post;
        await this.mediaRepo.save(mediaToUpdate);
      }
      return "success";
    } catch (error) {
      throw error;
    }
  }
  
  async remove(id: number) {
    try {
      const media = await this.mediaRepo.findOneBy({ id })
      if (!media) {
        throw new NotFoundException(`Media wwith id: ${id} not found`)
      }
      this.mediaRepo.delete({ id })
      return "success"
    } catch (error) {
      throw error
    }
  }
}
