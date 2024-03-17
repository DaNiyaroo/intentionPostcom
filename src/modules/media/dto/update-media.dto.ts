import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { UpdateMediaItemDto } from './update.media.item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMediaDto {

    @ApiProperty({ description: 'файлы для поста (видио, фото)' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateMediaItemDto)
    media: UpdateMediaItemDto[];
  
    @ApiProperty({ description: 'ID поста' })
    @IsNumber()
    postId: number;
  }
  