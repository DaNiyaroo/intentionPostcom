import { Type } from "class-transformer";
import { IsArray, IsIn, IsNumber, IsUrl, ValidateNested } from "class-validator";
import { MediaItemDto } from "./media.item.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMediaDto {

    @ApiProperty({ description: 'файлы для поста (видио, фото)' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MediaItemDto)
    media: MediaItemDto[];
    
    @ApiProperty({ description: 'ID поста' })
    @IsNumber()
    postId: number;
}
