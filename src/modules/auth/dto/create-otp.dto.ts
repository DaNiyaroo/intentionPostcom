import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class CreateOtpDto {

    @ApiProperty({ description: 'Эмайл для отправки одноразового пароля (для использование емайла)' })
    @IsEmail()
    email: string;
}
