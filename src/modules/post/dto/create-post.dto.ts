import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePostDto {

    @ApiProperty({ description: 'Короткое название поста' })
    @IsString()
    titleUz: string

    @ApiProperty({ description: 'Короткое название поста на русском' })
    @IsString()
    titleRu: string

    @ApiProperty({ description: 'Описание поста' })
    @IsString()
    descriptionUz: string

    @ApiProperty({ description: 'Описание поста на русском' })
    @IsString()
    descriptionRu: string

    @ApiProperty({ description: 'Автор' })
    @IsString()
    author: string

}
