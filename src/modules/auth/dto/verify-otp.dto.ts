import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
    
    @ApiProperty({ description: 'Эмайл пользователя которому отправлен одноразовый пароль для верификации' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'однаразовый пароль отпарвленный на эмайл' })
    @IsNotEmpty()
    otp: string;
}
