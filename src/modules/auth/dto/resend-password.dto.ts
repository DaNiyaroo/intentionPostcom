import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsStrongPassword } from "class-validator";

export class ResendPasswordDto {

    @ApiProperty({ description: 'Эмайл для отправки одноразового пароля (для использование емайла)' })
    @IsString()
    token: string;

    @ApiProperty({ description: 'пароль' })
    @IsStrongPassword()
    password: string
}