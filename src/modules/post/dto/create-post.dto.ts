import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePostDto {

    @ApiProperty({ description: 'Короткое название поста' })
    @IsString()
    title: string

    @ApiProperty({ description: 'Описание поста' })
    @IsString()
    description: string

    @ApiProperty({ description: 'Автор' })
    @IsString()
    author: string

}
