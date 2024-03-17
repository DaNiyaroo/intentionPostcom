import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsStrongPassword } from "class-validator";

export class CreateRegistrationDto {
  
    @ApiProperty({ description: 'Имя пользователя' })
    @IsString()
    firstname: string;
   
    @ApiProperty({ description: 'Фамилия пользователя' })
    @IsString()
    lastname: string;
  
    @ApiProperty({ description: 'Юзернейм пользователя' })
    @IsString()
    username: string;
  
    @ApiProperty({ description: 'Пароль' })
    @IsStrongPassword()
    password: string;
  
    @ApiProperty({ description: 'Номер телефона' })
    @IsNumber()
    phone: number;

}
