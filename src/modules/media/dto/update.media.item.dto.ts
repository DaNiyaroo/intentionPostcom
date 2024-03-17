import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UpdateMediaItemDto {

    @ApiProperty({ description: 'ID медиафала' })
    @IsNumber()
    id: number;
  
    @ApiProperty({ description: 'URL аддрес (фото, видио)' })
    @IsString()
    url: string;
     
    @ApiProperty({ description: 'Тип аддреса (фото или видио)' })
    @IsString()
    type: 'image' | 'video';
  }
  