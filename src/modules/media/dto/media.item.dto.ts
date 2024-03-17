import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MediaItemDto {

    @ApiProperty({ description: 'URL аддрес (фото, видио)' })
    @IsString()
    url: string;
  
    @ApiProperty({ description: 'Тип аддреса (фото или видио)' })
    @IsString()
    type: 'image' | 'video';

  }
  